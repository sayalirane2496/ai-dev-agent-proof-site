# Database Rules

- Schema changes must be SQL migrations under `database/migrations` (or the existing `database` folder for the proof migration).
- Never hard-code database credentials.
- Prefer least-privilege access; the public client must not receive service-role credentials.
- Do not create public write policies unless explicitly required and reviewed.
