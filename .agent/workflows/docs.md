---
description: Ensure Swagger Documentations and README are up to date
---

# Docs Maintenance Workflow

Run this workflow whenever introducing new features, architectural changes, or modifying database schemas, to keep project documentation synced.

// turbo
1. Review the `src/routes/` to verify all endpoint routes have accurate `@swagger` JSDoc comments mapping their request formats to `src/validations/` schemas.
```bash
npx eslint src/routes/ --ext .ts
```

2. Review `.env.example`. Make sure any new API keys or environment flags added since the last commit are fully documented in the `README.md` file.

3. Verify the Swagger documentation is structurally valid.
```bash
npm run dev
# Developer should test http://localhost:PORT/api-docs or the configured swagger UI path in the browser.
```
