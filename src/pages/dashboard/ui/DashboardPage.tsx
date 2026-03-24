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
