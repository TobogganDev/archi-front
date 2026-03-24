import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../model/auth.schema";
import type { RegisterFormData } from "../model/auth.schema";
import { useRegister } from "../model/useRegister";

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
		register(
			{ email: data.email, password: data.password, name: data.name },
			{ onSuccess },
		);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
			<div className="flex flex-col gap-1">
				<label htmlFor="name" className="text-sm font-medium text-gray-700">
					Nom du commerce
				</label>
				<input
					id="name"
					type="text"
					{...registerField("name")}
					className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
				{errors.name && (
					<p className="text-sm text-red-600">{errors.name.message}</p>
				)}
			</div>

			<div className="flex flex-col gap-1">
				<label htmlFor="email" className="text-sm font-medium text-gray-700">
					Email
				</label>
				<input
					id="email"
					type="email"
					{...registerField("email")}
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
					{...registerField("password")}
					className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
				{errors.password && (
					<p className="text-sm text-red-600">{errors.password.message}</p>
				)}
			</div>

			<div className="flex flex-col gap-1">
				<label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
					Confirmer le mot de passe
				</label>
				<input
					id="confirmPassword"
					type="password"
					{...registerField("confirmPassword")}
					className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
				{errors.confirmPassword && (
					<p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
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
				{isPending ? "Création en cours..." : "Créer mon compte"}
			</button>

			<p className="text-center text-sm text-gray-600">
				Déjà un compte ?{" "}
				<button
					type="button"
					onClick={onSwitchToLogin}
					className="font-medium text-blue-600 hover:underline"
				>
					Se connecter
				</button>
			</p>
		</form>
	);
}
