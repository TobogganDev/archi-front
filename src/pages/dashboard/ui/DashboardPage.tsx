import { Link } from "react-router-dom";

export function DashboardPage() {
	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold text-brown">Dashboard</h1>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-lg bg-white p-6 shadow-sm">
					<p className="text-sm font-medium text-brown/60">Clients actifs</p>
					<p className="mt-2 text-3xl font-bold text-brown"></p>
				</div>
				<div className="rounded-lg bg-white p-6 shadow-sm">
					<p className="text-sm font-medium text-brown/60">Programmes</p>
					<p className="mt-2 text-3xl font-bold text-brown"></p>
				</div>
				<div className="rounded-lg bg-white p-6 shadow-sm">
					<p className="text-sm font-medium text-brown/60">Tampons ce mois</p>
					<p className="mt-2 text-3xl font-bold text-brown"></p>
				</div>
				<div className="rounded-lg bg-white p-6 shadow-sm">
					<p className="text-sm font-medium text-brown/60">Recompenses</p>
					<p className="mt-2 text-3xl font-bold text-brown"></p>
				</div>
			</div>

			<Link
				to="/scan"
				className="mt-8 flex items-center justify-between rounded-xl bg-orange px-6 py-5 text-white shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99]"
			>
				<div>
					<p className="text-sm font-medium text-white/70">Action rapide</p>
					<p className="mt-0.5 text-lg font-bold">Scanner un client</p>
					<p className="mt-1 text-xs text-white/60">
						Identifiez un client, consultez sa progression et ajoutez un tampon
					</p>
				</div>
				<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15">
					<svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
			</Link>

			<div className="mt-8 grid gap-6 lg:grid-cols-2">
				<div className="rounded-lg bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-lg font-semibold text-brown">Activite recente</h2>
					<p className="text-brown/60">Aucune activite recente</p>
				</div>
				<div className="rounded-lg bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-lg font-semibold text-brown">Clients proches de la recompense</h2>
					<p className="text-brown/60">Aucun client proche</p>
				</div>
			</div>
		</div>
	);
}
