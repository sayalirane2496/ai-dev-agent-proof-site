# Remote setup checklist

1. Create a GitHub repository and push this project to the default branch.
2. In Cursor, connect GitHub and allow access to this repository.
3. Open Cursor Cloud Agents and create an environment for this repository. Cursor supports repository connection, secrets, an install command and a prepared Build for Cloud Agents.
4. Add these cloud environment secrets:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Run the SQL in `database/001_create_leads.sql` once in your Supabase project.
6. Connect the GitHub repository to Vercel. Let Vercel create preview deployments for pull requests.
7. Start the task from `proof/TASK.md` in Cursor Cloud Agent.
8. Review the PR and Vercel preview. Merge only after the preview QA is clean.
