import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@/pages/landing/ui/LandingPage";
import { AuthPage } from "@/pages/auth/ui/AuthPage";
import { DashboardPage } from "@/pages/dashboard/ui/DashboardPage";
import { CustomersPage } from "@/pages/customers/ui/CustomersPage";
import { CustomerDetailPage } from "@/pages/customer-detail/ui/CustomerDetailPage";
import { ProgramsPage } from "@/pages/programs/ui/ProgramsPage";
import { ProfilePage } from "@/pages/profile/ui/ProfilePage";
import { ProtectedRoute } from "@/features/auth/ui/ProtectedRoute";

export const router = createBrowserRouter([
	{ path: "/", element: <LandingPage /> },
	{ path: "/auth", element: <AuthPage /> },
	{
		element: <ProtectedRoute />,
		children: [
			{ path: "/dashboard", element: <DashboardPage /> },
			{ path: "/customers", element: <CustomersPage /> },
			{ path: "/customers/:customerId", element: <CustomerDetailPage /> },
			{ path: "/programs", element: <ProgramsPage /> },
			{ path: "/profile", element: <ProfilePage /> },
		],
	},
]);
