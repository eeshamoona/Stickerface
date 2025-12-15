This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Party Tracker Mode 🎉

The app features a live "Party Tracker" with leaderboards, betting, and NFC integration.
For full documentation on setting up NFC tags and running the party, see **[PARTY_README.md](./PARTY_README.md)**.

## Photos Page Features

The application now includes a comprehensive Photos management system:

- **Gallery**: A public-facing gallery displaying photos with infinite scroll and masonry layout.
- **Photo Details**: Individual pages for each photo, featuring:
  - **Image Comparison Slider**: Compare original photos with AI-generated art styles.
  - **Download Assets**: Download original and generated images as a ZIP file.
- **Management Interface**: A secure admin area to upload, edit, and delete photos.
  - **Auto-generated Slugs**: SEO-friendly URLs.
  - **Art Style Management**: Upload multiple art styles per photo.
  - **Video Support**: Attach videos to photos.

## Environment Variables

The following environment variables are required for the application to function:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL of your Supabase project. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anonymous public key for Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations (server-side only). |
| `BLOB_READ_WRITE_TOKEN` | Token for Vercel Blob storage access. |

## Future Developer Guide

### Running the Project

To start the development server:

```bash
npm run dev
```

### Running Tests

This project uses Jest and React Testing Library for unit and integration tests.

To run the test suite:

```bash
npm test
```

### Project Structure

- `src/app/photos`: Main photos page and dynamic routes.
- `src/app/photos/manage`: Admin interface for managing photos.
- `src/components/photos`: Reusable components like `PhotoForm` and `ImageComparisonSlider`.
- `src/lib`: Utilities for Supabase, storage, and video processing.

## Deprecated Files

The following files are deprecated and can be safely removed in future cleanups:

- frontend/public/images/photos
