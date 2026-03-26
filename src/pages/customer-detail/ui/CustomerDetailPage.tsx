import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useCustomerById } from "@/entities/customer";
import { useStampsByCustomer } from "@/entities/stamp";
import { usePrograms } from "@/entities/program";
import type { Program } from "@/entities/program";
import type { StampWithProgram } from "@/entities/stamp";
import { LoyaltyCard } from "@/shared/ui/LoyaltyCard";
import { useDeleteCustomer } from "@/features/add-customer";

function ProgramProgress({ program, stamps }: { program: Program; stamps: StampWithProgram[] }) {
	const activeStamps = stamps.filter((s) => s.program_id === program.id && !s.redeemed);
	const count = activeStamps.length;
	const total = program.stamps_required;
	const isComplete = count >= total;
	const progressPct = Math.min((count / total) * 100, 100);

	return (
		<div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-brown/5">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<h3 className="truncate font-semibold text-brown">{program.name}</h3>
					<p className="mt-0.5 text-xs text-brown/50">
						Récompense : <span className="font-medium text-brown/70">{program.reward}</span>
					</p>
				</div>
				<span className="shrink-0 text-sm font-bold text-brown">
					{count} / {total}
				</span>
			</div>

			<div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brown/10">
				<div className="h-full rounded-full bg-orange transition-all duration-500" style={{ width: `${progressPct}%` }} />
			</div>

			<div className="mt-3 flex flex-wrap gap-1.5">
				{Array.from({ length: total }).map((_, i) => (
					<div key={i} className={`h-5 w-5 rounded-full border-2 transition-colors ${i < count ? "border-orange bg-orange" : "border-brown/20 bg-transparent"}`} />
				))}
			</div>

			{isComplete && (
				<div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
					<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
						/>
					</svg>
					Carte complète — récompense à offrir !
				</div>
			)}
		</div>
	);
}

export function CustomerDetailPage() {
	const [qrModalOpen, setQrModalOpen] = useState(false);
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { data: customer, isLoading: loadingCustomer, isError } = useCustomerById(id ?? "");
	const { data: stamps = [], isLoading: loadingStamps } = useStampsByCustomer(id ?? "");
	const { data: programs = [], isLoading: loadingPrograms } = usePrograms(customer?.merchant_id ?? "");
	const { deleteCustomerAsync, isPending: isDeleting } = useDeleteCustomer();

	const handleDelete = async () => {
		if (!customer) return;
		if (!confirm(`Supprimer le client "${customer.name}" ? Cette action est irréversible.`)) return;
		await deleteCustomerAsync({ id: customer.id, merchantId: customer.merchant_id });
		navigate("/customers");
	};

	const isLoading = loadingCustomer || loadingStamps || loadingPrograms;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-24">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
			</div>
		);
	}

	if (isError || !customer) {
		return (
			<div className="flex flex-col items-center gap-4 py-24 text-center">
				<svg className="h-12 w-12 text-brown/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
				</svg>
				<h1 className="text-xl font-semibold text-brown">Client introuvable</h1>
				<p className="text-brown/60">Ce client n'existe pas ou a été supprimé.</p>
				<Link to="/customers" className="mt-2 text-sm font-medium text-orange hover:text-orange/80">
					Retour à la liste
				</Link>
			</div>
		);
	}

	const sortedStamps = [...stamps].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

	return (
		<div>
			<div className="mb-6 flex items-center gap-3">
				<Link to="/customers" className="flex h-9 w-9 items-center justify-center rounded-lg border border-brown/10 text-brown/60 transition-colors hover:bg-cream hover:text-brown">
					<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
				</Link>
				<div>
					<h1 className="text-2xl font-bold text-brown">Détail client</h1>
					<p className="text-sm text-brown/60">Informations et historique de fidélité</p>
				</div>
			</div>

			<div className="flex flex-col gap-6 lg:flex-row">
				<div className="flex-1">
					{(() => {
						const primaryProgram = programs[0];
						const activeStampsCount = primaryProgram
							? stamps.filter((s) => s.program_id === primaryProgram.id && !s.redeemed).length
							: stamps.filter((s) => !s.redeemed).length;
						const stampsRequired = primaryProgram?.stamps_required ?? 10;
						return (
							<LoyaltyCard
								name={customer.name}
								email={customer.email}
								createdAt={customer.created_at}
								stampsRequired={stampsRequired}
								activeStampsCount={activeStampsCount}
								programName={primaryProgram?.name}
							/>
						);
					})()}
				</div>

				<button type="button" onClick={() => setQrModalOpen(true)} className="flex cursor-pointer flex-col items-center rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
					<div className="rounded-xl bg-cream p-3">
						<QRCodeSVG value={`${window.location.origin}/wallet/${customer.id}`} size={120} fgColor="#1A1008" bgColor="#F0E6D1" level="M" />
					</div>
					<p className="mt-2 text-center text-xs text-brown/40">Cliquez pour agrandir</p>
				</button>
			</div>

			<div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="rounded-lg bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-lg font-semibold text-brown">Informations</h2>
					<div className="space-y-3">
						<div>
							<p className="text-sm text-brown/60">Nom</p>
							<p className="font-medium text-brown">{customer.name}</p>
						</div>
						<div>
							<p className="text-sm text-brown/60">Email</p>
							<p className="font-medium text-brown">{customer.email ?? <span className="italic text-brown/30">Non renseigné</span>}</p>
						</div>
						<div>
							<p className="text-sm text-brown/60">Membre depuis</p>
							<p className="font-medium text-brown">
								{new Date(customer.created_at).toLocaleDateString("fr-FR", {
									day: "numeric",
									month: "long",
									year: "numeric",
								})}
							</p>
						</div>
						<div>
							<p className="text-sm text-brown/60">Tampons cumulés</p>
							<p className="font-medium text-brown">{stamps.length}</p>
						</div>
					</div>
					<div className="mt-6 border-t border-brown/10 pt-4">
						<button
							type="button"
							onClick={handleDelete}
							disabled={isDeleting}
							className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
						>
							{isDeleting ? (
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
							) : (
								<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							)}
							Supprimer ce client
						</button>
					</div>
				</div>

				<div className="rounded-lg bg-white p-6 shadow-sm lg:col-span-2">
					<h2 className="mb-4 text-lg font-semibold text-brown">Programmes de fidélité</h2>
					{programs.length === 0 ? (
						<div className="flex items-center justify-center rounded-lg bg-cream/50 py-12 text-brown/60">Aucun programme de fidélité actif</div>
					) : (
						<div className="flex flex-col gap-4">
							{programs.map((program) => (
								<ProgramProgress key={program.id} program={program} stamps={stamps} />
							))}
						</div>
					)}
				</div>
			</div>

			<div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
				<h2 className="mb-4 text-lg font-semibold text-brown">Historique des tampons</h2>
				{sortedStamps.length === 0 ? (
					<p className="text-brown/60">Aucun tampon enregistré</p>
				) : (
					<div className="divide-y divide-brown/5">
						{sortedStamps.map((stamp) => (
							<div key={stamp.id} className="flex items-center gap-3 py-3">
								<div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: stamp.program?.color ?? "#FF3B00" }} />
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-brown">{stamp.program?.name ?? "Programme inconnu"}</p>
								</div>
								<span className="shrink-0 text-xs text-brown/50">
									{new Date(stamp.created_at).toLocaleDateString("fr-FR", {
										day: "numeric",
										month: "short",
										year: "numeric",
									})}
								</span>
								{stamp.redeemed && <span className="shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">Utilisé</span>}
							</div>
						))}
					</div>
				)}
			</div>

			{qrModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setQrModalOpen(false)}>
					<div className="relative mx-4 flex flex-col items-center rounded-2xl bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
						<button
							type="button"
							onClick={() => setQrModalOpen(false)}
							className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-brown/40 transition-colors hover:bg-brown/5 hover:text-brown"
						>
							<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
						<h3 className="mb-4 text-lg font-semibold text-brown">QR code de {customer.name}</h3>
						<div className="rounded-2xl bg-cream p-6">
							<QRCodeSVG value={`${window.location.origin}/wallet/${customer.id}`} size={280} fgColor="#1A1008" bgColor="#F0E6D1" level="M" />
						</div>
						<p className="mt-3 text-sm text-brown/50">Scannez pour accéder à la carte de fidélité</p>
					</div>
				</div>
			)}
		</div>
	);
}
