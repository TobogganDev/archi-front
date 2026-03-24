import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginWithEmail } from "../api/auth.api";

export function useLogin() {
	const queryClient = useQueryClient();

	const { mutate, isPending, error } = useMutation({
		mutationKey: ["auth", "login"],
		mutationFn: (data: { email: string; password: string }) =>
			loginWithEmail(data.email, data.password),
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
	});

	return { login: mutate, isPending, error };
}
