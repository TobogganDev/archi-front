import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoyaltyCard } from "@/shared/ui/LoyaltyCard";

const baseProps = {
	name: "Marie Dupont",
	email: "marie@example.com",
	createdAt: "2024-01-01T00:00:00Z",
	stampsRequired: 10,
	programName: "Café du matin",
};

describe("LoyaltyCard", () => {
	it("affiche le nom du client", () => {
		render(<LoyaltyCard {...baseProps} activeStampsCount={5} />);
		expect(screen.getByText("Marie Dupont")).toBeInTheDocument();
	});

	it("affiche le nom du programme", () => {
		render(<LoyaltyCard {...baseProps} activeStampsCount={5} />);
		expect(screen.getByText("Café du matin")).toBeInTheDocument();
	});

	it("affiche le bon décompte de tampons pour une carte en cours", () => {
		render(<LoyaltyCard {...baseProps} activeStampsCount={5} />);
		expect(screen.getByText("5 / 10 tampons")).toBeInTheDocument();
	});

	it("affiche le bon décompte pour une carte complète", () => {
		render(<LoyaltyCard {...baseProps} activeStampsCount={10} />);
		expect(screen.getByText("10 / 10 tampons")).toBeInTheDocument();
	});

	it("affiche le bon nombre total de cercles de tampons", () => {
		const { container } = render(
			<LoyaltyCard {...baseProps} activeStampsCount={3} />,
		);
		const stampCircles = container.querySelectorAll(".h-5.w-5.rounded-full");
		expect(stampCircles).toHaveLength(10);
	});

	it("les tampons remplis ont la classe bg-orange", () => {
		const { container } = render(
			<LoyaltyCard {...baseProps} activeStampsCount={4} />,
		);
		const filledCircles = container.querySelectorAll(".h-5.w-5.bg-orange");
		expect(filledCircles.length).toBe(4);
	});

	it("plafonne les tampons remplis à stampsRequired si activeStampsCount est supérieur", () => {
		render(<LoyaltyCard {...baseProps} activeStampsCount={99} />);
		expect(screen.getByText("10 / 10 tampons")).toBeInTheDocument();
	});

	it("affiche l'email du client s'il est fourni", () => {
		render(<LoyaltyCard {...baseProps} activeStampsCount={2} />);
		expect(screen.getByText("marie@example.com")).toBeInTheDocument();
	});

	it("n'affiche pas d'email si non fourni", () => {
		render(
			<LoyaltyCard {...baseProps} email={null} activeStampsCount={2} />,
		);
		expect(screen.queryByText("marie@example.com")).not.toBeInTheDocument();
	});

	it("utilise 'Carte de fidélité' comme nom de programme par défaut", () => {
		const { programName: _unused, ...propsWithoutProgram } = baseProps;
		render(<LoyaltyCard {...propsWithoutProgram} activeStampsCount={2} />);
		expect(screen.getByText("Carte de fidélité")).toBeInTheDocument();
	});
});
