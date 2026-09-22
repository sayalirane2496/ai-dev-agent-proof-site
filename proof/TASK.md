# First Cloud Agent Task

Copy/paste this into Cursor Cloud Agent after connecting the GitHub repository.

---

Build a complete consulting website from the existing repository.

Pages:
- Home
- About
- Services
- How It Works
- Contact

Use the existing theme library components first. Do not create duplicate components when a suitable component already exists.

Requirements:
- Keep the existing visual system unless a change is necessary for the task.
- Make all pages responsive at 390px, 768px, 1024px and 1440px.
- Keep semantic HTML, accessible form labels and useful page metadata.
- The Contact page must validate name, email and message on the server.
- Valid submissions must be stored in the Supabase `leads` table using server-side credentials only.
- Add or update SQL migrations for schema changes.

Quality gate:
- npm run typecheck
- npm run lint
- npm run build
- npm run qa
- Fix failures automatically, up to 3 attempts.

Delivery:
- Work on a feature branch.
- Commit and push the changes.
- Open a pull request.
- Do not merge or deploy production without explicit human approval.
- The Vercel preview must be ready for review.
