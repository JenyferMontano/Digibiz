import z from "zod/v3";

export const onboardingSchema = z.object({
    businessName: z
    .string()
    .min(1, 'Business Name is requeried'),
    businessDescription: z.string().min(1, 'Business Description is requeried')
})