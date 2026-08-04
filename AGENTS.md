# AGENTS.md

## Commands

- Install: `pnpm install` (pnpm only; `pnpm-lock.yaml` is committed)
- Dev server: `pnpm dev` (Next.js 16 + Turbopack)
- Build: `pnpm build` (runs typecheck + typed-route codegen)
- Lint/format: `pnpm lint` (Biome check, read-only) or `pnpm check` (`biome check --write`, auto-fixes incl. Tailwind class sorting)
- Typegen: `pnpm typegen` — regenerate `.next/types` after adding/renaming routes
- No test framework or test script exists — do not run tests

## Architecture

- Next.js 16 App Router, React 19. Routes live in `src/app/`; most app logic lives in client components under `src/features/`.
- Features follow a strict per-feature pattern in `src/features/<name>/`:
  - `<name>.service.ts` — axios calls
  - `<name>.hook.ts` — TanStack Query hooks wrapping the service
  - `<name>.schema.ts` — Zod schemas
  - `<name>.type.ts` — TS types
  - `components/` — feature UI
- Shared code: `src/lib/` (axios, query client, utils), `src/stores/` (zustand), `src/schemas/`, `src/types/`, `src/data/` (constants).
- Path alias `@/*` → `src/*`.

## API layer (`src/lib/api.ts`)

- Base URL `https://api.usehaya.io/api/v1` is hardcoded. No env vars are used anywhere in the repo.
- Use the shared `api` axios instance; it auto-attaches the JWT from the auth cookie and handles 401 (token expiry) and 402 (payment) globally. Don't add auth headers or payment/error toasts in individual services.
- Backend calls audits "analyses". A request interceptor rewrites any `audit*` request key (body, params, FormData) to `analysis*`. When adding audit payloads, name fields `audit*`; the backend receives them as `analysis*`.
- `invitationCode` is auto-injected on `/auth/register`, `/auth/login`, `/auth/verify` via a UI prompt.

## Auth & route protection

- Session is a zustand store persisted to the `haya.auth` cookie (7-day expiry), not localStorage.
- `getAuth()` (`src/features/auth/auth-cookie.ts`) reads the cookie on both client (js-cookie) and server (`next/headers`) — use it in server components.
- Pages are NOT protected by middleware; all dashboard routes are public. Auth gating is client-side: the dashboard layout intercepts clicks on elements marked `data-require-auth` and shows the login dialog. Mark new auth-gated CTAs with `data-require-auth`.

## Styling & design system

- Tailwind CSS v4 — there is no `tailwind.config`; the entire theme (colors, radius, fonts, size tokens) is CSS variables in `src/app/globals.css` (`@theme inline`). Edit that file, not a config.
- Dark theme only; the light `.dark` block is commented out.
- Use `cn()` from `@/lib/utils` for class merging. shadcn/ui components live in `src/components/ui/`.
- `design-system.md` is an unfilled template — `globals.css` is the source of truth.

## Toolchain quirks

- `typedRoutes: true`: route strings and `LayoutProps<"/route">` are type-checked against generated `.next/types`. After changing routes, run `pnpm typegen` (or `pnpm dev`/`pnpm build`).
- React Compiler is enabled (`reactCompiler: true` in `next.config.ts`); manual memoization is generally unnecessary.
- `@tryhaya/analytics` must stay in `transpilePackages` in `next.config.ts`.
- Fonts: Lato + Syncopate via `next/font/google` in `src/app/layout.tsx`.
- Commits use conventional prefixes (`feat:`, `fix:`, `style:`).
