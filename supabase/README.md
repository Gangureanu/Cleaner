# Supabase setup

1. Create a Supabase project.
2. Run [`schema.sql`](./schema.sql) in the Supabase SQL Editor.
3. In Authentication, create an admin user. Copy that user's UUID and add it in the SQL Editor:

   ```sql
   insert into public.admin_users (user_id)
   values ('ADMIN_AUTH_USER_UUID');
   ```

4. Copy the project URL and anon/public key into `.env.local`:

   ```text
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Add the same two environment variables to the Vercel project and redeploy.
6. Sign in at `/admin`, then add future date/time slots before accepting bookings.
   To add several slots at once, choose a start date, an optional end date, and a
   start and end time. The same time range is added on every date in the inclusive range,
   including weekends. Leave the end date blank for a single slot. The batch is
   saved together: if any selected date/time already exists, no slots are added.
   New slots must last 1 to 8 hours on the same day; partial hours are supported.
   Customers book the entire range, with duration and estimated price calculated
   automatically. Rescheduling to a slot with an end time also updates the
   booking's duration. Existing slots without end times keep the hours selector.
   The dashboard can confirm or cancel requests, mark payment status, and
   reschedule pending or confirmed bookings. Cancellation and rescheduling send
   the customer an email.
7. Verify a sender domain in Resend, then configure `RESEND_API_KEY`,
   `BOOKING_FROM_EMAIL`, and `ADMIN_BOOKING_EMAIL` in `.env.local` and Vercel.
   `BOOKING_FROM_EMAIL` must use the verified sender domain.
   Set `ADMIN_BOOKING_EMAIL=info@emeraldspotless.ie` for booking alerts and
   `NEXT_PUBLIC_SITE_URL=https://emeraldspotless.ie` in Production.
8. After saving all Production environment variables, redeploy in Vercel.
   Environment changes do not affect an existing deployment. Verify the Resend
   domain is ready, then test a booking request and its confirmation/cancellation
   emails before accepting live bookings.

The public key is designed for browser use. Row-level security in `schema.sql` limits
public access to available slots and booking creation. Do not put a Supabase service
role key in client code or a `NEXT_PUBLIC_` variable.

New requests email the admin and the customer. When an admin confirms or cancels a
booking, the customer receives a status update. Email credentials are used only by
server-side routes and must never be exposed as `NEXT_PUBLIC_` variables.

The contact form submits to `/api/contact` and uses the same `RESEND_API_KEY`
and verified `BOOKING_FROM_EMAIL` sender. Enquiries go to
`contact@emeraldspotless.ie`, with the visitor's email as Reply-To. No email app
is required on the visitor's device. The form only confirms success after Resend
accepts the email; failures are shown on the form and logged on the server.

## Updating an existing database for slot end times

Before deploying the end-time feature, rerun [`schema.sql`](./schema.sql) in the
Supabase SQL Editor. It adds nullable end times to slots and bookings, allows
fractional booking hours, and updates booking/rescheduling functions to calculate
the full duration from the stored slot. Existing slots and bookings are preserved;
no end times are guessed for older records. The database, not submitted customer
hours, determines duration for slots with an end time.
