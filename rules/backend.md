# Backend Rules

- Validate all external input on the server.
- Return explicit 4xx/5xx responses; never silently swallow failures.
- Never expose service-role keys or other secrets to client-side code.
- Keep API logic small and testable.
