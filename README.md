# Bargaining Tracker

A simple internal tool for staff to manage and monitor Collective Employment Agreements (CEAs).

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Features

- View all agreements with colour-coded expiry status (amber = expiring ≤90 days, red = expired)
- Summary stats: expiring soon, expired, in bargaining, total members

## Data

Seed data (36 agreements) is generated from the provided Excel file via a one-time script:

```bash
node scripts/convertExcel.mjs
```

This writes `src/data/agreements.ts`, which the app loads into localStorage on first run. All changes persist there across refreshes.

## Validation

Required: employer name, industry, region, expiry date, status, lead organiser. Email must be valid format. Estimated members must be a positive number.

## Key decisions

- **React + TypeScript + Vite** — fast to build, with a single typed `Agreement` interface enforcing valid industry/region/status values
- **localStorage, no backend** — the brief allowed simple storage with no deployment; avoided unnecessary setup for this scope
- **90-day logic** — dates normalised to midnight before comparison, so the day count is accurate regardless of time of day
- **CSV export respects active filters** — exports what's currently visible, not the full dataset
