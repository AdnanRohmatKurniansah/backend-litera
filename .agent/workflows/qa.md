---
description: Format, Lint and Test the application
---

# QA Workflow (Format, Lint, Test)

Run this workflow to ensure code quality and pass tests before committing or creating a pull request.

// turbo-all

1. Format the codebase using Prettier and ESLint (fix mode).
```bash
npm run format
```

2. Run Jest tests specifically detecting open handles to ensure database connections and server close properly.
```bash
npm run test
```
