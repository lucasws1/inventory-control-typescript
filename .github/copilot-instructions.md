# Copilot Instructions for AI Coding Agents

## Project Overview

This is a **Next.js 15+ inventory control system** using TypeScript, Prisma ORM, and NextAuth for authentication. The app manages customers, products, invoices, and stock movements with a focus on Brazilian business practices (Portuguese UI, currency formatting).

**Core Architecture:**

- **Frontend:** Next.js `/app` directory, TailwindCSS, Shadcn/ui components, React Contexts for state
- **Backend:** Prisma with PostgreSQL, NextAuth with Google OAuth, custom API routes
- **Data Flow:** Centralized via `DataContext` → Single `/api/data` endpoint → All CRUD operations

## Critical Developer Workflows

- **Start dev:** `pnpm dev` (uses Turbopack)
- **Prisma:** After schema changes: `pnpm prisma migrate dev` → `pnpm prisma db seed`
- **Generated Prisma:** Client outputs to `app/generated/prisma` (not default location)
- **Authentication:** Google OAuth only - users must be logged in to access dashboard
- **Data Loading:** All entities loaded once via `DataContext`, cached client-side

## Essential Patterns

**Modal System (Critical):**

- Global modal management via `ModalContext` + `GlobalModalManager`
- Promise-based modal results: `await openModal('edit-product', productData)`
- Modal types: `new-{entity}`, `edit-{entity}` (see `contexts/ModalContext.tsx`)

**Data Architecture:**

- **Single source:** `/api/data` returns all entities with relations
- **Client cache:** `DataContext` holds all data, refreshed on mutations
- **Relations:** All entities use `*WithRelations` types (see `types/` folder)
- **Date serialization:** Custom helper for Prisma Date → ISO string conversion

**Form Patterns:**

- Each domain has: `{Entity}EditForm.tsx`, `New{Entity}Modal.tsx`
- Zod validation in `schemas/zodSchemas.ts` with Portuguese error messages
- Toast notifications via Sonner library

**Portuguese Localization:**

- All UI text in Portuguese
- Currency: Brazilian Real formatting (`utils/formatCurrencyBRL.ts`)
- Enum values: `StockReason` uses Portuguese (`COMPRA`, `VENDA`, etc.)

## Authentication Flow

NextAuth v4 setup with database sessions:

- **Login required:** Middleware protects all routes except `/login`
- **Session storage:** Database-based (not JWT)
- **User data:** Available via `useSession()` or `auth()` server function

## Adding New Entities

**Required files** (follow existing pattern):

1. **Prisma:** Add model to `schema.prisma`
2. **Types:** Create `types/{entity}.ts` and `types/{Entity}WithRelations.ts`
3. **Schema:** Add Zod validation to `schemas/zodSchemas.ts`
4. **Components:**
   - `components/forms/{Entity}EditForm.tsx`
   - `components/modals/New{Entity}Modal.tsx`
5. **API:** Update `/api/data/route.ts` to include new entity
6. **Pages:** Create `app/(dashboard)/{entities}/` with columns and pages
7. **Context:** Add to `DataContext.tsx` and modal types

## Key Files to Reference

- **Auth:** `lib/auth.ts`, `middleware.ts`
- **Data layer:** `lib/prisma.ts`, `contexts/DataContext.tsx`
- **Modal system:** `contexts/ModalContext.tsx`, `components/GlobalModalManager.tsx`
- **Layout:** `app/(dashboard)/layout.tsx` (sidebar + header structure)
- **Validation:** `schemas/zodSchemas.ts` (all form schemas)
