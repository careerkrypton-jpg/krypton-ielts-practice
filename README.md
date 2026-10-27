# Krypton IELTS Practice

[Open the free student practice app](https://careerkrypton-jpg.github.io/krypton-ielts-practice/).

Krypton IELTS Practice is the independent practice web app for Kathmandu Krypton Educational Consultancy. Students can choose Academic or General Training IELTS, set a goal and daily study time, practise all four skills, try a fresh mixed practice mock, and keep progress in a private account.

## Student features

- Free account creation and sign-in with password, email verification, or Google (Google OAuth must be configured in Supabase)
- Onboarding for Academic or General Training, target band, daily study time, and optional test date
- Readable, responsive dashboard with a personal study plan
- 107+ Listening sets and 109+ Reading sets, each with four original, self-marked questions
- 112+ Academic and General Training Writing prompts
- 112+ Speaking interview questions and cue cards, with optional audio recording
- AI practice coaching in all four modules: Reading and Listening answer analysis with approximate section-band estimates, plus IELTS-criteria feedback and optional transcription for Writing and Speaking
- Saved practice history and AI feedback, protected by Supabase row-level security
- 200 numbered full mock test forms: 100 each for Academic and General Training. Each has 50 Listening questions, 50 Reading questions, Writing Tasks 1 and 2, and Speaking Parts 1, 2, and 3
- Fresh random full mocks can also be generated without an attempt limit
- Mock tasks are grouped under the four skill modules. Writing Task 1 continues to Task 2, and Speaking moves through Parts 1–3 with a clear next-step control
- No student subscription or paywall

## AI scoring setup

The app calls the Supabase Edge Function at `supabase/functions/score-ielts-response/index.ts`. It uses Groq's free-tier `openai/gpt-oss-120b` model for targeted coaching in all four modules, and `whisper-large-v3-turbo` for requested Speaking audio transcription. Reading and Listening are marked from answer keys; their band estimates use approximate raw-score conversions and are less reliable for short practice sets. Writing and Speaking use practice estimates against the IELTS criteria. Set a private `GROQ_API_KEY` in Supabase Edge Function secrets before deploying. Never put it in `config.js` or GitHub. Free-tier limits can change or be reached, so AI coaching may be temporarily unavailable; answer-key scoring and saving still work.

Objective answer mistakes and typed Writing/Speaking responses are sent for AI coaching only after the student presses the scoring button. Audio is sent for transcription only when the student explicitly requests scoring and is not saved by the function. Speaking feedback is transcript-based and does not assess accent or pronunciation. Scores are practice estimates, not official IELTS band scores. Review the provider's current privacy terms before sending students' work to an external AI provider.

## Supabase

The live app uses the connected Supabase project. Its public site URL and email-confirmation redirect are configured for GitHub Pages. Supabase currently has no custom SMTP server configured; its built-in mailer restricts delivery to pre-authorized project team addresses, so production student email sign-up and verification need a custom SMTP provider.

For a new Supabase project:

1. Run [supabase/schema.sql](supabase/schema.sql) in the SQL Editor. It creates student profiles and practice history, enables row-level security, and limits each student to their own records.
2. Put the project URL and public anon/publishable key in [config.js](config.js).
3. Set the Supabase Authentication site URL and redirect allowlist to your HTTPS app URL. Enable email/password sign-in.
4. Configure a production SMTP provider for Auth email delivery. To send numeric codes, set the Magic Link or OTP email template to use `{{ .Token }}`; the default template sends a link.
5. If you want Google sign-in, create a Google OAuth web client with the Supabase callback URL shown in the provider settings, then add its Client ID and Secret to the Supabase Google provider. Once that provider is enabled, the app's Google button uses it automatically.
6. Create a Groq API key, add it as `GROQ_API_KEY` in Supabase Edge Function secrets, and deploy the Edge Function.
7. Serve the repository over HTTPS. For local development, use a local web server rather than opening `index.html` directly.

Only a public anon/publishable key belongs in browser code. Never put a service-role key or AI provider key in the public repository.

## Practice material

Question sets in the app are original Krypton practice material based on common IELTS task types. The Cambridge IELTS 17 PDF supplied for this project is a reference for understanding the four-test structure and task formats; its questions, passages, answers, and audio scripts are not reproduced or redistributed here. The app also does not reproduce protected British Council or IDP question banks. Krypton IELTS Practice is an independent preparation resource and is not affiliated with IELTS, Cambridge, the British Council, or IDP.

The full mock library follows a timed four-skill sequence, but it is an original practice simulation, not an official IELTS paper. Objective-question scores and AI feedback are for study only; the suggested section times are guidance.

## Official preparation and format references

- [IELTS test types and format](https://ielts.org/take-a-test/test-types)
- [British Council free practice tests](https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests)
- [IDP familiarisation tests](https://ielts.idp.com/about/ielts-familiarisation-tests)
- [Cambridge English IELTS preparation](https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/)

