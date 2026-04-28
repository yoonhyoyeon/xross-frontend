# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Xross** is a React-based admin dashboard for an unmanned store theft detection and integrated monitoring platform. It cross-validates edge AI (YOLO + BoT-SORT), IoT sensors (weight sensors, freezer cameras), and POS data to detect unpaid exits in real time.

Three user roles: **점주(store owner)** — monitors alerts and events; **관리자(system admin)** — manages AI models, servers, multi-store; **고객(customer)** — indirect subject of behavior analysis.

## Commands

```bash
npm run dev          # Vite dev server
npm run build        # tsc -b + vite build
npm run lint         # ESLint
npm run format       # Prettier (write)
npm run format:check # Prettier (check only)
```

No test runner is configured yet.

## Architecture

### Entry Point & Routing

`main.tsx` → `App.tsx` (uses `useRoutes`) → `src/app/routes.tsx`

Two layout shells:
- **`AuthLayout`** (`/auth/*`) — split-panel: left branding, right form
- **`RootLayout`** (`/*`) — sidebar (desktop) + bottom nav (mobile) wrapping an `<Outlet>`

Default route `/` redirects to `/monitoring`. Wildcard `*` redirects to `/auth/login` (temporary; no real auth guard yet).

### Feature Structure

Each domain lives under `src/features/<domain>/` with consistent sub-folders:

```
features/<domain>/
  components/   # UI building blocks for this domain
  pages/        # Route-level components
  types/        # <domain>.types.ts
  data/         # <domain>.mock.ts (mock data, no backend yet)
```

**monitoring** — Core feature. `MonitoringPage` composes: CCTV grid (`CameraGrid`), behavior analytics chart (`AnalyticsPanel`/`AnalyticsChart` via Recharts), and real-time event log (`EventLogPanel`). `EventDetailPage` shows cross-validation results from three sources (vision AI / weight sensor / POS), a timeline log, and CCTV player. Event severity flows through `EventSeverity = "critical" | "warning" | "behavior" | "info"`.

**pos** — `PosPage` with transaction table, date range filter, and status/payment filters. `PosTransaction.linkedEventId` links a POS record to a monitoring event for theft verification. `amount: null` means unpaid.

**setting** — `SettingPage` is a nested-route tab shell. Tabs: `account`, `notification`, `store`, `system`.

### Shared

- `shared/ui/` — layout-agnostic atoms (`Sidebar`, `BottomNav`, `Input`, `BrandLogo`, `SystemStatusCard`)
- `shared/layouts/` — `RootLayout`, `AuthLayout`
- `shared/lib/utils.ts` — `cn(...inputs)` helper (`clsx` + `tailwind-merge`)

### Styling & Design Tokens

Tailwind CSS v4 with `@theme inline` in `src/styles/theme.css`. All colors are defined as CSS custom properties (`--xross-*`) and exposed as Tailwind utilities. **Never hardcode color values** — use token-based classes like `bg-monitor-bg`, `text-event-critical`, `border-monitor-border`.

Key token groups:
- `monitor-*` — dark canvas used in the monitoring dashboard
- `event-critical/warning/safe` — severity colors
- `brand-primary` — blue accent (#155DFC)
- `sidebar-*`, `dashboard-*` — respective layout zones

### SVG Icons

Icons in `src/assets/icons/*.svg` are imported as React components via `vite-plugin-svgr`:
```ts
import BellIcon from '@/assets/icons/bell.svg?react'
```
Only files with the `?react` query suffix are transformed.

### Path Alias

`@/` resolves to `src/` (configured in `vite.config.ts` and TypeScript).

### State Management

- Server state: TanStack Query (`useQuery`, `useMutation`) — not yet wired to a real API
- Global client state: Zustand
- Local UI state: `useState` / `useReducer`

## Key Pending Work

- All data is mock (`*.mock.ts`). Backend API integration is not started.
- Auth guard is a stub (`*` → `/auth/login`). JWT-based route protection is planned.
- WebRTC live video streaming is planned but not implemented.
- React Native mobile app for store owners is planned.
