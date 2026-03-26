import { Link } from "react-router-dom";

interface FooterLink {
	label: string;
	href: string;
}

const FOOTER_LINKS: FooterLink[] = [
	{ label: "Mentions légales", href: "#" },
	{ label: "Confidentialité", href: "#" },
	{ label: "Contact", href: "#" },
];

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-brown/10 bg-cream py-12">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col items-center justify-between gap-6 md:flex-row">
					<Link to="/" className="text-xl font-bold text-brown hover:text-orange transition-colors">
						Loyalty
					</Link>

					<nav className="flex items-center gap-6 text-sm text-brown/60">
						{FOOTER_LINKS.map((link) => (
							<a
								key={link.label}
								href={link.href}
								className="hover:text-brown transition-colors"
							>
								{link.label}
							</a>
						))}
					</nav>

					<div className="text-sm text-brown/40">
						© {currentYear} Loyalty. Tous droits réservés.
					</div>
				</div>
			</div>
		</footer>
	);
}
