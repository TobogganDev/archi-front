import { z } from "zod";

export const profileSchema = z.object({
	name: z.string().min(2, "Le nom du commerce doit contenir au moins 2 caractères"),
	color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "La couleur doit être au format hexadécimal"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
