# Implementation decisions

Autonomous choices for the Burger King–style rebuild. Product behavior stays within the design reference. New product features were not invented.

| ID | Decision | Rationale |
|---|---|---|
| D1 | Overlay SPA on `/` plus `/login`, `/admin`, `/kitchen` | Matches reference UX; extra routes only for auth and operations |
| D2 | Guest checkout without required login | Reference has no login on checkout |
| D3 | Optional Supabase Auth email/password | Required for history, rewards, addresses, admin |
| D4 | Roles `customer`, `admin`, `restaurant` on `profiles` | One auth system, RBAC for admin/kitchen |
| D5 | Guest cart in `httpOnly` cookie; server reprices | No service-role key in this environment; cookie cart + RPC checkout |
| D6 | Pricing: customizer **UI** math (cheese, patty, meal, sauce, size) | Preserves what the shopper sees in the customizer |
| D7 | Single `fulfillmentType` for location, fee, and checkout | Fixes reference split so pickup actually zeros delivery fee |
| D8 | GST 5% of subtotal; ₹35 delivery under ₹299; coupon table as in `App.tsx` | Observed reference logic; documented as demo policy |
| D9 | Mock/sandbox payments; COD is a real unpaid order state | No paid PSP; UI never claims a bank charge succeeded |
| D10 | Tailwind CSS + `lucide-react` | Free/open-source; required to match the Tailwind reference |
| D11 | `@supabase/supabase-js` + `@supabase/ssr` | Required for Auth and Postgres |
| D12 | `SECURITY DEFINER` RPCs for quote, checkout, redeem, admin status | Elevated writes without putting service-role in the browser |
| D13 | Demo seed users in docs only (not production credentials) | Needed to exercise admin/customer QA |
| D14 | Admin and kitchen in the same Next.js app | No separate backend |
| D15 | Catalog is global (not per-restaurant) | Reference menu does not change with outlet |
| D16 | Integer INR rupees | Matches reference prices |
| D17 | Seed points 1250 only for demo customer | Matches rewards UI starting balance |
| D18 | Tracking uses stored status + client ETA animation from reference | No logistics partner |
| D19 | Address Edit/Add work for signed-in users | Reference Edit was inert; required by authorized admin/customer flow |
| D20 | Redeem creates a one-time coupon `REWARD-{id}` worth listed INR or free-item credit | Reference decrement-only; production needs a cart effect |
| D22 | Guest orders live in session UI after checkout | RLS cannot let anonymous browsers read `user_id is null` orders without opening all guest orders |
| D23 | Demo identities omit generated `auth.identities.email` | Column is generated from identity_data |

Demo accounts (development/QA, **not** production):

- Customer: `customer@demo.local` / `DemoCustomer123!`
- Admin: `admin@demo.local` / `DemoAdmin123!`
- Kitchen (Andheri): `kitchen@demo.local` / `DemoKitchen123!`
