import { Button } from "@/shared/ui/Button";

export function ProgramsPage() {
	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-brown">Programmes de fidelite</h1>
				<Button>Creer un programme</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-brown/20 bg-white text-brown/60 transition-colors hover:border-orange hover:text-orange">
					<div className="text-center">
						<svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
						</svg>
						<p className="mt-2 text-sm font-medium">Nouveau programme</p>
					</div>
				</div>
			</div>
		</div>
	);
}
