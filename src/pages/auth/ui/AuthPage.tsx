import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { LoginForm, RegisterForm } from "@/features/auth";
import { useAuthContext } from "@/app/providers";

export function AuthPage() {
	const [mode, setMode] = useState<"login" | "register">("login");
	const { isAuthenticated } = useAuthContext();

	if (isAuthenticated) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="relative flex min-h-screen items-center justify-center bg-cream">
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute right-0 top-0 h-125 w-125 -translate-y-1/4 translate-x-1/4 rounded-full bg-orange/10 blur-3xl" />
				<div className="absolute bottom-0 left-0 h-100 w-100 translate-y-1/4 -translate-x-1/4 rounded-full bg-brown/5 blur-3xl" />
			</div>

			<div className="relative z-10 w-full max-w-md px-4">
				<Link to="/" className="mb-8 flex flex-col items-center gap-2">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brown shadow-md">
						<span className="text-xl font-bold text-cream">L</span>
					</div>
					<span className="text-lg font-bold tracking-tight text-brown">Loyalty</span>
				</Link>

				<div className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-brown/5">
					<h1 className="mb-2 text-center text-2xl font-bold text-brown">{mode === "login" ? "Bon retour !" : "Créer un compte"}</h1>
					<p className="mb-6 text-center text-sm text-brown/60">
						{mode === "login" ? "Connectez-vous pour gérer votre programme de fidélité." : "Inscrivez votre commerce en quelques secondes."}
					</p>

					{mode === "login" ? <LoginForm onSwitchToRegister={() => setMode("register")} /> : <RegisterForm onSwitchToLogin={() => setMode("login")} onSuccess={() => setMode("login")} />}
				</div>
			</div>
		</div>
	);
}
