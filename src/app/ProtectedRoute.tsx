import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/app/providers";
import { Sidebar } from "@/widgets/sidebar";

export function ProtectedRoute() {
	const { isAuthenticated, isLoading } = useAuthContext();

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-cream">
				<div className="flex flex-col items-center gap-4">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
					<span className="text-brown/70">Chargement...</span>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/auth" replace />;
	}

	return (
		<div className="min-h-screen bg-cream">
			<Sidebar />
			<main className="ml-64 min-h-screen p-8">
				<Outlet />
			</main>
		</div>
	);
}
