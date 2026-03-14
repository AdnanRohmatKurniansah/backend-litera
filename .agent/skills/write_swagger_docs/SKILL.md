---
name: write_swagger_docs
description: Instructions for adding OpenAPI (Swagger) documentation to API endpoints
---

# Write Swagger Documentation Skill

When instructed to document a new API endpoint or update existing documentation, follow these steps strictly using `swagger-jsdoc`.

## 1. Locate the Route
Swagger documentation should primarily live in the route files (`src/routes/*.ts`) above the endpoint definition.

## 2. Write the JSDoc Annotation
Write a multi-line JSDoc comment starting with `/**` and include the `@swagger` tag. Outline the OpenAPI spec in YAML format inside the comment.

### Example for a POST endpoint
```typescript
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user into the application.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: SecurePass123!
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation Error
 *       500:
 *         description: Internal Server Error
 */
router.post("/", validateSchema(createUserSchema), createUser);
```

## 3. Align with Validations (Zod)
Ensure that your `requestBody` schema exactly matches the rules defined in your Zod schemas (`src/validations/`).

## 4. Define Reusable Components (Optional but Recommended)
If there isn't a schema for a recurring resource (like a User object response), define it at the bottom or top of the relevant route file.
```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The user's email
 *       example:
 *         id: clq123abc0000...
 *         email: user@example.com
 */
```
