import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/store";

export function ProtectedRoute() {
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}
