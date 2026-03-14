---
name: create_api_endpoint
description: Instructions for creating a new API endpoint using Express, Prisma, and Zod
---

# Create API Endpoint Skill

When you need to create a new API endpoint for this Express + Prisma backend, follow these steps strictly:

## 1. Define Valdiation Schema
Create a Zod schema in `src/validations/` for the request payload (body, params, query).
Example `src/validations/user.validation.ts`:
```typescript
import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});
```

## 2. Define Types (If needed)
If you need complex typing, define them in `src/types/`. However, try to infer types from Prisma client or Zod schemas directy.

## 3. Create the Service
In `src/services/`, implement the business logic. It should take the validated data, perform necessary database operations using Prisma, and return the result.
```typescript
import prisma from "../config/prisma";

export const createUserService = async (email: string, passwordHash: string) => {
  return await prisma.user.create({
    data: { email, password: passwordHash }
  });
};
```

## 4. Create the Controller
In `src/controllers/`, create the controller that handles the request and response. It calls the service. Do not write business logic in the controller.
```typescript
import { Request, Response, NextFunction } from "express";
import { createUserService } from "../services/user.service";

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    // ... hash password
    const user = await createUserService(email, hashedPassword);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
```

## 5. Register the Route
In `src/routes/`, connect the controller and the validation middleware to the Express router.
```typescript
import { Router } from "express";
import { createUser } from "../controllers/user.controller";
import validateSchema from "../middlewares/validateSchema";
import { createUserSchema } from "../validations/user.validation";

const router = Router();
router.post("/", validateSchema(createUserSchema), createUser);

export default router;
```

## 6. Update the Main Router (if it's a new route file)
Make sure the new router is exported and mounted in `src/routes/index.ts` or `src/index.ts`.
