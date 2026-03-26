import type { ReactNode } from "react";

interface SectionProps {
	children: ReactNode;
	className?: string;
	container?: boolean;
}

interface SectionHeaderProps {
	title: string;
	description?: string;
	centered?: boolean;
}

export function Section({ children, className = "", container = true }: SectionProps) {
	return (
		<section className={className}>
			{container ? (
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
			) : (
				children
			)}
		</section>
	);
}

export function SectionHeader({ title, description, centered = true }: SectionHeaderProps) {
	return (
		<div className={centered ? "text-center" : ""}>
			<h2 className="text-3xl font-bold text-brown sm:text-4xl">{title}</h2>
			{description && (
				<p className={`mt-4 text-brown/60 ${centered ? "mx-auto max-w-2xl" : ""}`}>
					{description}
				</p>
			)}
		</div>
	);
}
