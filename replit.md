# Cosyn

Cosyn is a mobile-first convention community where fans discover events, plan cosplay, meet attendees, and join event-specific conversations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/cosyn` — responsive React/Vite app and primary product UI.
- `artifacts/api-server/src/routes/cosyn.ts` — convention, attendance, feed, chat, group, and photoshoot API routes.
- `lib/api-spec/openapi.yaml` — source of truth for the generated API client and Zod schemas.
- `lib/db/src/schema/cosyn.ts` — Drizzle schema for Cosyn user, event, social, and community relationships.

## Architecture decisions

- The first release uses a mobile-first responsive web app so it is immediately usable on phones and desktop without maintaining two separate clients.
- Clerk owns authentication and browser sessions; the API uses Clerk middleware while preserving a demo seed user for public preview browsing.
- API contracts are OpenAPI-first and generated into the shared React Query client and Zod validation package.

## Product

The current build includes public discovery, convention search and creation, event detail pages, attendance with cosplay plans, attendee lists, feed posts and likes, convention chats, cosplay groups, photoshoot planning, profiles, and branded Clerk sign-in/sign-up routes.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Restart the API workflow after changing route or middleware code; it is bundled with esbuild before serving.
- Use the generated API hooks and query-key helpers rather than hand-written fetch calls in the frontend.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
