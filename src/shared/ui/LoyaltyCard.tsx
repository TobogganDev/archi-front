interface LoyaltyCardProps {
	name: string;
	email?: string | null;
	createdAt: string;
	stampsRequired: number;
	activeStampsCount: number;
	programName?: string;
}

export function LoyaltyCard({ name, email, createdAt, stampsRequired, activeStampsCount, programName }: LoyaltyCardProps) {
	const filled = Math.min(activeStampsCount, stampsRequired);

	return (
		<div className="overflow-hidden rounded-2xl bg-brown p-6 text-cream shadow-xl">
			<div className="flex items-start justify-between">
				<div>
					<p className="text-xs font-medium uppercase tracking-wider text-cream/50">
						{programName ?? "Carte de fidélité"}
					</p>
					<h2 className="mt-1 text-xl font-bold">{name}</h2>
				</div>
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange font-bold text-lg text-white">
					{name.charAt(0).toUpperCase()}
				</div>
			</div>

			<div className="mt-6 flex flex-wrap gap-2">
				{Array.from({ length: stampsRequired }).map((_, i) => (
					<div
						key={i}
						className={`h-5 w-5 rounded-full border-2 transition-colors ${
							i < filled ? "border-orange bg-orange" : "border-cream/30"
						}`}
					/>
				))}
			</div>

			<div className="mt-2 text-xs text-cream/50">
				{filled} / {stampsRequired} tampons
			</div>

			<div className="mt-4 flex items-end justify-between border-t border-cream/10 pt-4 text-xs">
				{email && <span className="truncate text-cream/50">{email}</span>}
				<span className="ml-auto shrink-0 text-cream/30">
					Depuis{" "}
					{new Date(createdAt).toLocaleDateString("fr-FR", {
						month: "short",
						year: "numeric",
					})}
				</span>
			</div>
		</div>
	);
}
