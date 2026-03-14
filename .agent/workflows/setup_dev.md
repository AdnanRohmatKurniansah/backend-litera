---
description: Environment setup and local server start workflow
---

# Setup and Start Dev Server

Follow this workflow to get the application up and running locally.

// turbo
1. Install project dependencies.
```bash
npm install
```

// turbo
2. Ensure Prisma Client is generated based on the current schema.
```bash
npm run postinstall
```

3. Ensure `.env` is created and correctly configured. Let the developer configure it based on `.env.example` if it doesn't already exist. Do not auto-run this step if manual configuration is requested.
```bash
cp .env.example .env
```

// turbo
4. Run the development server with nodemon and TypeScript.
```bash
npm run dev
```
