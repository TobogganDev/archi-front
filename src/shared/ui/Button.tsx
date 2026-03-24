import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger" | "ghost";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
	primary:
		"bg-orange text-white hover:bg-orange-dark active:bg-orange-dark",
	secondary:
		"bg-brown text-cream hover:bg-brown-light active:bg-brown-light",
	danger:
		"bg-error text-white hover:opacity-90 active:opacity-80",
	ghost:
		"bg-transparent text-brown hover:bg-cream-dark active:bg-cream-dark",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
	sm: "px-3 py-1.5 text-sm",
	md: "px-4 py-2 text-base",
	lg: "px-6 py-3 text-lg",
};

export function Button({
	variant = "primary",
	size = "md",
	isLoading = false,
	disabled,
	className = "",
	children,
	...props
}: ButtonProps) {
	const baseStyles =
		"inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

	return (
		<button
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			disabled={disabled ?? isLoading}
			{...props}
		>
			{isLoading ? (
				<>
					<svg
						className="mr-2 h-4 w-4 animate-spin"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
					Chargement...
				</>
			) : (
				children
			)}
		</button>
	);
}
