import { useCallback } from "react";
import { useCustomerById } from "@/entities/customer";
import { useStampsByCustomer } from "@/entities/stamp";
import { usePrograms } from "@/entities/program";
import { CustomerScanner, useAddStamp, useScanStore, selectScannedCustomerId, selectScanError, selectSetScan, selectSetScanError, selectResetScan, selectScanStatus } from "@/features/scan-customer";
import type { Program } from "@/entities/program";
import type { StampWithProgram } from "@/entities/stamp";

// ---------------------------------------------------------------------------
// Program progress card — shown once a customer is identified
// ---------------------------------------------------------------------------

interface ProgramCardProps {
	program: Program;
	stamps: StampWithProgram[];
	customerId: string;
	merchantId: string;
}

function ProgramCard({ program, stamps, customerId, merchantId }: ProgramCardProps) {
	const { mutate: addStamp, isPending, isSuccess } = useAddStamp();

	const activeStamps = stamps.filter((s) => s.program_id === program.id && !s.redeemed);
	const count = activeStamps.length;
	const total = program.stamps_required;
	const isComplete = count >= total;
	const progressPct = Math.min((count / total) * 100, 100);

	function handleAddStamp() {
		addStamp({
			customer_id: customerId,
			program_id: program.id,
			merchant_id: merchantId,
			redeemed: false,
		});
	}

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

			<div className="mt-4">
				{isComplete ? (
					<div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
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
				) : (
					<button
						onClick={handleAddStamp}
						disabled={isPending || isSuccess}
						className="flex w-full items-center justify-center gap-2 rounded-lg bg-orange px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-orange/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isPending ? (
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
						) : isSuccess ? (
							<>
								<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
								</svg>
								Tampon ajouté !
							</>
						) : (
							<>
								<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
								</svg>
								Ajouter un tampon
							</>
						)}
					</button>
				)}
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Customer detail panel — shown after a successful scan
// ---------------------------------------------------------------------------

interface CustomerPanelProps {
	customerId: string;
	onReset: () => void;
}

function CustomerPanel({ customerId, onReset }: CustomerPanelProps) {
	const { data: customer, isLoading: loadingCustomer, isError } = useCustomerById(customerId);
	const { data: stamps = [], isLoading: loadingStamps } = useStampsByCustomer(customerId);
	const { data: programs = [], isLoading: loadingPrograms } = usePrograms(customer?.merchant_id ?? "");

	const isLoading = loadingCustomer || loadingStamps || loadingPrograms;

	if (isLoading) {
		return (
			<div className="flex flex-col items-center gap-3 py-12">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
				<p className="text-sm text-brown/60">Chargement du client...</p>
			</div>
		);
	}

	if (isError || !customer) {
		return (
			<div className="rounded-xl bg-red-50 p-5 text-center">
				<p className="font-semibold text-red-700">Client introuvable</p>
				<p className="mt-1 text-sm text-red-600">Ce QR code ne correspond à aucun client de votre commerce.</p>
				<button onClick={onReset} className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200">
					Scanner à nouveau
				</button>
			</div>
		);
	}

	return (
		<div>
			<div className="mb-5 flex items-center gap-4 rounded-xl bg-brown p-5 text-cream shadow-sm">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange text-lg font-bold">{customer.name.charAt(0).toUpperCase()}</div>
				<div className="min-w-0">
					<p className="truncate text-lg font-bold">{customer.name}</p>
					{customer.email && <p className="truncate text-sm text-cream/60">{customer.email}</p>}
					<p className="mt-0.5 text-xs text-cream/40">
						Client depuis{" "}
						{new Date(customer.created_at).toLocaleDateString("fr-FR", {
							month: "long",
							year: "numeric",
						})}
					</p>
				</div>
			</div>

			{programs.length === 0 ? (
				<p className="text-center text-sm text-brown/50">Aucun programme de fidélité actif pour ce commerce.</p>
			) : (
				<div className="flex flex-col gap-4">
					{programs.map((program) => (
						<ProgramCard key={program.id} program={program} stamps={stamps} customerId={customer.id} merchantId={customer.merchant_id} />
					))}
				</div>
			)}

			<button
				onClick={onReset}
				className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-brown/15 bg-white px-4 py-3 text-sm font-medium text-brown/70 transition-colors hover:border-brown/30 hover:text-brown"
			>
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
					/>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
				Scanner un autre client
			</button>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export function ScanPage() {
	const customerId = useScanStore(selectScannedCustomerId);
	const scanError = useScanStore(selectScanError);
	const scanStatus = useScanStore(selectScanStatus);
	const setScan = useScanStore(selectSetScan);
	const setScanError = useScanStore(selectSetScanError);
	const resetScan = useScanStore(selectResetScan);

	const handleScan = useCallback(
		(id: string) => {
			setScan(id);
		},
		[setScan],
	);

	const handleReset = useCallback(() => {
		resetScan();
	}, [resetScan]);

	return (
		<div>
			<div className="mb-6 flex items-center gap-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange/10">
					<svg className="h-5 w-5 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
						/>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
					</svg>
				</div>
				<h1 className="text-2xl font-bold text-brown">Scanner un client</h1>
			</div>

			<div className="mx-auto max-w-md">
				{scanStatus === "success" && customerId ? (
					<CustomerPanel customerId={customerId} onReset={handleReset} />
				) : (
					<div>
						<p className="mb-4 text-center text-sm text-brown/60">Pointez la caméra vers le QR code de la carte du client</p>

						{scanStatus === "error" && scanError ? (
							<div className="rounded-xl bg-red-50 p-5 text-center">
								<p className="text-sm font-medium text-red-700">{scanError}</p>
								<button onClick={handleReset} className="mt-3 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 hover:bg-red-200">
									Réessayer
								</button>
							</div>
						) : (
							<CustomerScanner onScan={handleScan} onError={setScanError} />
						)}

						<div className="mt-4 rounded-xl bg-brown/5 p-4 text-center text-xs text-brown/50">Le QR code se trouve sur la carte digitale du client (page wallet ou Apple Wallet)</div>
					</div>
				)}
			</div>
		</div>
	);
}
