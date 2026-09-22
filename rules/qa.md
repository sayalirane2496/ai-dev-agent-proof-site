# QA Rules

A task is not ready until all of these pass:

1. `npm run typecheck`
2. `npm run lint`
3. `npm run build`
4. `npm run qa`
5. No console errors on tested pages.
6. Navigation works for all primary pages.
7. Contact form rejects invalid input and succeeds when the database is configured.
8. No horizontal overflow at mobile width.

Use Chromium for the proof. Maximum automatic fix attempts: 3.
