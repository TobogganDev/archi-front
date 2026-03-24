import { createContext, useContext } from "react";
import type { User } from "@supabase/supabase-js";

export interface AuthContextValue {
	user: User | null;
	isLoading: boolean;
	isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuthContext must be used within an AuthProvider");
	}
	return context;
}
