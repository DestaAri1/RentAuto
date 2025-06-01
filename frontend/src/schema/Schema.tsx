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
  status: numberSchema({ field: "status" }, (schema) =>
    schema.refine(
      (value) => [1, 2, 3, 4, 5].includes(value),
      "Please enter a realistic number of seats"
    )
  ),
  description: descriptionSchema({ field: "description" }),
  car_parent: uuidSchema({ field: "parent" }),
});

export type CarChildFormData = z.infer<typeof carChildFormSchema>;
