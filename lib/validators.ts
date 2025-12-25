import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  price: z.number().positive("Price must be positive"),
});
