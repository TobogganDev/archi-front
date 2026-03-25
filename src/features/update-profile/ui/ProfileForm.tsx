import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../model/profile.schema";
import type { ProfileFormData } from "../model/profile.schema";
import { useUpdateProfile } from "../model/useUpdateProfile";
import { useMerchant } from "@/entities/merchant";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";

interface ProfileFormProps {
	merchantId: string;
}

export function ProfileForm({ merchantId }: ProfileFormProps) {
	const { data: merchant, isLoading: isMerchantLoading } = useMerchant(merchantId);
	const { updateProfile, isPending, error, isSuccess } = useUpdateProfile(merchantId);

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<ProfileFormData>({
		resolver: zodResolver(profileSchema),
	});

	const currentColor = useWatch({ control, name: "color" });

	useEffect(() => {
		if (merchant) {
			reset({ name: merchant.name, color: merchant.color });
		}
	}, [merchant, reset]);

	const onSubmit = (data: ProfileFormData) => {
		updateProfile(data);
	};

	if (isMerchantLoading) {
		return (
			<div className="flex items-center gap-2 text-brown/60">
				<div className="h-5 w-5 animate-spin rounded-full border-2 border-orange border-t-transparent" />
				Chargement...
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
			<Input id="name" label="Nom du commerce" {...register("name")} error={errors.name?.message} />

			<div className="flex flex-col gap-1.5">
				<label htmlFor="color" className="text-sm font-medium text-brown">
					Couleur de marque
				</label>
				<div className="flex items-center gap-3">
					<input id="color" type="color" {...register("color")} className="h-10 w-14 cursor-pointer rounded-md border border-brown/20" />
					<span className="text-sm text-brown/60">{currentColor}</span>
				</div>
				{errors.color ? <p className="text-sm text-error">{errors.color.message}</p> : null}
			</div>

			{error ? <p className="text-sm text-error">{error.message}</p> : null}

			{isSuccess ? <p className="text-sm text-success">Profil mis à jour avec succès</p> : null}

			<Button type="submit" isLoading={isPending} className="self-start">
				Enregistrer
			</Button>
		</form>
	);
}
