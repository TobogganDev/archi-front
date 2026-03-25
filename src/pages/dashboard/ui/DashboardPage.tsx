import { useMemo, useState } from "react";
import { useAuthContext } from "@/app/providers";
import { useCustomers } from "@/entities/customer";
import { usePrograms } from "@/entities/program";
import { useStampsByMerchant } from "@/entities/stamp";

type PeriodDays = 1 | 7 | 30;

function getDeltaPercent(current: number, previous: number): number {
	if (previous === 0) {
		return current === 0 ? 0 : 100;
	}

	return ((current - previous) / previous) * 100;
}

function getDeltaText(current: number, previous: number): string {
	const delta = getDeltaPercent(current, previous);
	const sign = delta > 0 ? "+" : "";
	return `${sign}${delta.toFixed(1)}% `;
}

function getDeltaColorClass(current: number, previous: number): string {
	if (current > previous) return "text-green-700";
	if (current < previous) return "text-red-700";
	return "text-brown/60";
}

export function DashboardPage() {
	const { user } = useAuthContext();
	const [periodDays, setPeriodDays] = useState<PeriodDays>(7);

	const merchantId = user?.id;

	const {
		data: customers = [],
		isLoading: isCustomersLoading,
		error: customersError,
	} = useCustomers(merchantId ?? "");
	const {
		data: programs = [],
		isLoading: isProgramsLoading,
		error: programsError,
	} = usePrograms(merchantId ?? "");
	const {
		data: stamps = [],
		isLoading: isStampsLoading,
		error: stampsError,
	} = useStampsByMerchant(merchantId ?? "");

	const isLoading = isCustomersLoading || isProgramsLoading || isStampsLoading;
	const error = customersError ?? programsError ?? stampsError;

	const periodData = useMemo(() => {
		const nowMs = Date.now();
		const periodMs = periodDays * 24 * 60 * 60 * 1000;
		const currentStartMs = nowMs - periodMs;
		const previousStartMs = nowMs - periodMs * 2;

		const currentStamps = stamps.filter((stamp) => {
			const stampMs = new Date(stamp.created_at).getTime();
			return stampMs >= currentStartMs && stampMs <= nowMs;
		});

		const previousStamps = stamps.filter((stamp) => {
			const stampMs = new Date(stamp.created_at).getTime();
			return stampMs >= previousStartMs && stampMs < currentStartMs;
		});

		const currentActiveCustomers = new Set(currentStamps.map((stamp) => stamp.customer_id)).size;
		const previousActiveCustomers = new Set(previousStamps.map((stamp) => stamp.customer_id)).size;

		const currentRewards = currentStamps.filter((stamp) => stamp.redeemed).length;
		const previousRewards = previousStamps.filter((stamp) => stamp.redeemed).length;

		const currentNewCustomers = customers.filter((customer) => {
			const customerMs = new Date(customer.created_at).getTime();
			return customerMs >= currentStartMs && customerMs <= nowMs;
		}).length;

		const previousNewCustomers = customers.filter((customer) => {
			const customerMs = new Date(customer.created_at).getTime();
			return customerMs >= previousStartMs && customerMs < currentStartMs;
		}).length;


		return {
			currentStamps,
			currentActiveCustomers,
			previousActiveCustomers,
			currentRewards,
			previousRewards,
			currentNewCustomers,
			previousNewCustomers,
			currentStampsCount: currentStamps.length,
			previousStampsCount: previousStamps.length,
		};
	}, [stamps, customers, periodDays]);

	const {
		currentActiveCustomers, currentStampsCount, currentRewards, currentNewCustomers, currentStamps,
		previousActiveCustomers, previousStampsCount, previousRewards, previousNewCustomers,
	} = periodData;

	const recentStamps = useMemo(() => {
		return currentStamps.slice(0, 8);
	}, [currentStamps]);

	const nearRewardCustomers = useMemo(() => {
		const counts = new Map<string, number>();

		for (const stamp of stamps) {
			if (stamp.redeemed) continue;
			const key = `${stamp.customer_id}-${stamp.program_id}`;
			counts.set(key, (counts.get(key) ?? 0) + 1);
		}

		const nearReward = [] as {
			customerName: string;
			programName: string;
			remaining: number;
		}[];

		for (const [key, count] of counts.entries()) {
			const [customerId, programId] = key.split("-");
			const customer = customers.find((item) => item.id === customerId);
			const program = programs.find((item) => item.id === programId);

			if (!customer || !program) continue;

			const remaining = program.stamps_required - count;
			if (remaining > 0 && remaining <= 2) {
				nearReward.push({
					customerName: customer.name,
					programName: program.name,
					remaining,
				});
			}
		}

		return nearReward
			.sort((a, b) => a.remaining - b.remaining)
			.slice(0, 8);
	}, [stamps, customers, programs]);

	if (!merchantId) {
		return <p className="text-brown/70">Utilisateur non connecte.</p>;
	}

	if (isLoading) {
		return <p className="text-brown/70">Chargement du dashboard...</p>;
	}

	if (error) {
		return (
			<p className="text-sm text-red-600">
				Erreur lors du chargement du dashboard: {error.message}
			</p>
		);
	}

	const dashbboardData = [
		{
			title: "Clients actifs",
			current: currentActiveCustomers,
			previous: previousActiveCustomers,
		},
		{
			title: "Tampons",
			current: currentStampsCount,
			previous: previousStampsCount,
		},
		{
			title: "Recompenses",
			current: currentRewards,
			previous: previousRewards,
		},
		{
			title: "Nouveaux clients",
			current: currentNewCustomers,
			previous: previousNewCustomers,
		}
	]

	return (
		<div>
			<div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<h1 className="text-2xl font-bold text-brown">Dashboard</h1>
				<div className="inline-flex rounded-lg bg-white p-1 shadow-sm">
					{([1, 7, 30] as PeriodDays[]).map((days) => (
						<button
							key={days}
							type="button"
							onClick={() => setPeriodDays(days)}
							className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${periodDays === days
								? "bg-orange text-white"
								: "text-brown/70 hover:bg-cream"
								}`}
						>
							{days === 1 ? "1 jour" : `${days} jours`}
						</button>
					))}
				</div>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
				{dashbboardData.map((item, index) => (
					<div key={index} className="rounded-lg bg-white p-6 shadow-sm">
						<p className="text-sm font-medium text-brown/60">{item.title}</p>
						<p className="mt-2 text-3xl font-bold text-brown">{item.current}</p>
						<p className={`mt-2 text-xs font-medium ${getDeltaColorClass(item.current, item.previous)}`}>
							{getDeltaText(item.current, item.previous)}
						</p>
					</div>
				))}
			</div>

			<div className="mt-8 grid gap-6 lg:grid-cols-2">
				<div className="rounded-lg bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-lg font-semibold text-brown">Activite recente</h2>
					{recentStamps.length === 0 ? (
						<p className="text-brown/60">Aucune activite recente</p>
					) : (
						<ul className="space-y-2">
							{recentStamps.map((stamp) => (
								<li key={stamp.id} className="rounded-md bg-cream p-3 text-sm text-brown/80">
									<span className="font-medium">{stamp.customer?.name ?? "Client"}</span>
									{" · "}
									{stamp.program?.name ?? "Programme"}
									{" · "}
									{new Date(stamp.created_at).toLocaleDateString("fr-FR")}
								</li>
							))}
						</ul>
					)}
				</div>
				<div className="rounded-lg bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-lg font-semibold text-brown">Clients proches de la recompense</h2>
					<p className="mb-3 text-xs text-brown/60">Vue globale sur l'ensemble des tampons non valides</p>
					{nearRewardCustomers.length === 0 ? (
						<p className="text-brown/60">Aucun client proche</p>
					) : (
						<ul className="space-y-2">
							{nearRewardCustomers.map((item, index) => (
								<li
									key={`${item.customerName}-${item.programName}-${index}`}
									className="rounded-md bg-cream p-3 text-sm text-brown/80"
								>
									<span className="font-medium">{item.customerName}</span>
									{" · "}
									{item.programName}
									{" · Plus que "}
									{item.remaining}
									{item.remaining > 1 ? " tampons" : " tampon"}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div >
	);
}
