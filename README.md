# Toolbox

Toolbox is a modern online utility web app built with Next.js, TypeScript, Tailwind CSS, Prisma, and SQLite. It includes a collection of practical tools such as QR generation, password generation, JSON formatting, text tools, and more.

## Features

- Clean and responsive UI for desktop and mobile
- Multiple utility tools in one place
- Search and browse tools by category
- User authentication with favorites and recently used tools
- Local database support using Prisma and SQLite

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma + SQLite

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 3. Run the development server

```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Project Structure

- src/app - App Router pages, layouts, and API routes
- src/components - UI pages, shared components, and tool interfaces
- src/lib - Shared utilities, auth, navigation, i18n, and database helpers
- prisma - Prisma schema and seed data
- public - Static assets such as the website logo

## Notes

- The app uses SQLite by default for local development.
- If you want to reset the database, run:

```bash
npx prisma migrate reset
```
