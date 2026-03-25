import { supabase } from "@/shared/api";

export async function changePassword(newPassword: string): Promise<void> {
	const { error } = await supabase.auth.updateUser({
		password: newPassword,
	});
	if (error) throw new Error(error.message);
}
