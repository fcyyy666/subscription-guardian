# Project Handover Context: Subscription Guardian

## 1. Project Status (Current State)
We are building a Subscription Management SaaS (MVP).
- **Phase 1 (Setup):** Completed. Tech stack initialized (Next.js 15, Tailwind, Shadcn, Drizzle, Supabase).
- **Phase 2 (Auth):** Completed. 
  - Login/Signup UI is ready.
  - Middleware for route protection is active.
  - Supabase Auth connected & syncing to `public.users` table.
- **Phase 3 (CRUD):** PENDING. We are about to start this.

## 2. Tech Stack & Rules (Strict)
- **Framework:** Next.js 15 (App Router).
- **Database:** Supabase (PostgreSQL) + Drizzle ORM.
- **Styling:** Tailwind CSS + Shadcn/ui.
- **Validation:** Zod schemas are required for all inputs.
- **Server Actions:** ALL data mutations must use Server Actions (`use server`).

## 3. Database Schema (Existing)
Already pushed to Supabase.
- Table `users`: id, email, full_name, etc.
- Table `subscriptions`: id, user_id, name, amount, currency, billing_cycle, start_date, next_payment_date.

## 4. Immediate Task (Next Step)
We need to implement the **Create Subscription** flow.
- Backend: A Server Action to validate input (Zod), calculate `next_payment_date`, and insert into DB.
- Frontend: A form using Shadcn components to collect subscription details.