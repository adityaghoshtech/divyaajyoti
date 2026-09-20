# Divyajyoti

Production-ready Next.js 14 website for **Astrology, Property, Learning, Events, Insights and VIP & Business**.

## What was fixed

- Increased typography scale and improved spacing across desktop and mobile.
- Added proper font-family fallbacks instead of relying on undefined CSS font variables.
- Improved navigation, buttons, focus states and form readability.
- Reworked enquiry submission so the frontend sends data to `/api/leads`.
- Added a Convex bridge. When `NEXT_PUBLIC_CONVEX_URL` is configured, enquiries are persisted in the Convex `leads` table.
- Kept a safe local fallback so the UI can still be developed before a Convex deployment is connected.
- Converted Convex functions to the documented generic API (`queryGeneric` / `mutationGeneric`), so the project does not depend on a missing `convex/_generated` directory in the repository.
- Added `.env.example` and Convex npm scripts.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Connect Convex

1. Make sure the Convex CLI is available through the local package:

```bash
npx convex dev
```

2. Follow the login/project setup prompts. Convex will create a development deployment and write the deployment URL to `.env.local`.

3. Confirm `.env.local` contains:

```env
NEXT_PUBLIC_CONVEX_URL=https://YOUR-DEPLOYMENT.convex.cloud
```

4. Keep `npx convex dev` running while developing. It syncs the functions in `convex/` to the deployment.

5. Start Next.js in another terminal:

```bash
npm run dev
```

The enquiry form now follows this path:

`Browser → Next.js /api/leads → Convex leads.create → Convex database`

If the Convex URL is not configured, the route returns a successful fallback response for local UI testing but does **not** claim the lead was persisted.

## Production

Set `NEXT_PUBLIC_CONVEX_URL` in the production environment to the production Convex deployment URL before deploying the Next.js app.

Then run:

```bash
npm run build
npm run start
```

## Important

The property, course, event and article pages still contain the supplied demo content from the original project. Replace those records with the business's real content before launch. The Convex schema already contains tables for properties, leads, site visits, consultations, courses and events.
