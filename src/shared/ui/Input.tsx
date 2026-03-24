import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, id, className = "", ...props }, ref) => {
		return (
			<div className="flex flex-col gap-1.5">
				{label ? (
					<label
						htmlFor={id}
						className="text-sm font-medium text-brown"
					>
						{label}
					</label>
				) : null}
				<input
					ref={ref}
					id={id}
					className={`w-full rounded-md border bg-white px-3 py-2 text-brown placeholder:text-brown/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${
						error
							? "border-error focus:ring-error"
							: "border-brown/20 hover:border-brown/40"
					} ${className}`}
					{...props}
				/>
				{error ? (
					<p className="text-sm text-error">{error}</p>
				) : null}
			</div>
		);
	},
);

Input.displayName = "Input";
