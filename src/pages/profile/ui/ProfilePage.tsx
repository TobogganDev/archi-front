import { useAuthContext } from "@/app/providers";
import { ProfileForm } from "@/features/update-profile";
import { ChangePasswordForm } from "@/features/change-password";

export function ProfilePage() {
	const { user } = useAuthContext();

	if (!user) return null;

	return (
		<div>
			<h1 className="mb-6 text-2xl font-bold text-brown">Paramètres</h1>

			<div className="flex flex-col gap-8">
				<section className="rounded-lg bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-lg font-semibold text-brown">Informations du commerce</h2>
					<ProfileForm merchantId={user.id} />
				</section>

				<section className="rounded-lg bg-white p-6 shadow-sm">
					<h2 className="mb-4 text-lg font-semibold text-brown">Changer le mot de passe</h2>
					<ChangePasswordForm />
				</section>
			</div>
		</div>
	);
}
