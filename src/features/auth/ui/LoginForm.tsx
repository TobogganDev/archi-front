import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../model/auth.schema";
import type { LoginFormData } from "../model/auth.schema";
import { useLogin } from "../model/useLogin";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

interface LoginFormProps {
	onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	});

	const { login, isPending, error } = useLogin();

	const onSubmit = (data: LoginFormData) => {
		login(data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<Input id="email" type="email" label="Email" error={errors.email?.message} {...register("email")} />

			<Input id="password" type="password" label="Mot de passe" error={errors.password?.message} {...register("password")} />

			{error && <p className="text-sm text-error">{error.message}</p>}

			<Button type="submit" isLoading={isPending} className="mt-2 w-full">
				Se connecter
			</Button>

			<p className="text-center text-sm text-brown/60">
				Pas encore de compte ?{" "}
				<button type="button" onClick={onSwitchToRegister} className="font-medium text-orange hover:text-orange-dark hover:underline">
					Créer un compte
				</button>
			</p>
		</form>
	);
}
