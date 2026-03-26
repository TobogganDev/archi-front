import type { ReactNode } from "react";

interface FeatureCardProps {
	icon: ReactNode;
	title: string;
	description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<div className="group relative rounded-2xl bg-cream p-8 transition-all hover:bg-brown hover:shadow-xl">
			<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange/10 text-orange transition-colors group-hover:bg-orange group-hover:text-white">
				{icon}
			</div>
			<h3 className="mt-6 text-xl font-semibold text-brown transition-colors group-hover:text-cream">
				{title}
			</h3>
			<p className="mt-2 text-brown/60 transition-colors group-hover:text-cream/70">
				{description}
			</p>
		</div>
	);
}
