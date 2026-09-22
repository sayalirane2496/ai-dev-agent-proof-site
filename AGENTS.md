# AI Development Agent – Proof Site

This repository is a proof of an autonomous website delivery workflow.

## Mission

Turn a natural-language request into a tested GitHub change and Vercel preview without unnecessary local work.

## Mandatory workflow

1. Read this file and the relevant files under `rules/`.
2. Inspect `theme-library/registry.json` and the referenced component source before creating UI.
3. Reuse existing components when suitable.
4. Implement frontend, backend and database changes when the request requires them.
5. Run `npm run typecheck`, `npm run lint`, `npm run build`, then `npm run qa`.
6. If QA fails, identify the root cause, fix it, and rerun the failed checks. Do not make unrelated changes.
7. Allow at most 3 fix attempts for one task. After that, stop and report the remaining blockers.
8. Never commit secrets or `.env` files.
9. Work on a feature branch and open a PR when the change is ready.
10. Vercel preview is the deployment gate. Production requires explicit human approval.

## Theme library rule

Before adding a new component, search `theme-library/registry.json` and inspect existing components. Add a new reusable component only when no suitable component exists.

## Database rule

Schema changes must be represented as migrations. Never modify a production database directly from agent code.

## Cursor Cloud specific instructions

Cloud Agents have their own development VM. Use repository files, configured environment variables/secrets, and the project commands. The cloud environment should be able to install dependencies and run Chromium tests. See `.cursor/environment.json`.

## Definition of done

- Requested behavior implemented.
- Existing behavior preserved unless intentionally changed.
- Typecheck/lint/build pass.
- Playwright proof passes.
- Git changes are focused and reviewable.
- Vercel preview is ready for human review.
