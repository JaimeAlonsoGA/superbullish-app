import { z } from "zod";

export const ProjectSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Name is required").max(50, "Max 50 characters"),
    ticker: z
        .string()
        .min(1, "Required ticker")
        .max(6, "Max 6 characters")
        .regex(/^[A-Z0-9]+$/, "Only uppercase letters and numbers"),
    main_color: z.string().regex(/^#([A-Fa-f0-9]{6})$/, "Invalid main color #RRGGBB"),
    background_color: z
        .string()
        .nullable()
        .optional()
        .refine((v) => v == null || /^#([A-Fa-f0-9]{6})$/.test(v), {
            message: "Invalid background color #RRGGBB",
        }),
    logo_url: z.string().refine((v) => v == null || v.startsWith("http"), {
        message: "Invalid logo URL",
    }).nullable().optional(),
    user_id: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof ProjectSchema>;
