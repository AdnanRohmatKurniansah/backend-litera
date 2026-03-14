# Backend Architecture & Code Rules

These guidelines define the specific rules for modifying and writing new code in this project. All AI agents and developers must strictly adhere to these rules.

## 1. Tech Stack
- **Language**: TypeScript (Node.js)
- **Framework**: Express 5
- **ORM**: Prisma
- **Validation**: Zod
- **Testing**: Jest + Supertest

## 2. Directory Architecture (N-Tiered)
- `src/controllers/`: Only parses requests and builds responses. Never contains business logic. Calls services directly.
- `src/services/`: Core business logic. Communicates with Database (Prisma) or external APIs.
- `src/routes/`: Express routers and middleware attachment.
- `src/middlewares/`: Express middlewares (authentication, error handling, validation).
- `src/validations/`: Zod schemas for validating incoming requests.
- `src/utils/`: Generic utility functions and helpers.
- `src/config/`: Configuration files (e.g., Prisma client initialization, environment variables).
- `src/__tests__/`: Unit and Integration tests.

## 3. Coding Standards
- **Strict Typing**: Use TypeScript extensively. Avoid `any` unless absolutely necessary.
- **Async/Await**: Given this is Express 5, Promises and `async/await` are fully supported natively without needing wrapper utilities like `express-async-handler`.
- **Error Handling**: Throw specific errors in Services. Catch them or let Express 5's native error handler pass them to centralized Error Middleware in Controllers.
- **Code Style**: 
  - Managed by ESLint and Prettier. Run `npm run format` locally.
  - Double quotes or simple quotes based on Prettier config (see `.prettierrc`). 

## 4. Prisma Integration
- Never instantiate a new Prisma client inside services or controllers. Always import it from `src/config/prisma.ts` or a top-level instantiated module to prevent multiple connections.
- Keep Schema updates safe. If you change `prisma.schema`, you must run `npx prisma format` and `npx prisma generate`.

## 5. Environment Variables
- Ensure that required environment variables are listed in `.env.example`.
- Use `dotenv` appropriately, or rely on a centralized config checker file if present.

## 6. Security
- API keys, secrets, and auth tokens should never be hardcoded or logged.
- Always hash passwords (using `bcrypt` which is in package.json) before storing them.
- Avoid directly storing raw JWT payloads on the database.
