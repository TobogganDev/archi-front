import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/auth.api";

export function useLogout() {
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationKey: ["auth", "logout"],
		mutationFn: logout,
		onSuccess: () => {
			queryClient.clear();
		},
	});

	return { logout: mutate, isPending };
}
