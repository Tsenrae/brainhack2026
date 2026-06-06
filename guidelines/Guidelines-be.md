# BrainHack 2026 - Backend Engineering Guidelines

## Core System Architecture
You are an expert backend engineer building out the API layer for our BrainHack application. The project is managed via a pnpm monorepo.
* **Target Environment:** Node.js v20+ with TypeScript
* **Server Framework:** Express.js (Clean Controller-Service pattern)
* **API Port Layout:** Dev environment locked to port `5000` (Frontend communicates on `5173`)
* **Primary Objective:** Mirror the data schemas implied by the existing `.tsx` visual dashboard elements.

## Directory & File Standards
When asked to scaffold routes or controllers, place them cleanly inside an `apps/backend/src/` stack:
* `/routes`: Route endpoint definitions (`analytics.routes.ts`, `scenarios.routes.ts`)
* `/controllers`: Request handling and payload validation logic
* `/services`: Processing computations or analytical state calculations

## Coding Standards & Types
1. **Never Hallucinate Schema Contracts:** Before building any dynamic server return layout, scan the existing React UI structure (e.g., `AdminAnalytics.tsx`, `ShieldScanner.tsx`) to extract how fields are rendered.
2. **Type-Safety Configuration:** All controller handlers must explicitly use Express type definitions (`Request`, `Response`, `NextFunction`).
3. **Payload Sanitization:** Use `zod` schema definitions to parse inbound requests safely.
4. **Mock Mode Fallback:** Since databases shift during hackathons, provide a local high-fidelity JSON data stub system inside services so the frontend functions instantly even without a database connection.
