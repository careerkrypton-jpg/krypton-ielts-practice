// Authenticated IELTS practice feedback for Krypton students.
// Audio is sent for transcription only on request and is never stored by this function.
const allowedOrigin = "https://careerkrypton-jpg.github.io";
const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const headers = { ...corsHeaders, "Access-Control-Allow-Origin": origin === allowedOrigin ? allowedOrigin : allowedOrigin };
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return json({ error: "Use POST." }, 405, headers);

  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return json({ error: "Sign in to use AI feedback." }, 401, headers);
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  if (!supabaseUrl || !supabaseKey) return json({ error: "Student authentication is not configured." }, 503, headers);
  if (!openaiKey) return json({ error: "AI scoring is awaiting secure provider setup." }, 503, headers);

  try {
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseKey, authorization: auth },
    });
    if (!userResponse.ok) return json({ error: "Your sign-in has expired. Please sign in again." }, 401, headers);
    const user = await userResponse.json();
    if (!user?.id) return json({ error: "Sign in to use AI feedback." }, 401, headers);

    const body = await req.json();
    const module = body.module === "speaking" ? "speaking" : body.module === "writing" ? "writing" : "";
    if (!module) return json({ error: "AI feedback is available for Writing and Speaking." }, 400, headers);
    const prompt = String(body.prompt || "").slice(0, 3000);
    let responseText = String(body.response || "").slice(0, 12000);
    let transcript = "";

    if (module === "speaking" && body.audio_base64) {
      const encoded = String(body.audio_base64);
      if (encoded.length > 9_000_000) return json({ error: "Recording is too large. Please keep it under about six minutes." }, 413, headers);
      const binary = atob(encoded);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const mime = String(body.audio_mime_type || "audio/webm").split(";")[0];
      const ext = mime.includes("mp4") ? "mp4" : mime.includes("ogg") ? "ogg" : "webm";
      const form = new FormData();
      form.append("model", "gpt-transcribe");
      form.append("response_format", "json");
      form.append("file", new File([bytes], `answer.${ext}`, { type: mime }));
      const transcription = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST", headers: { authorization: `Bearer ${openaiKey}` }, body: form,
      });
      if (!transcription.ok) return json({ error: "Could not transcribe this recording. Try again or type your answer." }, 502, headers);
      transcript = String((await transcription.json()).text || "").slice(0, 12000);
      if (!transcript) return json({ error: "No speech was detected. Please try again or type your answer." }, 422, headers);
      responseText = transcript;
    }
    if (!responseText.trim()) return json({ error: "Add a response before asking for feedback." }, 400, headers);

    const writing = module === "writing";
    const criteria = writing
      ? ["Task Response", "Coherence and Cohesion", "Lexical Resource", "Grammatical Range and Accuracy"]
      : ["Fluency and Coherence", "Lexical Resource", "Grammatical Range and Accuracy"];
    const schema = {
      type: "object", additionalProperties: false,
      properties: {
        estimated_band: { type: "number" },
        criteria: { type: "array", items: { type: "object", additionalProperties: false, properties: {
          name: { type: "string" }, band: { type: "number" }, feedback: { type: "string" },
        }, required: ["name", "band", "feedback"] } },
        strengths: { type: "array", items: { type: "string" } },
        next_steps: { type: "array", items: { type: "string" } },
        next_step: { type: "string" },
        transcript: { type: "string" },
      },
      required: ["estimated_band", "criteria", "strengths", "next_steps", "next_step", "transcript"],
    };
    const rubric = writing
      ? "Assess an IELTS Writing practice response using the four public IELTS writing criteria: task response/achievement appropriate to task type, coherence and cohesion, lexical resource, grammatical range and accuracy."
      : "Assess IELTS Speaking practice from transcript only using fluency and coherence, lexical resource, grammatical range and accuracy. Do not score pronunciation, accent, voice, or vocal delivery because only transcript text is available.";
    const request = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { authorization: `Bearer ${openaiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: "gpt-6-luna", store: false,
        instructions: `You are a careful IELTS practice tutor. Give constructive, specific, encouraging feedback. ${rubric} The result is an indicative learning estimate, never an official IELTS score. Use whole or half band estimates from 0 to 9. Include exactly ${criteria.length} criterion items named: ${criteria.join(", ")}. Keep strengths and next steps concise, grounded in the student's work, and avoid inventing errors. Return transcript exactly as provided; for writing it should be an empty string.`,
        input: `Test type: ${String(body.course || "Academic").slice(0, 40)}\nTask: ${String(body.task_type || module).slice(0, 100)}\nPrompt: ${prompt}\nStudent response: ${responseText}`,
        text: { format: { type: "json_schema", name: "ielts_practice_feedback", strict: true, schema } },
      }),
    });
    if (!request.ok) return json({ error: "AI feedback is temporarily unavailable. Your response can still be saved." }, 502, headers);
    const result = await request.json();
    const outputText = result.output?.flatMap((item: any) => item.content || []).find((item: any) => item.type === "output_text")?.text;
    if (!outputText) return json({ error: "AI feedback returned an empty result." }, 502, headers);
    const feedback = JSON.parse(outputText);
    if (transcript) feedback.transcript = transcript;
    return json({ feedback }, 200, headers);
  } catch (err) {
    console.error("score-ielts-response failed", err);
    return json({ error: "Could not score this response right now. Please try again." }, 500, headers);
  }
});

function json(payload: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(payload), { status, headers: { ...headers, "Content-Type": "application/json" } });
}
