# MediCore Hospital Management Dashboard

MediCore is a modern, responsive hospital operations dashboard built for the frontend development assessment. It covers authentication, patient care, clinical staffing, appointment scheduling, bed capacity, pharmacy inventory, billing, notifications, and profile management in one scalable React codebase.

## Live application

- GitHub source: <https://github.com/rasinenitharunchowdary-cmyk/medicore-hospital-dashboard>
- Production URL: added immediately after the verified deployment finishes

The project supports a Vercel-native Next.js build and a Cloudflare-compatible Vinext build.

## Reviewer access

- Email: `admin@medicore.com`
- Password: `admin123`

Incorrect credentials deliberately show a validation error and error toast.

## Features

- Login, forgot-password, and reset-password flows with accessible inline validation
- Protected React Router routes, direct-route support, logout, and a custom 404 screen
- Responsive dashboard summary cards, patient-flow chart, bed-capacity chart, and revenue trend
- Complete add, view, edit, and delete interfaces for Patients, Doctors, Appointments, Beds, Pharmacy, and Billing
- Reusable search, status filters, column sorting, pagination, empty states, and destructive-action confirmation
- Appointment date policy, occupied-bed patient requirement, inventory boundaries, invoice date/amount cross-validation
- Read/unread notifications, mark-all-read, notification deletion, and synchronized header badge
- Editable user profile, persistent light/dark mode, reviewer-friendly demo-data reset
- Redux Toolkit state management with versioned, SSR-safe browser persistence
- Loading skeletons, error/retry state (`?state=error` on a management route), disabled submit states, and toast feedback
- Keyboard focus styles, labels, semantic landmarks, sortable-table accessibility, reduced-motion support, and responsive mobile drawer/modals

## Technology

- React 19 and TypeScript
- React Router
- Redux Toolkit and React Redux
- Tailwind CSS 4
- Recharts
- React Hook Form, Zod, and Hookform Resolvers
- Lucide React icons
- Vinext/Vite deployment build

## Project structure

```text
app/                    App entry, routing host, global theme styles
components/
  layout/               Responsive application shell and navigation
  ui/                   Buttons, table, modal, form, feedback, toast primitives
data/                   Realistic typed assessment seed data
features/
  auth/                 Auth screens and route guards
  dashboard/            Overview cards and charts
  management/           Reusable CRUD engine and all operational modules
  profile/              Profile and workspace preferences
store/                  Redux Toolkit store, slice, typed hooks, persistence
types/                  Domain and state TypeScript models
tests/                  Assessment coverage tests
worker/                 Cloudflare-compatible application entry
```

## Local setup

Prerequisites: Node.js 22.13 or newer and npm.

```bash
git clone <repository-url>
cd medicore-hospital-dashboard
npm ci
npm run dev
```

Open `http://localhost:3000` and use the reviewer credentials above.

## Validation and production build

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run build:vercel
```

Or run the complete quality gate:

```bash
npm run check
```

## Deployment

### Vercel

Import the GitHub repository and deploy. `vercel.json` selects the Next.js framework and `npm run build:vercel`; the root page plus catch-all app route ensure direct refreshes such as `/patients` and `/reset-password` resolve without an SPA 404.

### OpenAI Sites

The default `npm run build` produces the Cloudflare-compatible Vinext artifact used by Sites.

## Data and API note

The assessment explicitly allows UI-only CRUD when a backend is unavailable, and the separate API-integration learning session is outside the assignment. MediCore therefore uses a typed mock-data/service layer backed by Redux Toolkit and local device persistence. No real patient information is used. The `db` and worker-compatible structure leave a clean path for later API integration without redesigning the feature components.

## Responsive targets

The interface is designed for mobile (360px+), tablet, and desktop. Tables scroll within their cards without causing page-level overflow, forms become single-column on small screens, and navigation switches to a touch-friendly drawer.

## License

Created solely for the frontend development assessment.
