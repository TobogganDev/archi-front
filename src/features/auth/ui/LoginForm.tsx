import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../model/auth.schema";
import type { LoginFormData } from "../model/auth.schema";
import { useLogin } from "../model/useLogin";

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
			<div className="flex flex-col gap-1">
				<label htmlFor="email" className="text-sm font-medium text-gray-700">
					Email
				</label>
				<input
					id="email"
					type="email"
					{...register("email")}
					className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
				{errors.email && (
					<p className="text-sm text-red-600">{errors.email.message}</p>
				)}
			</div>

			<div className="flex flex-col gap-1">
				<label htmlFor="password" className="text-sm font-medium text-gray-700">
					Mot de passe
				</label>
				<input
					id="password"
					type="password"
					{...register("password")}
					className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
				{errors.password && (
					<p className="text-sm text-red-600">{errors.password.message}</p>
				)}
			</div>

			{error && (
				<p className="text-sm text-red-600">{error.message}</p>
			)}

			<button
				type="submit"
				disabled={isPending}
				className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{isPending ? "Connexion en cours..." : "Se connecter"}
			</button>

			<p className="text-center text-sm text-gray-600">
				Pas encore de compte ?{" "}
				<button
					type="button"
					onClick={onSwitchToRegister}
					className="font-medium text-blue-600 hover:underline"
				>
					Créer un compte
				</button>
			</p>
		</form>
	);
}
