import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary" | "danger" | "ghost";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
}

export function Button({
	variant: _variant,
	size: _size,
	isLoading = false,
	disabled,
	children,
	...props
}: ButtonProps) {
	return (
		<button disabled={disabled ?? isLoading} {...props}>
			{children}
		</button>
	);
}
