import type { ReactNode } from "react";

interface BadgeProps {
	children: ReactNode;
	pulse?: boolean;
	className?: string;
}

export function Badge({ children, pulse = false, className = "" }: BadgeProps) {
	return (
		<div
			className={`inline-flex items-center gap-2 rounded-full bg-orange/10 px-4 py-1.5 text-sm font-medium text-orange ${className}`}
		>
			{pulse && (
				<span className="relative flex h-2 w-2">
					<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange opacity-75" />
					<span className="relative inline-flex h-2 w-2 rounded-full bg-orange" />
				</span>
			)}
			{children}
		</div>
	);
}
