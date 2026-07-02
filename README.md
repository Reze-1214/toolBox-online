# toolBox-online

A fast and free online toolbox built with Next.js, TypeScript, Tailwind CSS, Prisma, and SQLite.

## Features

- Multiple online tools in one place
- Search and browse by category
- Authentication support with favorites and recently used tools
- Local database support with Prisma

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma + SQLite

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Set up the database
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```
3. Start the development server
   ```bash
   npm run dev
   ```

Open http://localhost:3000 to view the app.

## Project Structure

- src/app - Next.js app router pages and API routes
- src/components - UI pages and tool components
- src/lib - shared utilities, auth, i18n, and database helpers
- prisma - Prisma schema and seed data
