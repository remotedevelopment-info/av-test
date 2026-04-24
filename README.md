# av

Laravel 13 + Inertia v3 + Svelte 5 application for a standalone SDLT (Stamp Duty Land Tax) calculator exercise.

## Purpose

This repository contains a developer-focused implementation of an SDLT calculator for residential property purchases in England, including:

- standard residential rates
- first-time buyer relief
- additional property surcharge

The app also includes exercise support pages for plan/process tracking.

## Tech Stack

- PHP 8.3+
- Laravel 13
- Inertia.js v3
- Svelte 5
- Tailwind CSS v4
- Laravel Fortify (auth scaffolding)
- Laravel Wayfinder (typed route helpers)
- Pest 4 + PHPUnit 12

## Key Routes

- / : Home menu page
- /calculator : SDLT calculator UI
- /plan : Renders PLAN.md
- /process : Renders PROCESS.md and appends request-log entries
- /dashboard : Authenticated dashboard

## Local Development

### Prerequisites

- PHP 8.3+
- Composer
- Node.js + npm
- Laravel Herd (recommended in this repo)

Expected local URL: https://av.test (or http://av.test)

### Setup

1. Install backend dependencies:

   composer install

2. Install frontend dependencies:

   npm install

3. Create env and app key (if needed):

   cp .env.example .env
   php artisan key:generate

4. Run migrations:

   php artisan migrate

5. Build assets (or use dev watcher):

   npm run build
   # or
   npm run dev

## Quality Commands

- Run feature/unit tests:

  php artisan test --compact

- Run a single test file:

  php artisan test --compact tests/Feature/CalculatorPageTest.php

- Type-check frontend:

  npm run types:check

- Lint frontend:

  npm run lint:check

- Format frontend:

  npm run format

- Format PHP (Pint):

  vendor/bin/pint --dirty --format agent

## Repository Structure (High-Level)

- app : Laravel backend code
- routes : Web/settings/console routes
- resources/js : Inertia Svelte frontend pages/components/lib
- resources/js/data : Calculator JSON source files
- tests : Pest feature/unit tests
- PLAN.md : Exercise brief
- PROCESS.md : Progress/process tracking

## Notes for Developers

- Home and calculator pages are Inertia/Svelte-driven.
- The calculator behavior is JSON-driven from frontend data/config.
- If UI changes are not visible, rebuild assets or run npm run dev.
- Wayfinder route helpers are generated under resources/js/routes.
