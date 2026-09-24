# QA spec

Commands: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run qa`.

Playwright covers:

- Home sections and navigation
- Menu search/filter/product open/qty
- Customizer and combo
- Cart add/inc/dec/remove/coupon/totals
- Guest checkout validation + sandbox/COD copy
- Tracking modal
- Rewards/history/addresses UI
- Login page + admin/kitchen authz when logged out
- Viewports 390, 768, 1024, 1440
- Console/pageerror capture on home
- Heading, labels, buttons

Visual QA is against `design-reference/burgerking/source/` and is not claimed pass from Playwright alone.

Demo accounts (not production): see `docs/DECISIONS.md`.
