import { describe, it, expect, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import {
	useCustomerStore,
	selectSearchQuery,
	selectHasActiveSearch,
	selectSelectedCustomerId,
} from "@/entities/customer/model/customer.store";

describe("useCustomerStore", () => {
	beforeEach(() => {
		act(() => {
			useCustomerStore.getState().resetFilters();
		});
	});

	it("a une searchQuery vide par défaut", () => {
		const state = useCustomerStore.getState();
		expect(selectSearchQuery(state)).toBe("");
	});

	it("a selectedCustomerId null par défaut", () => {
		const state = useCustomerStore.getState();
		expect(selectSelectedCustomerId(state)).toBeNull();
	});

	it("setSearchQuery met à jour la recherche", () => {
		act(() => {
			useCustomerStore.getState().setSearchQuery("alice");
		});
		expect(selectSearchQuery(useCustomerStore.getState())).toBe("alice");
	});

	it("setSelectedCustomerId met à jour l'id sélectionné", () => {
		act(() => {
			useCustomerStore.getState().setSelectedCustomerId("abc-123");
		});
		expect(selectSelectedCustomerId(useCustomerStore.getState())).toBe("abc-123");
	});

	it("resetFilters remet searchQuery à vide", () => {
		act(() => {
			useCustomerStore.getState().setSearchQuery("bob");
			useCustomerStore.getState().resetFilters();
		});
		expect(selectSearchQuery(useCustomerStore.getState())).toBe("");
	});

	it("resetFilters remet selectedCustomerId à null", () => {
		act(() => {
			useCustomerStore.getState().setSelectedCustomerId("xyz");
			useCustomerStore.getState().resetFilters();
		});
		expect(selectSelectedCustomerId(useCustomerStore.getState())).toBeNull();
	});

	it("selectHasActiveSearch retourne false quand searchQuery est vide", () => {
		const state = useCustomerStore.getState();
		expect(selectHasActiveSearch(state)).toBe(false);
	});

	it("selectHasActiveSearch retourne true quand searchQuery est non vide", () => {
		act(() => {
			useCustomerStore.getState().setSearchQuery("test");
		});
		expect(selectHasActiveSearch(useCustomerStore.getState())).toBe(true);
	});

	it("selectHasActiveSearch retourne false pour une recherche avec uniquement des espaces", () => {
		act(() => {
			useCustomerStore.getState().setSearchQuery("   ");
		});
		expect(selectHasActiveSearch(useCustomerStore.getState())).toBe(false);
	});
});
