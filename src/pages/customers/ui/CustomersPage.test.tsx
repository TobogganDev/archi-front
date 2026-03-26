import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CustomersPage } from "./CustomersPage";
import { useCustomerStore } from "@/entities/customer/model/customer.store";

vi.mock("@/app/providers", () => ({
	useAuthContext: () => ({
		user: { id: "merchant-1" },
		isLoading: false,
		isAuthenticated: true,
	}),
}));

vi.mock("@/entities/customer", async () => {
	const actual =
		await vi.importActual<typeof import("@/entities/customer")>(
			"@/entities/customer",
		);
	return {
		...actual,
		useCustomers: () => ({
			data: [
				{
					id: "1",
					name: "Alice Martin",
					email: "alice@example.com",
					merchant_id: "merchant-1",
					created_at: "2024-01-01",
				},
				{
					id: "2",
					name: "Bob Durand",
					email: "bob@example.com",
					merchant_id: "merchant-1",
					created_at: "2024-01-02",
				},
				{
					id: "3",
					name: "Charlie Blanc",
					email: null,
					merchant_id: "merchant-1",
					created_at: "2024-01-03",
				},
			],
			isLoading: false,
		}),
	};
});

vi.mock("@/entities/stamp", () => ({
	useStampStatsByMerchant: () => ({ data: [] }),
}));

vi.mock("@/features/add-customer", () => ({
	AddCustomerModal: () => null,
}));

function renderPage() {
	return render(
		<MemoryRouter>
			<CustomersPage />
		</MemoryRouter>,
	);
}

describe("CustomersPage", () => {
	beforeEach(() => {
		act(() => {
			useCustomerStore.getState().resetFilters();
		});
	});

	it("affiche tous les clients au chargement", () => {
		renderPage();
		expect(screen.getByText("Alice Martin")).toBeInTheDocument();
		expect(screen.getByText("Bob Durand")).toBeInTheDocument();
		expect(screen.getByText("Charlie Blanc")).toBeInTheDocument();
	});

	it("affiche le bon nombre de clients dans le sous-titre", () => {
		renderPage();
		expect(screen.getByText(/3 clients fidélisés/i)).toBeInTheDocument();
	});

	it("filtre la liste quand on tape dans la barre de recherche", async () => {
		renderPage();
		const searchInput = screen.getByPlaceholderText(
			/Rechercher par nom ou email/i,
		);
		await userEvent.type(searchInput, "alice");

		expect(screen.getByText("Alice Martin")).toBeInTheDocument();
		expect(screen.queryByText("Bob Durand")).not.toBeInTheDocument();
		expect(screen.queryByText("Charlie Blanc")).not.toBeInTheDocument();
	});

	it("affiche le message 'Aucun client trouvé' quand la recherche ne correspond à rien", async () => {
		renderPage();
		const searchInput = screen.getByPlaceholderText(
			/Rechercher par nom ou email/i,
		);
		await userEvent.type(searchInput, "zzz-inconnu");

		expect(screen.getByText(/Aucun client trouvé/i)).toBeInTheDocument();
	});

	it("restitue tous les clients après avoir effacé la recherche", async () => {
		renderPage();
		const searchInput = screen.getByPlaceholderText(
			/Rechercher par nom ou email/i,
		);
		await userEvent.type(searchInput, "bob");
		await userEvent.clear(searchInput);

		expect(screen.getByText("Alice Martin")).toBeInTheDocument();
		expect(screen.getByText("Bob Durand")).toBeInTheDocument();
		expect(screen.getByText("Charlie Blanc")).toBeInTheDocument();
	});
});
