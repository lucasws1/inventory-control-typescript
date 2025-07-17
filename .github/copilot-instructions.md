# Copilot Instructions for Inventory Control TypeScript

## Project Overview

- **Full-stack inventory system** using Next.js 15 (App Router), TypeScript, Prisma, NextAuth, and PostgreSQL.
- **Frontend**: React components (with Shadcn/ui), Tailwind CSS for styling, mobile-first and responsive.
- **Backend**: Prisma ORM, Next.js API routes, Google OAuth authentication, multi-tenant by `userId`.
- **All business logic and CRUD operations** are handled via server actions in `app/lib/actions.ts`.

## Key Architectural Patterns

- **App Router**: All routes are in `app/`, with protected dashboard routes in `app/(dashboard)/`.
- **API routes**: Under `app/api/`, used for data fetching and mutations.
- **Global State**: Managed via React Contexts (`contexts/DataContext.tsx`, `contexts/ModalContext.tsx`).
- **Modal System**: Centralized, promise-based modals in `components/modals/`.
- **Multi-tenancy**: All models and queries are scoped by `userId` for data isolation.
- **TypeScript types**: Shared types in `types/`, with `*WithRelations` for eager-loaded relations.
- **Validation**: All input is validated with Zod schemas (`schemas/zodSchemas.ts`).

## Developer Workflows

- **Install dependencies**: Use `pnpm install` (pnpm is required).
- **Run dev server**: `pnpm dev`
- **Run migrations**: `pnpm prisma migrate dev`
- **Seed database**: `pnpm prisma db seed`
- **Deploy**: Vercel (see `vercel.json`)
- **Styling**: Use Tailwind CSS and Shadcn/ui components (`components/ui/`).

## Project-Specific Conventions

- **Naming**: PascalCase for components/types, camelCase for variables/functions, ALL*CAPS for constants, prefix private class members with `*`.
- **Error Handling**: Use try/catch for async, log errors with context, use error boundaries in React.
- **Clean Code**: Small, focused functions; descriptive names; avoid deep nesting; comment only complex logic.
- **Authentication**: All routes except `/login` and `/api/auth` are protected by `middleware.ts` (checks session cookies).
- **Data Flow**: Data loads via `/api/data` and is cached client-side; mutations use server actions and trigger UI refresh.
- **Database**: All models include `userId` for multi-tenancy; relations use CASCADE; see `prisma/schema.prisma`.

## Integration Points

- **NextAuth**: Google OAuth, session cookies checked in `middleware.ts`.
- **Prisma**: All DB access via `lib/prisma.ts` and server actions.
- **Zod**: All input validation in `schemas/zodSchemas.ts`.
- **UI**: Use Shadcn/ui and Tailwind for all new components.

## Examples

- **CRUD**: See `app/lib/actions.ts` for all create/update/delete logic.
- **Context usage**: See `contexts/DataContext.tsx` for data loading and cache.
- **Modal usage**: See `components/modals/` and `GlobalModalManager.tsx`.
- **Type usage**: See `types/` for shared and relation types.

---

For any new code, follow the conventions above and reference the files listed for examples of project patterns. When in doubt, prefer existing patterns and structure.
