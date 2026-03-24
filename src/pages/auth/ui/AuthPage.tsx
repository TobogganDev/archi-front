import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LoginForm, RegisterForm } from "@/features/auth";
import { useAuthContext } from "@/app/providers";

export function AuthPage() {
	const [mode, setMode] = useState<"login" | "register">("login");
	const { isAuthenticated } = useAuthContext();

	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
				<h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
					{mode === "login" ? "Connexion" : "Créer un compte"}
				</h1>
				{mode === "login" ? (
					<LoginForm onSwitchToRegister={() => setMode("register")} />
				) : (
					<RegisterForm
						onSwitchToLogin={() => setMode("login")}
						onSuccess={() => setMode("login")}
					/>
				)}
			</div>
		</div>
	);
}
