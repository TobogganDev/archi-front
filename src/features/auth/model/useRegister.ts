import { useMutation } from "@tanstack/react-query";
import { registerWithEmail } from "../api/auth.api";

export function useRegister() {
	const { mutate, isPending, error } = useMutation({
		mutationKey: ["auth", "register"],
		mutationFn: (data: { email: string; password: string; name: string }) =>
			registerWithEmail(data.email, data.password, data.name),
	});

	return { register: mutate, isPending, error };
}
