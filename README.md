# Krypton IELTS Practice

A free student practice web app for the Krypton consultancy. It offers original exercises for Listening, Reading, Writing, and Speaking, guided short-form mock tests, student accounts, and private saved progress.

## Set up Supabase

1. Create a Supabase project.
2. In the Supabase SQL Editor, run [supabase/schema.sql](supabase/schema.sql). This creates student profiles and practice history, enables row-level security, and limits each student to their own records.
3. Copy the project URL and the public anon/publishable key from the Supabase project settings into [config.js](config.js).
4. In Supabase Authentication settings, set the allowed site URL and redirect URLs for your deployed domain. Enable email/password sign-in. If email confirmation is enabled, students must confirm their address before signing in.
5. Serve the repository over HTTPS or run it on a local development server. Open `index.html` directly only for a quick visual preview; authentication needs the Supabase configuration.

Only the public anon/publishable key belongs in `config.js`. Never put a service-role key in browser code. The app has no subscriptions or paid access.

## Features

- Email/password student sign-up and sign-in through Supabase Auth
- Per-student progress history stored in Supabase with row-level security
- Original Listening and Reading multiple-choice drills with answer explanations
- Writing prompts with timed task guidance and saved student responses
- Speaking cue cards with a preparation timer and saved notes
- Five guided mini mocks covering all four skills
- Free links to official test-format and familiarisation resources

The mini mocks are short practice simulations, not full-length official IELTS tests. They do not provide an official band score. The sample questions in this repository are original practice material; they are not copied from Cambridge IELTS books, British Council materials, IDP question banks, or other protected sources. Krypton IELTS Practice is an independent preparation resource and is not affiliated with IELTS, Cambridge, the British Council, or IDP.

## Official preparation and format references

- [IELTS test types and format](https://ielts.org/take-a-test/test-types)
- [British Council free practice tests](https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests)
- [IDP familiarisation tests](https://ielts.idp.com/about/ielts-familiarisation-tests)
- [Cambridge English IELTS preparation](https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/)
