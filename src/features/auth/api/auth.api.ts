import { supabase } from "@/shared/api";

export async function loginWithEmail(
	email: string,
	password: string,
): Promise<void> {
	const { error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw new Error(error.message);
}

export async function registerWithEmail(
	email: string,
	password: string,
	name: string,
): Promise<void> {
	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: { data: { name } },
	});
	if (error) throw new Error(error.message);
}

export async function logout(): Promise<void> {
	const { error } = await supabase.auth.signOut();
	if (error) throw new Error(error.message);
}

export async function getCurrentUser() {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	return user;
}
