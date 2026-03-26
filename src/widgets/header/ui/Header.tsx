import type { MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/app/providers";
import { useLogout } from "@/features/auth";
import { Button } from "@/shared/ui/Button";

const NAV_LINKS = [
	{ to: "/dashboard", label: "Dashboard" },
	{ to: "/customers", label: "Clients" },
	{ to: "/programs", label: "Programmes" },
] as const;

export function Header() {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuthContext();
	const { logout, isPending } = useLogout();

	const handleProtectedClick = (e: MouseEvent<HTMLAnchorElement>) => {
		if (!isAuthenticated) {
			e.preventDefault();
			void navigate("/auth");
		}
	};

	return (
		<header className="sticky top-0 z-50 border-b border-brown/10 bg-cream/95 backdrop-blur-sm">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link
					to="/"
					className="text-xl font-bold text-brown transition-colors hover:text-orange"
				>
					Loyalty
				</Link>

				<nav className="hidden items-center gap-1 md:flex">
					{NAV_LINKS.map((link) => (
						<Link
							key={link.to}
							to={link.to}
							onClick={handleProtectedClick}
							className="rounded-md px-3 py-2 text-sm font-medium text-brown/80 transition-colors hover:bg-brown/5 hover:text-brown"
						>
							{link.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-3">
					{isAuthenticated ? (
						<>
							<Link
								to="/settings"
								className="rounded-md px-3 py-2 text-sm font-medium text-brown/80 transition-colors hover:bg-brown/5 hover:text-brown"
							>
								Profil
							</Link>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => logout()}
								disabled={isPending}
							>
								Deconnexion
							</Button>
						</>
					) : (
						<>
							<Link to="/auth">
								<Button variant="ghost" size="sm">
									Se connecter
								</Button>
							</Link>
							<Link to="/auth">
								<Button size="sm">Commencer</Button>
							</Link>
						</>
					)}
				</div>
			</div>
		</header>
	);
}
