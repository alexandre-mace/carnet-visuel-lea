This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Configuration

Env vars required (see `.env.example`):

- `ADMIN_PASSWORD`: password to access the back office.
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob Read-Write token to add/delete photos.

Local dev:

1. Create a `.env.local` at the repo root.
2. Copy values from `.env.example` and set your own.
3. Restart the dev server.

On Vercel:

1. Project Settings → Environment Variables → add `ADMIN_PASSWORD` and `BLOB_READ_WRITE_TOKEN`.
2. If needed, create a Blob store in Storage → Blob, then create a Read-Write Token (scope it to `photos/*` if you like).
3. Trigger a redeploy.

Notes:

- Without a valid `BLOB_READ_WRITE_TOKEN`, the site still works in read mode using the fallback list in `lib/photos.ts`.
- When you first add a photo via the back office, a `photos/photos.json` file is created in Blob storage.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Back Office

- URL: `/admin`
- Login: enter the password set in `ADMIN_PASSWORD`.
- Session: a secure cookie (`admin_session`) keeps you logged in for 7 days; use “Se déconnecter” to logout.
- Storage: image uploads and the JSON index are saved to Vercel Blob under `photos/`.
