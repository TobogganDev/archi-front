import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMerchant } from "@/entities/merchant";
import type { MerchantUpdate } from "@/entities/merchant";

export function useUpdateProfile(merchantId: string) {
	const queryClient = useQueryClient();

	const { mutate, isPending, error, isSuccess } = useMutation({
		mutationKey: ["merchant", "update", merchantId],
		mutationFn: (data: MerchantUpdate) => updateMerchant(merchantId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["merchant", merchantId] });
		},
	});

	return { updateProfile: mutate, isPending, error, isSuccess };
}
