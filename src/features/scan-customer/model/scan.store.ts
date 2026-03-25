import { create } from "zustand";

type ScanStatus = "idle" | "success" | "error";

interface ScanState {
	scannedCustomerId: string | null;
	scanError: string | null;
	setScan: (customerId: string) => void;
	setScanError: (error: string) => void;
	resetScan: () => void;
}

export const useScanStore = create<ScanState>()((set) => ({
	scannedCustomerId: null,
	scanError: null,

	setScan: (customerId) => set({ scannedCustomerId: customerId, scanError: null }),
	setScanError: (scanError) => set({ scanError, scannedCustomerId: null }),
	resetScan: () => set({ scannedCustomerId: null, scanError: null }),
}));

// --- Strict selectors ---
export const selectScannedCustomerId = (state: ScanState) => state.scannedCustomerId;
export const selectScanError = (state: ScanState) => state.scanError;
export const selectSetScan = (state: ScanState) => state.setScan;
export const selectSetScanError = (state: ScanState) => state.setScanError;
export const selectResetScan = (state: ScanState) => state.resetScan;

// --- Derived selectors ---
export const selectScanStatus = (state: ScanState): ScanStatus => {
	if (state.scannedCustomerId) return "success";
	if (state.scanError) return "error";
	return "idle";
};
