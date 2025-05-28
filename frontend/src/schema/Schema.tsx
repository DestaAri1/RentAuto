import { z } from "zod";

export const carFormSchema = z.object({
  name: z
    .string()
    .min(1, "Car name is required")
    .min(2, "Car name must be at least 2 characters long")
    .max(100, "Car name cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z0-9\s\-'\.]+$/,
      "Car name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods"
    )
    .refine(
      (value) => !value.match(/^\s+|\s+$/),
      "Car name cannot start or end with spaces"
    )
    .refine(
      (value) => !value.match(/\s{2,}/),
      "Car name cannot contain consecutive spaces"
    ),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a valid number",
    })
    .positive("Price must be greater than 0")
    .min(1, "Minimum price is $1 per day")
    .max(10000, "Maximum price is $10,000 per day")
    .multipleOf(0.01, "Price can only have up to 2 decimal places")
    .refine(
      (value) => Number.isFinite(value),
      "Price must be a valid finite number"
    ),

  type_id: z
    .string()
    .min(1, "Please select a car type")
    .uuid("Invalid car type selection")
    .refine(
      (value) => value !== "placeholder",
      "Please select a valid car type"
    ),

  seats: z
    .number({
      required_error: "Number of seats is required",
      invalid_type_error: "Seats must be a valid number",
    })
    .int("Number of seats must be a whole number")
    .min(1, "Car must have at least 1 seat")
    .max(14, "Maximum number of seats is 15 ")
    .refine(
      (value) => [1, 2, 4, 5, 6, 7, 8, 9, 12, 15].includes(value),
      "Please enter a realistic number of seats"
    ),
});


export type CarFormData = z.infer<typeof carFormSchema>;