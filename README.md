# Krypton IELTS Practice

[Open the free student practice app](https://careerkrypton-jpg.github.io/krypton-ielts-practice/).

Krypton IELTS Practice is a free IELTS preparation web app for the Krypton consultancy. Students can create an account, practise Listening, Reading, Writing, and Speaking, take guided mini mocks, and keep their progress synced privately.

## Student features

- Free email/password sign-up and sign-in
- Private progress history protected by Supabase row-level security
- Original Listening and Reading drills with answer explanations
- Timed Writing prompts and saved drafts
- Speaking cue cards, preparation timer, and saved notes
- Five guided mini mocks across all four skills
- Links to official test-format and familiarisation resources
- No subscriptions or paid access

The live app uses the connected Supabase project. Its public site URL and email-confirmation redirect are configured for GitHub Pages.

## Self-hosting

1. Create a Supabase project.
2. Run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL Editor. It creates student profiles and practice history, enables row-level security, and limits each student to their own records.
3. Put the project URL and public anon/publishable key in [config.js](config.js).
4. Set the Supabase Authentication site URL and redirect allowlist to your HTTPS app URL. Enable email/password sign-in.
5. Serve the repository over HTTPS. For local development, use a local web server rather than opening `index.html` directly.

Only a public anon/publishable key belongs in browser code. Never put a service-role key in `config.js`.

## Practice material

The mini mocks are short practice simulations, not full-length official IELTS tests. They do not provide an official band score. Sample questions are original practice material, not copied from Cambridge IELTS books, British Council materials, IDP question banks, or other protected sources. Krypton IELTS Practice is an independent preparation resource and is not affiliated with IELTS, Cambridge, the British Council, or IDP.

## Official preparation and format references

- [IELTS test types and format](https://ielts.org/take-a-test/test-types)
- [British Council free practice tests](https://takeielts.britishcouncil.org/prepare/ielts-free-practice-mock-tests)
- [IDP familiarisation tests](https://ielts.idp.com/about/ielts-familiarisation-tests)
- [Cambridge English IELTS preparation](https://www.cambridgeenglish.org/exams-and-tests/ielts/preparation/)
