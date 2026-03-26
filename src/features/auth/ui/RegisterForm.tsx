import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../model/auth.schema";
import type { RegisterFormData } from "../model/auth.schema";
import { useRegister } from "../model/useRegister";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

interface RegisterFormProps {
	onSwitchToLogin: () => void;
	onSuccess: () => void;
}

export function RegisterForm({ onSwitchToLogin, onSuccess }: RegisterFormProps) {
	const {
		register: registerField,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
	});

	const { register, isPending, error } = useRegister();

	const onSubmit = (data: RegisterFormData) => {
		register({ email: data.email, password: data.password, name: data.name }, { onSuccess });
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<Input id="name" type="text" label="Nom du commerce" error={errors.name?.message} {...registerField("name")} />

			<Input id="email" type="email" label="Email" error={errors.email?.message} {...registerField("email")} />

			<Input id="password" type="password" label="Mot de passe" error={errors.password?.message} {...registerField("password")} />

			<Input id="confirmPassword" type="password" label="Confirmer le mot de passe" error={errors.confirmPassword?.message} {...registerField("confirmPassword")} />

			{error && <p className="text-sm text-error">{error.message}</p>}

			<Button type="submit" isLoading={isPending} className="mt-2 w-full">
				Créer mon compte
			</Button>

			<p className="text-center text-sm text-brown/60">
				Déjà un compte ?{" "}
				<button type="button" onClick={onSwitchToLogin} className="font-medium text-orange hover:text-orange-dark hover:underline">
					Se connecter
				</button>
			</p>
		</form>
	);
}
