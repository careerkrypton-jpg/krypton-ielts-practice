# Krypton IELTS Practice

[Open the free student practice app](https://careerkrypton-jpg.github.io/krypton-ielts-practice/).

Krypton IELTS Practice is the independent practice web app for Kathmandu Krypton Educational Consultancy. Students can choose Academic or General Training IELTS, set a goal and daily study time, practise all four skills, try a fresh mixed practice mock, and keep progress in a private account.

## Student features

- Free email/password sign-up and sign-in
- Onboarding for Academic or General Training, target band, daily study time, and optional test date
- Readable, responsive dashboard with a personal study plan
- Original Listening and Reading drills with answer explanations
- Academic and General Training Writing prompts
- Speaking interview questions and cue cards, with optional audio recording
- AI practice feedback for typed Writing and Speaking responses; optional Speaking audio transcription
- Saved practice history and AI feedback, protected by Supabase row-level security
- Random four-skill practice mixes and unlimited attempts
- No student subscription or paywall

## AI scoring setup

The app calls the Supabase Edge Function at `supabase/functions/score-ielts-response/index.ts`. AI feedback stays unavailable until the function is deployed to the connected Supabase project and its `OPENAI_API_KEY` secret is set in Supabase Edge Function secrets. The key must remain private; never add it to `config.js` or GitHub.

OpenAI usage can incur API charges. This does not add a subscription or charge to the student app, but the consultancy account that owns the API key pays for model use. Audio is sent for transcription only when the student explicitly requests scoring and is not saved by the function. Speaking feedback is transcript-based and does not assess accent or pronunciation. Scores are practice estimates, not official IELTS band scores.

## Supabase

The live app uses the connected Supabase project. Its public site URL and email-confirmation redirect are configured for GitHub Pages.

For a new Supabase project:

1. Run [supabase/schema.sql](supabase/schema.sql) in the SQL Editor. It creates student profiles and practice history, enables row-level security, and limits each student to their own records.
2. Put the project URL and public anon/publishable key in [config.js](config.js).
3. Set the Supabase Authentication site URL and redirect allowlist to your HTTPS app URL. Enable email/password sign-in.
4. Deploy the Edge Function and set its `OPENAI_API_KEY` secret in Supabase.
5. Serve the repository over HTTPS. For local development, use a local web server rather than opening `index.html` directly.

Only a public anon/publishable key belongs in browser code. Never put a service-role key or OpenAI key in the public repository.

## Practice material

Question sets in the app are original Krypton practice material based on common IELTS task types. The Cambridge IELTS 17 PDF supplied for this project is a reference for understanding the four-test structure and task formats; its questions, passages, answers, and audio scripts are not reproduced or redistributed here. The app also does not reproduce protected British Council or IDP question banks. Krypton IELTS Practice is an independent preparation resource and is not affiliated with IELTS, Cambridge, the British Council, or IDP.

The mini mocks are practice simulations, not full-length official IELTS tests. Automatic objective-question scores and AI feedback are for study only.

## Official preparation and format references

- [IELTS test types and format](https://ielts.org/take-a-test/test-types)
- [British Council free practice tests](https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests)
- [IDP familiarisation tests](https://ielts.idp.com/about/ielts-familiarisation-tests)
- [Cambridge English IELTS preparation](https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/)
