import { useAuthContext } from "@/app/providers";
import { useLogout } from "@/features/auth";
import { Button } from "@/shared/ui/Button";
import {
	BoxIcon,
	CameraIcon,
	CogIcon,
	HomeIcon,
	LogoutIcon,
	UsersIcon,
} from "@/shared/ui/icons/Icons";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
	{ to: "/dashboard", label: "Dashboard", icon: HomeIcon },
	{ to: "/customers", label: "Clients", icon: UsersIcon },
	{ to: "/programs", label: "Programmes", icon: BoxIcon },
	{ to: "/scan", label: "Scanner", icon: CameraIcon },
	{ to: "/settings", label: "Parametres", icon: CogIcon },
] as const;

export function Sidebar() {
	const location = useLocation();
	const { user } = useAuthContext();
	const { logout, isPending } = useLogout();

	return (
		<aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-brown/10 bg-brown">
			<div className="flex h-16 items-center border-b border-white/10 px-6">
				<Link to="/" className="text-xl font-bold text-cream">
					Loyalty
				</Link>
			</div>

			<nav className="flex-1 space-y-1 px-3 py-4">
				{NAV_ITEMS.map((item) => {
					const isActive =
						item.to === "/dashboard"
							? location.pathname.startsWith("/dashboard")
							: location.pathname === item.to;
					const Icon = item.icon;
					return (
						<Link
							key={item.to}
							to={item.to}
							className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
								isActive
									? "bg-orange text-white"
									: "text-cream/70 hover:bg-white/10 hover:text-cream"
							}`}
						>
							<Icon className="h-5 w-5" />
							{item.label}
						</Link>
					);
				})}
			</nav>

			<div className="border-t border-white/10 p-4">
				<div className="mb-3 truncate text-sm text-cream/70">
					{user?.email ?? "Utilisateur"}
				</div>
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start text-cream/70 hover:bg-white/10 hover:text-cream"
					onClick={() => logout()}
					disabled={isPending}
				>
					<LogoutIcon className="mr-2 h-4 w-4" />
					Deconnexion
				</Button>
			</div>
		</aside>
	);
}
