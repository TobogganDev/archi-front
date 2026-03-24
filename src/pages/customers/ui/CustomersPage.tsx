import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

export function CustomersPage() {
	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-brown">Clients</h1>
				<Button>Ajouter un client</Button>
			</div>

			<div className="mb-6 flex gap-4">
				<div className="flex-1">
					<Input placeholder="Rechercher un client..." />
				</div>
			</div>

			<div className="rounded-lg bg-white shadow-sm">
				<div className="border-b border-brown/10 px-6 py-4">
					<div className="grid grid-cols-4 gap-4 text-sm font-medium text-brown/60">
						<span>Nom</span>
						<span>Email</span>
						<span>Programme</span>
						<span>Tampons</span>
					</div>
				</div>
				<div className="p-6 text-center text-brown/60">
					Aucun client pour le moment
				</div>
			</div>
		</div>
	);
}
