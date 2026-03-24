import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/app/providers";
import { AuthPage } from "@/pages/auth/ui/AuthPage";
import { LandingPage } from "@/pages/landing/ui/LandingPage";
import { DashboardPage } from "@/pages/dashboard/ui/DashboardPage";
import { CustomersPage } from "@/pages/customers/ui/CustomersPage";
import { CustomerDetailPage } from "@/pages/customer-detail/ui/CustomerDetailPage";
import { ProgramsPage } from "@/pages/programs/ui/ProgramsPage";
import { ProfilePage } from "@/pages/profile/ui/ProfilePage";

function ProtectedRoute() {
	const { isAuthenticated, isLoading } = useAuthContext();

	if (isLoading) {
		return (
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
				Chargement...
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/auth" replace />;
	}

	return <Outlet />;
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
