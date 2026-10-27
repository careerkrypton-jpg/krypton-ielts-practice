// Authenticated IELTS practice feedback for Krypton students.
// Audio is sent for transcription only on request and is never stored by this function.
const allowedOrigin = "https://careerkrypton-jpg.github.io";
const MAX_REQUEST_BYTES = 10_000_000;
const corsHeaders = {
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

type JsonBody = Record<string, unknown>;
type JsonBodyResult =
  | { ok: true; body: JsonBody }
  | { ok: false; status: 400 | 413; error: string };

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const headers: Record<string, string> = { ...corsHeaders };
  if (origin === allowedOrigin) headers["Access-Control-Allow-Origin"] = allowedOrigin;
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return json({ error: "Use POST." }, 405, headers);
  if (!/^application\/json(?:\s*;|$)/i.test(req.headers.get("content-type") || "")) {
    return json({ error: "Send a JSON request." }, 415, headers);
  }
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return json({ error: "Request body is too large." }, 413, headers);
  }

  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) return json({ error: "Sign in to use AI feedback." }, 401, headers);
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
  const groqKey = Deno.env.get("GROQ_API_KEY");
  if (!supabaseUrl || !supabaseKey) return json({ error: "Student authentication is not configured." }, 503, headers);
  if (!groqKey) return json({ error: "Free AI scoring is awaiting secure Groq setup. Please type your answer or save it for now." }, 503, headers);

  try {
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: { apikey: supabaseKey, authorization: auth },
    });
    if (!userResponse.ok) return json({ error: "Your sign-in has expired. Please sign in again." }, 401, headers);
    const user = await userResponse.json();
    if (!user?.id) return json({ error: "Sign in to use AI feedback." }, 401, headers);

    const parsedBody = await readJsonBody(req, MAX_REQUEST_BYTES);
    if (!parsedBody.ok) return json({ error: parsedBody.error }, parsedBody.status, headers);
    const body = parsedBody.body;
    const allowedModules = ["listening", "reading", "writing", "speaking"];
    const moduleInput = typeof body.module === "string" ? body.module : "";
    const module = allowedModules.includes(moduleInput) ? moduleInput : "";
    if (!module) return json({ error: "AI feedback is available for all four practice modules." }, 400, headers);
    const objectiveMode = module === "reading" || module === "listening";
    const objective = objectiveMode && body.objective && typeof body.objective === "object" ? body.objective : null;
    if (objectiveMode && (!Number.isFinite(Number(objective?.band_estimate)) || Number(objective?.band_estimate) < 1 || Number(objective?.band_estimate) > 9)) {
      return json({ error: "A valid practice band estimate is required for objective feedback." }, 400, headers);
    }
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
      form.append("model", "whisper-large-v3-turbo");
      form.append("response_format", "json");
      form.append("file", new File([bytes], `answer.${ext}`, { type: mime }));
      const transcription = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST", headers: { authorization: `Bearer ${groqKey}` }, body: form,
      });
      if (!transcription.ok) return json({ error: "Could not transcribe this recording. Try again or type your answer." }, 502, headers);
      transcript = String((await transcription.json()).text || "").slice(0, 12000);
      if (!transcript) return json({ error: "No speech was detected. Please try again or type your answer." }, 422, headers);
      responseText = transcript;
    }
    if (!responseText.trim() && !objectiveMode) return json({ error: "Add a response before asking for feedback." }, 400, headers);

    const writing = module === "writing";
    const criteria = writing
      ? ["Task Response", "Coherence and Cohesion", "Lexical Resource", "Grammatical Range and Accuracy"]
      : module === "speaking"
        ? ["Fluency and Coherence", "Lexical Resource", "Grammatical Range and Accuracy"]
        : module === "reading"
          ? ["Reading Accuracy", "Evidence and Question Strategy"]
          : ["Listening Accuracy", "Listening and Detail Strategy"];
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
      : module === "speaking"
        ? "Assess IELTS Speaking practice from transcript only using fluency and coherence, lexical resource, grammatical range and accuracy. Do not score pronunciation, accent, voice, or vocal delivery because only transcript text is available."
        : module === "reading"
          ? "Coach IELTS Reading from the objective answer report. Explain the missed-answer patterns and practical evidence-finding strategies. Do not invent errors or change the supplied raw-score band estimate."
          : "Coach IELTS Listening from the objective answer report. Explain missed-answer patterns and practical prediction, detail-tracking, and checking strategies. Do not invent errors or change the supplied raw-score band estimate.";
    const request = await fetch("https://api.groq.com/openai/v1/responses", {
      method: "POST",
      headers: { authorization: `Bearer ${groqKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b", store: false,
        instructions: `You are a careful IELTS practice tutor. Give constructive, specific, encouraging feedback. ${rubric} The result is an indicative learning estimate, never an official IELTS score. Use whole or half band estimates from 0 to 9. Include exactly ${criteria.length} criterion items named: ${criteria.join(", ")}. Keep strengths and next steps concise, grounded in the student's work, and avoid inventing errors. Return transcript exactly as provided; for writing it should be an empty string. ${objectiveMode ? `The objective raw-score conversion supplied in the input is authoritative; set estimated_band and both criterion bands to exactly ${Number(objective.band_estimate)}.` : ""}`,
        input: `Test type: ${String(body.course || "Academic").slice(0, 40)}\nTask: ${String(body.task_type || module).slice(0, 100)}\nPrompt: ${prompt}\nStudent response: ${responseText}${objectiveMode ? `\nObjective answer report: ${JSON.stringify(objective).slice(0, 7000)}` : ""}`,
        text: { format: { type: "json_schema", name: "ielts_practice_feedback", strict: true, schema } },
      }),
    });
    if (!request.ok) {
      console.error("Groq scoring request failed", request.status);
      return json({ error: "Free AI feedback is temporarily unavailable or its free-tier limit was reached. Your response can still be saved." }, 502, headers);
    }
    const result = await request.json();
    const outputText = result.output?.flatMap((item: any) => item.content || []).find((item: any) => item.type === "output_text")?.text;
    if (!outputText) return json({ error: "AI feedback returned an empty result." }, 502, headers);
    const feedback = JSON.parse(outputText);
    if (transcript) feedback.transcript = transcript;
    if (objectiveMode) {
      feedback.estimated_band = Number(objective.band_estimate);
      feedback.criteria = (feedback.criteria || []).map((item: any) => ({ ...item, band: Number(objective.band_estimate) }));
      feedback.transcript = "";
    }
    return json({ feedback }, 200, headers);
  } catch (err) {
    console.error("score-ielts-response failed", err);
    return json({ error: "Could not score this response right now. Please try again." }, 500, headers);
  }
});

async function readJsonBody(req: Request, maxBytes: number): Promise<JsonBodyResult> {
  const reader = req.body?.getReader();
  if (!reader) return { ok: false, status: 400, error: "A JSON request body is required." };

  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      await reader.cancel().catch(() => {});
      return { ok: false, status: 413, error: "Request body is too large." };
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    return { ok: false, status: 400, error: "Request body must be valid JSON." };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, status: 400, error: "Request body must be a JSON object." };
  }
  return { ok: true, body: parsed as JsonBody };
}

function json(payload: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(payload), { status, headers: { ...headers, "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

