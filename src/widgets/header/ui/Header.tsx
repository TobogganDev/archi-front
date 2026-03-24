import type { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/store";

const PROTECTED_LINKS = [
	{ to: "/dashboard", label: "Dashboard" },
	{ to: "/customers", label: "Clients" },
	{ to: "/programs", label: "Programmes" },
	{ to: "/profile", label: "Profil" },
] as const;

export function Header() {
	const navigate = useNavigate();
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const setAuthenticated = useAuthStore((s) => s.setAuthenticated);

	const handleProtectedClick = (e: MouseEvent<HTMLAnchorElement>) => {
		if (!isAuthenticated) {
			e.preventDefault();
			void navigate("/auth");
		}
	};

	return (
		<header>
			<Link to="/">LoyaltyCard</Link>
			<nav>
				{PROTECTED_LINKS.map((link) => (
					<Link
						key={link.to}
						to={link.to}
						onClick={handleProtectedClick}
					>
						{link.label}
					</Link>
				))}
				{isAuthenticated ? (
					<button onClick={() => setAuthenticated(false)}>
						Déconnexion
					</button>
				) : (
					<Link to="/auth">Se connecter</Link>
				)}
			</nav>
		</header>
	);
}
