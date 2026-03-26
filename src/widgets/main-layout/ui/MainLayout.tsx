import type { ReactNode } from "react";
import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";

interface MainLayoutProps {
	children: ReactNode;
	title?: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
	return (
		<div className="min-h-screen bg-cream">
			<Sidebar />
			<main className="ml-64 min-h-screen">
				<div className="p-8">
					{title ? (
						<h1 className="mb-6 text-2xl font-bold text-brown">
							{title}
						</h1>
					) : null}
					{children}
				</div>
			</main>
		</div>
	);
}
