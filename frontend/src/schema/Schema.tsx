import { z } from "zod";
import capitalize from "../helper/capitalize.tsx";

const nameCCSchema = ({ field }: { field: string }) =>
  z
    .string()
    .min(1, `${capitalize(field)} is required`)
    .min(2, `${capitalize(field)} at least consist of 2 characters`)
    .max(100, `${capitalize(field)} cannot exeed more than 100 characters`)
    .regex(
      /^[a-zA-Z0-9\s\-'\.]+$/,
      `${capitalize(
        field
      )} can only contain letters, numbers, spaces, hyphens, apostrophes, and periods`
    )
    .refine(
      (value) => !value.match(/^\s+|\s+$/),
      `${capitalize(field)} cannot start or end with spaces`
    )
    .refine(
      (value) => !value.match(/\s{2,}/),
      `${capitalize(field)} cannot contain consecutive spaces`
    );

const priceSchema = ({ field }: { field: string }) =>
  z
    .number({
      required_error: `${capitalize(field)} is required`,
      invalid_type_error: `${capitalize(field)} must be a valid number`,
    })
    .positive(`${capitalize(field)} must be greater than 0`)
    .min(1, `Minimum ${field} is $1 per day`)
    .max(10000, `Maximum ${field} is $10,000 per day`)
    .multipleOf(
      0.01,
      `${capitalize(field)} can only have up to 2 decimal places`
    )
    .refine(
      (value) => Number.isFinite(value),
      `${capitalize(field)} must be a valid finite number`
    );

const uuidSchema = ({ field }: { field: string }) =>
  z
    .string()
    .min(1, `Please select a ${field}`)
    .uuid(`Invalid ${field} selection`)
    .refine(
      (value) => value !== "placeholder",
      `Please select a valid ${field}`
    );

const numberSchema = (
  { field }: { field: string },
  refineFn?: (
    schema: z.ZodNumber
  ) => z.ZodNumber | z.ZodEffects<z.ZodNumber, any, any>
) => {
  let baseSchema = z
    .number({
      required_error: `${capitalize(field)} is required`,
      invalid_type_error: `${capitalize(field)} must be a valid number`,
    })
    .int(`${capitalize(field)} must be a whole number`);

  return refineFn ? refineFn(baseSchema) : baseSchema;
};

const descriptionSchema = ({ field }: { field: string }) =>
  z
    .string()
    .min(10, `${capitalize(field)} must be at least 10 characters`)
    .max(1000, `${capitalize(field)} cannot exceed 1000 characters`)
    .refine(
      (value) => !value.match(/^\s+|\s+$/),
      `${capitalize(field)} cannot start or end with spaces`
    )
    .refine(
      (value) => !value.match(/\s{3,}/),
      `${capitalize(field)} cannot contain excessive spaces`
    );

const imageSchema = ({ field }: { field: string }) =>
  z
    .any()
    .refine((file) => file instanceof File, `${capitalize(field)} is required`)
    .refine(
      (file) => file instanceof File && file.size <= 5 * 1024 * 1024,
      `${capitalize(field)} must be less than 5MB`
    )
    .refine(
      (file) =>
        file instanceof File &&
        ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      `${capitalize(field)} must be a valid image (jpg, png, webp)`
    );

export const carFormSchema = z.object({
  name: nameCCSchema({ field: "name" }),
  price: priceSchema({ field: "price" }),
  type_id: uuidSchema({ field: "car type" }),
  seats: numberSchema({ field: "seats" }, (schema) =>
    schema
      .min(1, "Car must have at least 1 seat")
      .max(14, "Maximum number of seats is 15")
      .refine(
        (value) => [1, 2, 4, 5, 6, 7, 8, 9, 12, 15].includes(value),
        "Please enter a realistic number of seats"
      )
  ),
});

export type CarFormData = z.infer<typeof carFormSchema>;

export const carChildFormSchema = z.object({
  name: nameCCSchema({ field: "name" }),
  alias: nameCCSchema({ field: "alias" }),
  color: nameCCSchema({ field: "color" }),
  status: z.number().min(1).max(5),
  description: z.string().optional(),
  car_parent: z.string().min(1, "Car parent is required"),
  imageUrl: z.string().url().optional(),
});

export type CarChildFormData = z.infer<typeof carChildFormSchema>;

// Updated roleFormSchema to include permissions
export const roleFormSchema = z.object({
  name: nameCCSchema({ field: "name" }),
  permission: z
    .array(z.string())
    .min(1, "At least one permission is required"),
});

export type RoleFormData = z.infer<typeof roleFormSchema>;
