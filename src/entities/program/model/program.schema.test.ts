import { describe, it, expect } from "vitest";
import { createProgramSchema } from "@/features/create-program/model/program.schema";

describe("createProgramSchema", () => {
	it("valide un programme correct", () => {
		const result = createProgramSchema.safeParse({
			name: "Café du matin",
			stamps_required: 10,
			reward: "Café offert",
			color: "#FF5733",
		});
		expect(result.success).toBe(true);
	});

	it("rejette un nom manquant", () => {
		const result = createProgramSchema.safeParse({
			stamps_required: 10,
			reward: "Café offert",
			color: "#FF5733",
		});
		expect(result.success).toBe(false);
	});

	it("rejette un nom trop court (1 caractère)", () => {
		const result = createProgramSchema.safeParse({
			name: "A",
			stamps_required: 10,
			reward: "Café offert",
			color: "#FF5733",
		});
		expect(result.success).toBe(false);
	});

	it("rejette stamps_required négatif", () => {
		const result = createProgramSchema.safeParse({
			name: "Programme test",
			stamps_required: -5,
			reward: "Récompense",
			color: "#AABBCC",
		});
		expect(result.success).toBe(false);
	});

	it("rejette stamps_required à zéro", () => {
		const result = createProgramSchema.safeParse({
			name: "Programme test",
			stamps_required: 0,
			reward: "Récompense",
			color: "#AABBCC",
		});
		expect(result.success).toBe(false);
	});

	it("rejette stamps_required non entier", () => {
		const result = createProgramSchema.safeParse({
			name: "Programme test",
			stamps_required: 3.5,
			reward: "Récompense",
			color: "#AABBCC",
		});
		expect(result.success).toBe(false);
	});

	it("rejette une couleur au format invalide", () => {
		const result = createProgramSchema.safeParse({
			name: "Programme test",
			stamps_required: 10,
			reward: "Récompense",
			color: "rouge",
		});
		expect(result.success).toBe(false);
	});

	it("rejette une récompense trop courte", () => {
		const result = createProgramSchema.safeParse({
			name: "Programme test",
			stamps_required: 10,
			reward: "X",
			color: "#AABBCC",
		});
		expect(result.success).toBe(false);
	});

	it("accepte le minimum valide (2 tampons, nom et récompense de 2 chars)", () => {
		const result = createProgramSchema.safeParse({
			name: "AB",
			stamps_required: 1,
			reward: "CD",
			color: "#000000",
		});
		expect(result.success).toBe(true);
	});
});
