import { create } from "zustand";

interface CustomerState {
	searchQuery: string;
	selectedCustomerId: string | null;
	setSearchQuery: (query: string) => void;
	setSelectedCustomerId: (id: string | null) => void;
	resetFilters: () => void;
}

export const useCustomerStore = create<CustomerState>()((set) => ({
	searchQuery: "",
	selectedCustomerId: null,

	setSearchQuery: (searchQuery) => set({ searchQuery }),
	setSelectedCustomerId: (selectedCustomerId) => set({ selectedCustomerId }),
	resetFilters: () => set({ searchQuery: "", selectedCustomerId: null }),
}));

// --- Strict selectors ---
export const selectSearchQuery = (state: CustomerState) => state.searchQuery;
export const selectSelectedCustomerId = (state: CustomerState) => state.selectedCustomerId;
export const selectSetSearchQuery = (state: CustomerState) => state.setSearchQuery;
export const selectSetSelectedCustomerId = (state: CustomerState) => state.setSelectedCustomerId;
export const selectResetFilters = (state: CustomerState) => state.resetFilters;

// --- Derived selectors ---
export const selectHasActiveSearch = (state: CustomerState) => state.searchQuery.trim().length > 0;
