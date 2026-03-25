import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";

export function ErrorPage() {
	const error = useRouteError();
	const navigate = useNavigate();

	let title = "Oups, une erreur est survenue";
	let message = "Quelque chose s'est mal passé. Veuillez réessayer.";

	if (isRouteErrorResponse(error)) {
		if (error.status === 404) {
			title = "Page introuvable";
			message = "La page que vous recherchez n'existe pas ou a été déplacée.";
		} else if (error.status === 403) {
			title = "Accès refusé";
			message = "Vous n'avez pas les droits pour accéder à cette page.";
		} else if (error.status === 500) {
			title = "Erreur serveur";
			message = "Une erreur interne est survenue. Veuillez réessayer plus tard.";
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-cream">
			<div className="mx-4 max-w-md text-center">
				<div className="mb-6 text-6xl">{isRouteErrorResponse(error) && error.status === 404 ? "🔍" : "⚠️"}</div>
				<h1 className="mb-3 text-2xl font-bold text-brown">{title}</h1>
				<p className="mb-8 text-brown/70">{message}</p>
				<div className="flex justify-center gap-3">
					<button onClick={() => navigate(-1)} className="rounded-lg border border-brown/20 px-5 py-2.5 text-sm font-medium text-brown transition-colors hover:bg-brown/5">
						Retour
					</button>
					<button onClick={() => navigate("/dashboard")} className="rounded-lg bg-orange px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange/90">
						Tableau de bord
					</button>
				</div>
			</div>
		</div>
	);
}
