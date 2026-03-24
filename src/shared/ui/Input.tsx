import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, id, ...props }, ref) => {
		return (
			<div>
				{label ? <label htmlFor={id}>{label}</label> : null}
				<input ref={ref} id={id} {...props} />
				{error ? <p>{error}</p> : null}
			</div>
		);
	},
);

Input.displayName = "Input";
