import { createBrowserRouter } from "react-router-dom";
import { AuthPage } from "@/pages/auth/ui/AuthPage";
import { LandingPage } from "@/pages/landing/ui/LandingPage";
import { DashboardPage } from "@/pages/dashboard/ui/DashboardPage";
import { ProgressionPage } from "@/pages/progression";
import { CustomersPage } from "@/pages/customers/ui/CustomersPage";
import { CustomerDetailPage } from "@/pages/customer-detail/ui/CustomerDetailPage";
import { ProgramsPage } from "@/pages/programs/ui/ProgramsPage";
import { ProfilePage } from "@/pages/profile/ui/ProfilePage";
import { WalletPage } from "@/pages/wallet/ui/WalletPage";
import { ScanPage } from "@/pages/scan";
import { ErrorPage } from "@/pages/error";
import { ProtectedRoute } from "@/app/ProtectedRoute";

export const router = createBrowserRouter([
	{ path: "/", element: <LandingPage />, errorElement: <ErrorPage /> },
	{ path: "/auth", element: <AuthPage />, errorElement: <ErrorPage /> },
	{ path: "/wallet/:customerId", element: <WalletPage />, errorElement: <ErrorPage /> },
	{
		element: <ProtectedRoute />,
		errorElement: <ErrorPage />,
		children: [
			{ path: "/dashboard", element: <DashboardPage /> },
			{ path: "/dashboard/progression", element: <ProgressionPage /> },
			{ path: "/customers", element: <CustomersPage /> },
			{ path: "/customers/:id", element: <CustomerDetailPage /> },
			{ path: "/programs", element: <ProgramsPage /> },
			{ path: "/settings", element: <ProfilePage /> },
			{ path: "/scan", element: <ScanPage /> },
		],
	},
	{ path: "*", element: <ErrorPage /> },
]);
