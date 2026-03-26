import { Badge } from "@/shared/ui/Badge";
import { Button } from "@/shared/ui/Button";
import { FeatureCard } from "@/shared/ui/FeatureCard";
import {
	ArrowRightIcon,
	ChartIcon,
	CheckCircleIcon,
	LightningIcon,
	PhoneIcon,
} from "@/shared/ui/icons/Icons";
import { Section, SectionHeader } from "@/shared/ui/Section";
import { Footer } from "@/widgets/footer/ui/Footer";
import { Header } from "@/widgets/header/ui/Header";
import { useState } from "react";
import { Link } from "react-router-dom";

const FEATURES = [
	{
		icon: <PhoneIcon className="h-6 w-6" />,
		title: "100% Digital",
		description: "Fini les cartes en papier perdues. Vos clients ont leur fidélité dans leur poche.",
	},
	{
		icon: <LightningIcon className="h-6 w-6" />,
		title: "Simple & Rapide",
		description: "Un scan QR code suffit. Tamponnez en 2 secondes, sans app à installer.",
	},
	{
		icon: <ChartIcon className="h-6 w-6" />,
		title: "Statistiques",
		description: "Suivez vos clients fidèles, analysez leur fréquence et boostez votre activité.",
	},
];

function DemoCard() {
	const [stamps, setStamps] = useState(6);
	const totalStamps = 10;

	return (
		<div
			className="relative cursor-pointer select-none"
			onClick={() => setStamps((s) => (s >= totalStamps ? 1 : s + 1))}
		>
			<div className="absolute -inset-4 rounded-3xl bg-orange/20 blur-2xl" />
			<div className="relative overflow-hidden rounded-2xl bg-brown p-6 text-cream shadow-2xl transition-transform hover:scale-[1.02]">
				<div className="flex items-start justify-between">
					<div>
						<p className="text-xs font-medium uppercase tracking-wider text-cream/50">
							Boulangerie du Coin
						</p>
						<h2 className="mt-1 text-xl font-bold">Quentin Pacheu</h2>
					</div>
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange font-bold text-lg text-white">
						QP
					</div>
				</div>

				<div className="mt-6 flex flex-wrap gap-2">
					{Array.from({ length: totalStamps }).map((_, i) => (
						<div
							key={i}
							className={`h-5 w-5 rounded-full border-2 transition-all duration-300 ${i < stamps ? "border-orange bg-orange scale-110" : "border-cream/30"
								}`}
						/>
					))}
				</div>

				<div className="mt-2 text-xs text-cream/50">
					Un croissant offert au 10ème tampon !
				</div>

				<div className="mt-4 flex items-end justify-between border-t border-cream/10 pt-4 text-xs">
					<span className="truncate text-cream/50">quentin.pacheu@email.com</span>
					<span className="ml-auto shrink-0 text-cream/30">Cliquez pour tester</span>
				</div>
			</div>
		</div>
	);
}

function HeroSection() {
	return (
		<section className="relative overflow-hidden">
			<div className="absolute inset-0 -z-10">
				<div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/4 translate-x-1/4 rounded-full bg-orange/10 blur-3xl" />
				<div className="absolute bottom-0 left-0 h-[400px] w-[400px] translate-y-1/4 -translate-x-1/4 rounded-full bg-brown/5 blur-3xl" />
			</div>

			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
				<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
					<div>
						<Badge pulse>Nouveau : Wallet Apple & Google</Badge>

						<h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-brown sm:text-5xl lg:text-6xl">
							La fidélité client
							<span className="relative z-10 text-orange"> simplifiée</span>
						</h1>

						<p className="mt-6 text-lg leading-relaxed text-brown/70">
							Digitalisez vos cartes de fidélité en quelques clics.
							<strong className="text-brown"> Zéro papier, zéro app à installer</strong> —
							vos clients scannent, vous tamponnez, c'est tout.
						</p>

						<Link to="/auth">
							<Button size="lg" className="w-full sm:w-auto mt-6">
								Inscrire mon établissement
								<ArrowRightIcon className="ml-2 h-5 w-5" />
							</Button>
						</Link>

						<div className="mt-8 flex items-center gap-6 text-sm text-brown/60">
							<div className="flex items-center gap-2">
								<CheckCircleIcon className="h-5 w-5 text-success" />
								Gratuit 30 jours
							</div>
							<div className="flex items-center gap-2">
								<CheckCircleIcon className="h-5 w-5 text-success" />
								Sans engagement
							</div>
						</div>
					</div>

					<div className="relative mx-auto w-full max-w-md lg:mx-0">
						<DemoCard />
					</div>
				</div>
			</div>
		</section>
	);
}

function FeaturesSection() {
	return (
		<Section className="border-y border-brown/10 bg-white/50 py-20">
			<SectionHeader
				title="Pourquoi choisir Loyalty ?"
				description="Conçu pour les petits commerces qui veulent fidéliser sans complexité."
			/>

			<div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{FEATURES.map((feature, i) => (
					<FeatureCard
						key={i}
						icon={feature.icon}
						title={feature.title}
						description={feature.description}
					/>
				))}
			</div>
		</Section>
	);
}

function CTASection() {
	return (
		<section className="relative overflow-hidden bg-brown py-20">
			<div className="absolute inset-0">
				<div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-orange/20 blur-3xl" />
				<div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-orange/10 blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
				<h2 className="text-3xl font-bold text-cream sm:text-4xl">
					Prêt à fidéliser vos clients ?
				</h2>
				<p className="mx-auto mt-4 max-w-2xl text-cream/70">
					Rejoignez les centaines de commerçants qui ont déjà digitalisé leur programme de
					fidélité.
				</p>

				<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<Link to="/auth">
						<Button size="lg" className="bg-orange text-white hover:bg-orange-light">
							Créer mon compte gratuitement
							<ArrowRightIcon className="ml-2 h-5 w-5" />
						</Button>
					</Link>
				</div>

				<p className="mt-6 text-sm text-cream/50">
					Essai gratuit 30 jours • Aucune carte bancaire requise
				</p>
			</div>
		</section>
	);
}

export function LandingPage() {
	return (
		<div className="min-h-screen">
			<Header />
			<HeroSection />
			<FeaturesSection />
			<CTASection />
			<Footer />
		</div>
	);
}
