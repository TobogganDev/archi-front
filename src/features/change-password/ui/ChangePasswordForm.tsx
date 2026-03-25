import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../model/password.schema";
import type { ChangePasswordFormData } from "../model/password.schema";
import { useChangePassword } from "../model/useChangePassword";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

export function ChangePasswordForm() {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ChangePasswordFormData>({
		resolver: zodResolver(changePasswordSchema),
	});

	const { changePassword, isPending, error, isSuccess } = useChangePassword();

	const onSubmit = (data: ChangePasswordFormData) => {
		changePassword(data.newPassword, {
			onSuccess: () => reset(),
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
			<Input id="newPassword" type="password" label="Nouveau mot de passe" {...register("newPassword")} error={errors.newPassword?.message} />

			<Input id="confirmPassword" type="password" label="Confirmer le mot de passe" {...register("confirmPassword")} error={errors.confirmPassword?.message} />

			{error ? <p className="text-sm text-error">{error.message}</p> : null}

			{isSuccess ? <p className="text-sm text-success">Mot de passe modifié avec succès</p> : null}

			<Button type="submit" isLoading={isPending} className="self-start">
				Modifier le mot de passe
			</Button>
		</form>
	);
}
