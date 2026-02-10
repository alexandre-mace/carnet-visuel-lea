# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Photography portfolio/showroom built with Next.js 15 (App Router), React 19, and TypeScript. Features a public gallery and a password-protected admin panel for managing photos stored in Vercel Blob.

## Commands

- `npm run dev` — Start dev server with Turbopack
- `npm run build` — Production build with Turbopack
- `npm run start` — Start production server
- `npm run lint` — ESLint

## Architecture

**App Router structure (`app/`):**
- `page.tsx` — Public gallery (server component, fetches photos from Blob or fallback)
- `admin/page.tsx` — Admin dashboard (login gate via cookie check)
- `admin/actions.ts` — All server actions: auth (login/logout), photo CRUD (add/delete)
- `api/photos/route.ts` — GET endpoint returning photos JSON

**Data flow:**
- Photos stored in Vercel Blob (`photos/photos.json` index + `photos/images/{uuid}.{ext}`)
- `lib/blob-store.ts` handles all Blob operations with a 60-second in-memory cache
- `lib/photos.ts` provides fallback data when Blob token is not configured
- Server actions revalidate `/`, `/admin`, and `/api/photos` after mutations

**Auth:**
- Simple password auth against `ADMIN_PASSWORD` env var
- Session stored as HTTP-only cookie (`admin_session`, 7-day expiry)
- `requireAuth()` guard used in server actions

**Forms pattern:**
- React Hook Form + Zod for client-side validation
- Server Actions for submission
- shadcn/ui components (`components/ui/`) with "new-york" style

**Styling:**
- Tailwind CSS v4 with CSS variables in oklch color space (defined in `globals.css`)
- Dark theme default

## Environment Variables

- `ADMIN_PASSWORD` — Admin login password (required)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob token (optional; falls back to static data)

## Key Conventions

- Path alias: `@/*` maps to project root
- `cn()` utility from `lib/utils.ts` for className merging (clsx + tailwind-merge)
- Server components by default; client components marked with `"use client"`
- Upload limit: 2MB (configured in `next.config.ts` experimental serverActions)
- Image optimization configured for `images.unsplash.com`
