export function CustomerDetailPage() {
	return (
		<div>
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-brown">Detail client</h1>
				<p className="text-brown/60">Informations et historique de fidelite</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-3">
				<div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-1">
					<h2 className="mb-4 text-lg font-semibold text-brown">Informations</h2>
					<div className="space-y-3">
						<div>
							<p className="text-sm text-brown/60">Nom</p>
							<p className="font-medium text-brown"></p>
						</div>
						<div>
							<p className="text-sm text-brown/60">Email</p>
							<p className="font-medium text-brown"></p>
						</div>
						<div>
							<p className="text-sm text-brown/60">Membre depuis</p>
							<p className="font-medium text-brown"></p>
						</div>
					</div>
				</div>

				<div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
					<h2 className="mb-4 text-lg font-semibold text-brown">Carte de fidelite</h2>
					<div className="flex h-32 items-center justify-center rounded-lg bg-cream text-brown/60">
						Carte de fidelite a implementer
					</div>
				</div>
			</div>

			<div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
				<h2 className="mb-4 text-lg font-semibold text-brown">Historique des tampons</h2>
				<p className="text-brown/60">Aucun tampon enregistre</p>
			</div>
		</div>
	);
}
