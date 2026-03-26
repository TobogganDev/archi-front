import { Suspense, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useAuthContext } from "@/app/providers";
import { useSuspenseCustomers, useCustomerStore, selectSearchQuery, selectSetSearchQuery, selectHasActiveSearch } from "@/entities/customer";
import { useStampStatsByMerchant } from "@/entities/stamp";
import { AddCustomerModal } from "@/features/add-customer";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

function formatLastVisit(date: string | null): string {
	if (!date) return "—";
	const d = new Date(date);
	const now = new Date();
	const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "Aujourd'hui";
	if (diffDays === 1) return "Hier";
	if (diffDays < 7) return `Il y a ${diffDays} jours`;
	return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function CustomersList({ merchantId }: { merchantId: string }) {
	const search = useCustomerStore(selectSearchQuery);
	const setSearch = useCustomerStore(selectSetSearchQuery);
	const hasActiveSearch = useCustomerStore(selectHasActiveSearch);

	const { data: customers } = useSuspenseCustomers(merchantId);
	const { data: stampStats = [] } = useStampStatsByMerchant(merchantId);

	const statsMap = useMemo(() => {
		return new Map(stampStats.map((s) => [s.customer_id, s]));
	}, [stampStats]);

	const filtered = useMemo(() => {
		const q = search.toLowerCase().trim();
		if (!q) return customers;
		return customers.filter((c) => c.name.toLowerCase().includes(q) || (c.email ?? "").toLowerCase().includes(q));
	}, [customers, search]);

	return (
		<>
			<p className="mt-0.5 text-sm text-brown/60">
				{customers.length} client{customers.length !== 1 ? "s" : ""} fidélisé{customers.length !== 1 ? "s" : ""}
			</p>

			<div className="mb-4 mt-6">
				<Input placeholder="Rechercher par nom ou email..." value={search} onChange={(e) => setSearch(e.target.value)} />
			</div>

			<div className="rounded-lg bg-white shadow-sm">
				<div className="border-b border-brown/10 px-6 py-3">
					<div className="grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 text-xs font-medium uppercase tracking-wide text-brown/40">
						<span>Client</span>
						<span>Email</span>
						<span>Tampons</span>
						<span>Dernier passage</span>
					</div>
				</div>

				{filtered.length === 0 ? (
					<div className="flex flex-col items-center gap-2 py-16 text-center">
						<svg className="h-10 w-10 text-brown/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<p className="font-medium text-brown/40">{hasActiveSearch ? "Aucun client trouvé" : "Aucun client pour le moment"}</p>
						{!hasActiveSearch && <p className="text-sm text-brown/30">Ajoutez votre premier client pour démarrer.</p>}
					</div>
				) : (
					<ul>
						{filtered.map((customer, idx) => {
							const stats = statsMap.get(customer.id);
							return (
								<li key={customer.id}>
									<Link
										to={`/customers/${customer.id}`}
										className={`grid grid-cols-[2fr_2fr_1fr_1fr] gap-4 px-6 py-4 transition-colors hover:bg-cream/60 ${idx !== filtered.length - 1 ? "border-b border-brown/5" : ""}`}
									>
										<div className="flex items-center gap-3">
											<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange/10 text-sm font-semibold text-orange">
												{customer.name.charAt(0).toUpperCase()}
											</div>
											<span className="font-medium text-brown truncate">{customer.name}</span>
										</div>

										<div className="flex items-center">
											<span className="truncate text-sm text-brown/60">{customer.email ?? <span className="italic text-brown/30">—</span>}</span>
										</div>

										<div className="flex items-center">
											<span className="inline-flex items-center gap-1 rounded-full bg-orange/10 px-2.5 py-0.5 text-sm font-medium text-orange">
												<svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
													<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
												</svg>
												{stats?.stamp_count ?? 0}
											</span>
										</div>

										<div className="flex items-center">
											<span className="text-sm text-brown/60">{formatLastVisit(stats?.last_visit ?? null)}</span>
										</div>
									</Link>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</>
	);
}

function ErrorFallback({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
	const message = error instanceof Error ? error.message : "Une erreur inconnue est survenue";
	return (
		<div className="flex flex-col items-center gap-4 rounded-lg bg-red-50 py-16 text-center">
			<svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<p className="font-medium text-red-600">Impossible de charger les clients</p>
			<p className="max-w-md text-sm text-red-500">{message}</p>
			<button onClick={resetErrorBoundary} className="mt-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200">
				Réessayer
			</button>
		</div>
	);
}

export function CustomersPage() {
	const { user } = useAuthContext();
	const merchantId = user?.id ?? "";
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { reset } = useQueryErrorResetBoundary();

	return (
		<>
			<div>
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-2xl font-bold text-brown">Clients</h1>
					<Button onClick={() => setIsModalOpen(true)}>
						<svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						Ajouter un client
					</Button>
				</div>

				<ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
					<Suspense
						fallback={
							<div className="flex items-center justify-center py-16">
								<div className="h-6 w-6 animate-spin rounded-full border-4 border-orange border-t-transparent" />
							</div>
						}
					>
						<CustomersList merchantId={merchantId} />
					</Suspense>
				</ErrorBoundary>
			</div>

			{isModalOpen && <AddCustomerModal merchantId={merchantId} onClose={() => setIsModalOpen(false)} />}
		</>
	);
}
