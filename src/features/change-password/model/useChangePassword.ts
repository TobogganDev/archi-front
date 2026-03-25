import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/password.api";

export function useChangePassword() {
	const { mutate, isPending, error, isSuccess } = useMutation({
		mutationKey: ["auth", "change-password"],
		mutationFn: (newPassword: string) => changePassword(newPassword),
	});

	return { changePassword: mutate, isPending, error, isSuccess };
}
