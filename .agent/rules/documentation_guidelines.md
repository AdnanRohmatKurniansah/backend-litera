# Documentation Guidelines

These guidelines define how documentation should be maintained across the project, including both the `README.md` and API Documentation (Swagger).

## 1. README.md Maintenance
- **Environment Variables**: Whenever a new environment variable is introduced (e.g., in `.env.example`), it MUST be documented in the `README.md` with a brief explanation of its purpose and default/expected values.
- **Project Setup**: Changes to dependencies, setup scripts (e.g., `npm run custom-script`), or database migration steps must be reflected in the "Getting Started" or "Installation" section.
- **Architecture Updates**: Substantial changes to the directory structure or technical stack (e.g., replacing a library) should be documented in the architecture overview section.

## 2. API Documentation (Swagger)
- **Tooling**: We use `swagger-jsdoc` to generate OpenAPI documentation from comments.
- **Placement**: Swagger JSDoc annotations (using `@swagger` or `@openapi`) MUST be placed directly inside the route definition files (`src/routes/*.ts`) or controller files, preferably above the route declaration.
- **Required Fields**: 
  - `Summary` and `Description` of the endpoint.
  - `Tags` for grouping (e.g., `Users`, `Products`).
  - `Security` requirements (e.g., Bearer auth) if the endpoint is protected.
  - `Request Body` or `Parameters` detailing the exact payload (aligning with Zod schemas).
  - `Responses` covering success (`200`/`201`) and common error codes (`400`, `401`, `404`, `500`).
- **Schema Reusability**: When possible, define Swagger Components (`@swagger components.schemas.ModelName`) to avoid duplicating payload and response definitions.

## 3. Inline Code Documentation
- Document complex business logic inside `src/services/` using standard JSDoc `/** ... */`.
- Avoid obvious comments; document the "Why", not the "What", unless the "What" involves a complicated workaround.
