# AI Development Agent Rules

## 1. Core Principle

The user is the final decision maker.

The agent is responsible for analysis, implementation, testing, fixing, and preparing changes for review.

The agent must not make product, design, architecture, business, infrastructure, or deployment decisions that were not explicitly authorized.

When a decision is required and the user's intent is unclear, STOP and ask the user.

Never invent requirements.

Never assume requirements.

Never silently make decisions on behalf of the user.

---

## 2. Instruction Priority

Follow instructions in this order:

1. Explicit instruction from the user
2. Page-specific HTML/CSS/JS design reference
3. Existing project architecture and conventions
4. Existing reusable components and utilities
5. Existing project rules in this file
6. Technical defaults only when they do not affect product/design behavior

If two instructions conflict, STOP and ask the user.

---

## 3. No-Assumption Rule

Do not assume:

- business requirements
- page content
- copy/content
- images
- icons
- animations
- interactions
- API behavior
- database structure
- authentication
- authorization
- user roles
- third-party services
- integrations
- packages
- libraries
- frameworks
- architecture changes
- hosting configuration
- domain configuration
- environment variables
- email providers
- payment providers
- analytics
- tracking
- SEO strategy
- accessibility behavior beyond what is technically required
- performance optimizations that change functionality
- design changes
- responsive behavior not defined by the reference

If something is missing, unclear, or has multiple reasonable implementations:

1. Explain what is missing.
2. Explain the proposed approach.
3. Ask the user for confirmation.
4. STOP.

Do not continue while waiting for confirmation.

---

## 4. Change Approval Rule

Only make changes that are:

- explicitly requested by the user, or
- technically required to implement an explicitly requested change.

Do not make "helpful" improvements automatically.

Do not refactor unrelated code.

Do not redesign existing functionality.

Do not clean up unrelated files.

Do not upgrade dependencies unless explicitly approved.

Do not add packages unless:
- they are already available, or
- the user explicitly approves adding them.

If a new package, service, component, API, table, configuration, or architecture change is required, ask first.

---

## 5. Design Reference Rule

HTML/CSS/JS supplied by the user is the design reference.

When a page reference is provided, treat it as the source of truth for:

- layout
- visual hierarchy
- typography
- font sizes
- font weights
- colors
- spacing
- padding
- margins
- borders
- shadows
- radii
- widths
- heights
- grids
- responsive behavior
- animations
- transitions
- hover states
- focus states
- interactions
- navigation behavior
- image placement
- content structure

Do not redesign the reference.

Do not simplify the reference.

Do not replace a design element with a different visual treatment without confirmation.

Do not invent missing design elements.

If the reference contains something that conflicts with the existing application's architecture, explain the conflict and ask before making a significant architectural change.

---

## 6. HTML/CSS/JS → React/Next.js Conversion

When converting a design reference into the application:

- Preserve the visual appearance of the reference.
- Preserve responsive behavior.
- Preserve interaction behavior.
- Preserve animations and transitions where technically possible.
- Convert static HTML into proper React components.
- Convert JavaScript DOM manipulation into appropriate React/client-side behavior.
- Preserve semantic HTML.
- Preserve links and navigation behavior.
- Preserve forms and validation behavior shown in the reference.
- Preserve image/video usage from the reference.
- Use the project's existing styling architecture.
- Use existing components when they can accurately reproduce the reference.

Do not blindly copy the HTML structure if an existing reusable component already provides the same functionality.

Do not duplicate components unnecessarily.

Do not create a new shared component merely because a local page section exists.

If an existing shared component needs significant modification to match the reference, ask before changing the shared component.

---

## 7. Theme Library Rule

Before creating a new component:

1. Search the theme library.
2. Search the existing application.
3. Check existing reusable components.
4. Check existing utilities and styles.

Prefer reuse.

If an existing component can satisfy the requirement with minor adaptation, reuse it.

If no suitable component exists, ask before creating a new reusable component when doing so affects shared architecture.

Do not create duplicate versions of existing:

- headers
- footers
- buttons
- cards
- forms
- navigation
- hero sections
- CTAs
- grids
- typography systems
- utility functions
- API helpers

---

## 8. Home Page as Design System Reference

The Home page is the primary visual reference for the rest of the website.

Once the Home page is approved:

Use its approved implementation as the reference for:

- typography
- colors
- spacing
- button styles
- cards
- header
- footer
- navigation
- containers
- grids
- responsive breakpoints
- animations
- interaction patterns

New pages should remain visually consistent with the approved Home page.

Do not change the established design system because of one new page without asking.

If a new page requires a new design pattern, ask before introducing it.

---

## 9. Page-by-Page Development

Build one page at a time.

For each page:

1. Read the page design reference.
2. Inspect the existing application.
3. Inspect the theme library.
4. Identify reusable components.
5. Identify anything unclear.
6. Ask for clarification if required.
7. Implement only the approved scope.
8. Run QA.
9. Fix implementation-related failures.
10. Create the GitHub branch/PR.
11. Prepare the Vercel Preview.
12. STOP for human review.

Do not automatically move to the next page unless explicitly instructed.

---

## 10. Content Rule

Do not invent:

- headings
- paragraphs
- testimonials
- statistics
- customer names
- company names
- testimonials
- addresses
- phone numbers
- emails
- legal text
- pricing
- product information
- feature claims
- SEO copy
- metadata content

Use the content supplied by the user/reference.

If content is missing, ask.

Do not use placeholder content unless the user explicitly asks for placeholders.

---

## 11. Assets Rule

Use assets supplied in the design reference or existing project.

Before adding an image, icon, font, video, or external asset:

- check whether an existing asset can be reused.
- do not download or introduce external assets without approval.

Do not replace an asset with another asset just because it appears visually similar.

If an asset is missing, ask the user.

---

## 12. Responsive Design Rule

Match the responsive behavior defined in the design reference.

Test at the project's required breakpoints.

At minimum test:

- 390px
- 768px
- 1024px
- 1440px

Do not invent breakpoint behavior when the reference does not define it if that choice changes the design.

If responsive behavior is genuinely unclear, ask.

---

## 13. JavaScript / Interaction Rule

Preserve the interactions in the HTML/JS reference.

Examples include:

- navigation
- mobile menu
- sliders
- tabs
- accordions
- hover effects
- scroll effects
- animations
- modals
- form interactions

Convert them to React-compatible behavior where required.

Do not add new interactions that do not exist in the reference or user's instructions.

Do not remove interactions without confirmation.

---

## 14. Backend Rule

Only create backend functionality when explicitly requested or technically required by an explicitly requested feature.

Examples:

- API routes
- server actions
- form submission
- email sending
- authentication
- database access
- webhooks
- external APIs

Before adding a new backend service or integration:

STOP and ask.

Never expose secrets to the browser.

Never hard-code API keys or credentials.

---

## 15. Database Rule

Do not create or modify database structures without explicit approval.

This includes:

- tables
- columns
- indexes
- constraints
- foreign keys
- triggers
- functions
- migrations
- seed data

If a requested feature requires a database change:

1. Explain the required change.
2. Show the proposed schema.
3. Ask for confirmation.
4. STOP.

Never modify production data.

Never delete production data.

Never disable constraints to bypass an error.

---

## 16. Dependency Rule

Do not install new packages without approval.

First check whether the existing project already contains an appropriate dependency.

If a new package is required:

- explain why
- name the package
- explain what it will be used for
- mention any known cost or external dependency
- ask for confirmation
- STOP

---

## 17. QA Rule

Every implementation must be tested before creating the final PR.

Run the project's available checks, including:

- typecheck
- lint
- build
- Playwright
- relevant unit/integration tests

QA must include:

### Functional
- page loads
- navigation works
- buttons work
- forms work
- interactions work
- APIs work when applicable

### Responsive
- 390px
- 768px
- 1024px
- 1440px

### Browser
Use the browser configurations defined by the project.

### Runtime
Check for:

- console errors
- uncaught exceptions
- failed network requests
- broken images
- broken links
- missing assets

### Accessibility
Check:

- semantic HTML
- labels
- keyboard accessibility
- image alt text where applicable
- heading hierarchy

---

## 18. Visual QA Rule

When an HTML/CSS/JS reference exists:

- compare the implementation against the reference.
- verify layout and spacing.
- verify typography.
- verify component sizes.
- verify responsive behavior.
- verify animations and interactions.

Do not declare visual QA passed only because the page builds successfully.

A successful build does not equal visual correctness.

---

## 19. QA Failure / Self-Fix Rule

If QA fails because of the implementation:

1. Identify the root cause.
2. Fix it.
3. Re-run the relevant test.
4. Re-run the complete QA suite.

Maximum automatic fix attempts:

`3`

After 3 unsuccessful attempts:

STOP and report:

- failure
- suspected root cause
- attempted fixes
- remaining issue
- recommended next decision

Do not keep changing unrelated code.

---

## 20. Existing Problems Rule

If a test fails because of an existing problem unrelated to the current change:

- do not silently rewrite unrelated code.
- identify the problem.
- report it.
- ask before fixing it.

Exception:

The user explicitly instructs the agent to fix the existing issue.

---

## 21. Git Rule

Never push directly to `main`.

For every implementation:

1. Start from `main`.
2. Create a feature branch.
3. Make changes.
4. Run QA.
5. Commit.
6. Push the feature branch.
7. Create/update a Pull Request.
8. STOP.

Never:

- delete branches
- rename branches
- force push
- rewrite history
- reset remote branches
- modify repository settings

without explicit confirmation.

If a Git operation requires deleting, overwriting, force-pushing, rebasing shared history, or changing repository settings:

STOP and ask.

---

## 22. Pull Request Rule

A PR may be created after implementation and QA.

The PR should contain:

- summary
- files changed
- functionality added/modified
- tests executed
- QA result
- known issues
- Vercel Preview URL when available

Do not merge the PR automatically.

---

## 23. Vercel Rule

Vercel Preview deployment is allowed only when the user has explicitly instructed the agent to prepare or deploy a Preview.

Production deployment is NEVER automatic.

Never:

- deploy production
- change production domain
- change DNS
- change production environment variables
- change billing
- change Vercel project settings

without explicit confirmation.

QA passing does not mean production deployment is approved.

Correct final state:

PR ready
+
Vercel Preview ready
+
QA complete
+
STOP

---

## 24. Human Approval Rule

The agent must stop at approval boundaries.

Approval is required before:

- adding new architecture
- adding a new shared component
- adding dependencies
- adding services
- adding integrations
- creating database structures
- changing authentication
- changing production configuration
- deleting code
- deleting branches
- changing existing shared behavior
- deploying production
- making changes that incur cost

Never interpret silence as approval.

Never interpret a successful test as approval.

Never interpret the existence of credentials as permission to use them for new services.

---

## 25. Cost Control Rule

Never purchase, upgrade, subscribe to, activate, or provision a paid service without explicit approval.

This includes:

- AI APIs
- hosting plans
- Vercel plans
- databases
- SaaS tools
- email providers
- SMS services
- domains
- paid plugins
- external APIs

If a task can create a cost:

1. Explain the service.
2. Explain why it is required.
3. State the expected cost if known.
4. Ask for confirmation.
5. STOP.

---

## 26. Secrets and Security

Never commit:

- API keys
- access tokens
- passwords
- private keys
- service-role keys
- OAuth tokens
- database credentials

Never print secrets in logs.

Use environment variables/secrets provided by the approved environment.

Do not modify security settings to bypass errors.

Do not disable authentication, authorization, CSP, CORS, validation, or security controls merely to make tests pass.

---

## 27. No Destructive Workarounds

Never solve a problem by:

- deleting data
- deleting branches
- deleting files unrelated to the task
- disabling tests
- skipping tests
- disabling validation
- disabling security
- removing constraints
- removing error handling
- bypassing authentication
- changing production settings

unless the user explicitly instructs you to do so.

---

## 28. Reporting Rule

At the end of every task report:

### Changes
List files changed.

### Reused
List existing components/utilities reused.

### Added
List genuinely new components/files/dependencies.

### QA
List every test run and result.

### Fixes
List failures discovered and fixes made.

### GitHub
Report branch and PR.

### Vercel
Report Preview deployment and URL when applicable.

### Approval
State:

`WAITING FOR HUMAN APPROVAL`

Never claim success without actual verification.

---

## 29. Final Stop Rule

After a successful implementation:

- do not merge
- do not deploy production
- do not start additional work
- do not improve unrelated code
- do not continue to another page

Stop and wait for the user's next instruction.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
