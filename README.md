# AI Development Agent – End-to-End Proof Website

This repository is the first proof project for a remote AI development workflow:

**Instruction → Cursor Cloud Agent → GitHub branch/PR → Vercel Preview → Playwright QA → human approval**

The project deliberately includes:

- Next.js + TypeScript frontend
- Reusable theme library + registry
- Backend API route
- Supabase/Postgres SQL migration
- Server-side validation
- Playwright desktop + mobile QA
- GitHub Actions verification
- Cursor Cloud Agent environment configuration
- `AGENTS.md` and project rules for agent behavior

## Local verification (optional)

```bash
npm install
npx playwright install --with-deps chromium
npm run typecheck
npm run lint
npm run build
npm run qa
```

## Remote proof

Use `proof/REMOTE_SETUP.md` for the one-time GitHub, Cursor Cloud, Supabase and Vercel setup.

Use `proof/TASK.md` as the first instruction to the Cloud Agent.

## Safety

The agent must never commit secrets. Production deployment requires human approval. The proof uses Vercel preview as the deployment gate.
