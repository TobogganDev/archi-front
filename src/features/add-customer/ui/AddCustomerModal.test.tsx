import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddCustomerModal } from "./AddCustomerModal";

vi.mock("@/features/add-customer/model/useCreateCustomer", () => ({
	useCreateCustomer: () => ({
		createCustomer: vi.fn(),
		createCustomerAsync: vi.fn(),
		isPending: false,
		error: null,
	}),
}));

vi.mock("qrcode.react", () => ({
	QRCodeSVG: () => <svg data-testid="qr-code" />,
}));

function renderModal(onClose = vi.fn()) {
	return render(<AddCustomerModal merchantId="merchant-1" onClose={onClose} />);
}

describe("AddCustomerModal", () => {
	it("affiche le formulaire avec les champs nom et email", () => {
		renderModal();
		expect(screen.getByPlaceholderText("Marie Dupont")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("marie@exemple.fr")).toBeInTheDocument();
	});

	it("affiche les boutons Ajouter et Annuler", () => {
		renderModal();
		expect(screen.getByRole("button", { name: /Ajouter/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Annuler/i })).toBeInTheDocument();
	});

	it("bloque le submit et affiche une erreur Zod si le nom est vide", async () => {
		renderModal();
		await userEvent.click(screen.getByRole("button", { name: /Ajouter/i }));
		expect(
			await screen.findByText(/au moins 2 caractères/i),
		).toBeInTheDocument();
	});

	it("bloque le submit et affiche une erreur Zod si le nom est trop court", async () => {
		renderModal();
		await userEvent.type(screen.getByPlaceholderText("Marie Dupont"), "A");
		await userEvent.click(screen.getByRole("button", { name: /Ajouter/i }));
		expect(
			await screen.findByText(/au moins 2 caractères/i),
		).toBeInTheDocument();
	});

	it("appelle onClose quand on clique sur Annuler", async () => {
		const onClose = vi.fn();
		renderModal(onClose);
		await userEvent.click(screen.getByRole("button", { name: /Annuler/i }));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("appelle onClose quand on clique sur le bouton fermer (×)", async () => {
		const onClose = vi.fn();
		renderModal(onClose);
		await userEvent.click(screen.getByRole("button", { name: /Fermer/i }));
		expect(onClose).toHaveBeenCalledOnce();
	});
});
