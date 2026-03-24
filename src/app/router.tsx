import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/app/providers";
import { AuthPage } from "@/pages/auth/ui/AuthPage";
import { LandingPage } from "@/pages/landing/ui/LandingPage";
import { DashboardPage } from "@/pages/dashboard/ui/DashboardPage";
import { CustomersPage } from "@/pages/customers/ui/CustomersPage";
import { CustomerDetailPage } from "@/pages/customer-detail/ui/CustomerDetailPage";
import { ProgramsPage } from "@/pages/programs/ui/ProgramsPage";
import { ProfilePage } from "@/pages/profile/ui/ProfilePage";
import { Sidebar } from "@/widgets/sidebar";

function ProtectedRoute() {
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

export const router = createBrowserRouter([
	{ path: "/", element: <LandingPage /> },
	{ path: "/auth", element: <AuthPage /> },
	{
		element: <ProtectedRoute />,
		children: [
			{ path: "/dashboard", element: <DashboardPage /> },
			{ path: "/customers", element: <CustomersPage /> },
			{ path: "/customers/:id", element: <CustomerDetailPage /> },
			{ path: "/programs", element: <ProgramsPage /> },
			{ path: "/settings", element: <ProfilePage /> },
		],
	},
]);
