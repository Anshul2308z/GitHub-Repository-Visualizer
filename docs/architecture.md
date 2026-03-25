# Architecture

## Overview

The application is a Next.js (App Router) based analytics tool that processes GitHub repository data and converts it into visual insights.

It follows a **client → API → processing → visualization** pipeline.

---

## High-Level Flow

1. User enters a GitHub repository URL
2. Frontend sends request to `/api/repo`
3. Backend fetches raw data from GitHub API
4. Data is processed and normalized
5. Structured analytics are returned
6. Dashboard renders visual components

---

## Directory Breakdown

### `/app`

Core application using Next.js App Router.

* `/api/repo/route.ts`
  Main backend endpoint handling data fetching and response generation

* `/api/repo/lib/`

  * `github.ts` → Handles GitHub API calls (commits, PRs, issues, contributors)
  * `process.ts` → Transforms raw data into usable analytics
  * `types.ts` → Type definitions for structured data

* `/dashboard/`

  * `page.tsx` → Server entry point
  * `DashboardClient.tsx` → Client-side rendering and state handling

---

### `/components`

UI layer split into:

* `/dashboard/`

  * `commit-list.tsx`
  * `contributors-chart.tsx`
  * `timeline-chart.tsx`
  * `insight-card.tsx`

* `/ui/`
  Reusable UI primitives (buttons, modals, charts, etc.)

---

### `/lib`

Core logic shared across app:

* `insights.ts` → Generates higher-level analytics
* `utils.ts` → Helper utilities
* `mock-data.ts` → Testing / fallback data

---

### `/hooks`

Custom hooks for UI behavior:

* `use-mobile.ts`
* `use-toast.ts`

---

## Data Flow (Detailed)

1. `route.ts` receives request with repo URL
2. Calls functions from `github.ts` to fetch:

   * Commits
   * Pull Requests
   * Issues
   * Contributors
3. Raw data passed to `process.ts`
4. Processing includes:

   * Normalization
   * Aggregation
   * Timeline construction
   * Contributor stats
5. Final structured response returned to frontend
6. Dashboard components render visual insights

---

## Key Design Decisions

* **Separation of concerns**

  * Fetching (`github.ts`)
  * Processing (`process.ts`)
  * Rendering (components)

* **Client/Server split**

  * Server handles data fetching
  * Client handles interactivity

* **Modular UI**

  * Reusable components
  * Clear dashboard-focused structure

---

## Performance Considerations

* GitHub API rate limits (token recommended)
* Large repositories increase response time
* Future improvements:

  * Caching layer
  * Incremental data fetching
  * Background processing

---

## Scalability Direction

* Add caching (Redis / edge cache)
* Support multiple repo comparisons
* Move heavy processing off request cycle
