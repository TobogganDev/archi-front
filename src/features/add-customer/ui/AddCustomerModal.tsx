import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QRCodeSVG } from 'qrcode.react';
import { addCustomerSchema } from '../model/customer.schema';
import type { AddCustomerFormData } from '../model/customer.schema';
import { useCreateCustomer } from '../model/useCreateCustomer';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import type { Customer } from '@/entities/customer';

interface AddCustomerModalProps {
  merchantId: string;
  onClose: () => void;
}

export function AddCustomerModal({ merchantId, onClose }: AddCustomerModalProps) {
  const [createdCustomer, setCreatedCustomer] = useState<Customer | null>(null);
  const { createCustomerAsync, isPending, error } = useCreateCustomer();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCustomerFormData>({
    resolver: zodResolver(addCustomerSchema),
  });

  const onSubmit = async (data: AddCustomerFormData) => {
    const customer = await createCustomerAsync({
      merchant_id: merchantId,
      name: data.name,
      email: data.email ?? null,
    });
    setCreatedCustomer(customer);
  };

  const walletUrl = createdCustomer
    ? `${window.location.origin}/wallet/${createdCustomer.id}`
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brown/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-brown">
            {createdCustomer ? 'Client ajouté !' : 'Ajouter un client'}
          </h2>
          <button
            onClick={onClose}
            className="text-brown/40 transition-colors hover:text-brown"
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {!createdCustomer ? (
            /* Step 1 — Form */
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <Input
                label="Nom *"
                placeholder="Marie Dupont"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Email (optionnel)"
                type="email"
                placeholder="marie@exemple.fr"
                error={errors.email?.message}
                {...register('email')}
              />

              {error && (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error.message}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="ghost" type="button" onClick={onClose} className="flex-1">
                  Annuler
                </Button>
                <Button type="submit" isLoading={isPending} className="flex-1">
                  Ajouter
                </Button>
              </div>
            </form>
          ) : (
            /* Step 2 — QR Code */
            <div className="flex flex-col items-center gap-5">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="font-medium text-brown">{createdCustomer.name}</p>
                {createdCustomer.email && (
                  <p className="text-sm text-brown/60">{createdCustomer.email}</p>
                )}
              </div>

              <div className="rounded-xl border-2 border-brown/10 bg-cream p-4">
                <QRCodeSVG
                  value={walletUrl}
                  size={200}
                  bgColor="transparent"
                  fgColor="#3b2a1a"
                  level="M"
                />
              </div>

              <div className="rounded-lg bg-orange/10 px-4 py-3 text-center text-sm text-brown">
                <p className="font-medium">Le client scanne ce QR code</p>
                <p className="mt-0.5 text-brown/60">
                  Il sera redirigé vers une page pour ajouter sa carte de fidélité à son wallet mobile.
                </p>
              </div>

              <div className="w-full border-t border-brown/10 pt-4">
                <p className="mb-2 text-xs font-medium text-brown/40 uppercase tracking-wide">
                  Lien direct
                </p>
                <p className="break-all rounded-md bg-cream px-3 py-2 text-xs text-brown/60 font-mono">
                  {walletUrl}
                </p>
              </div>

              <Button onClick={onClose} className="w-full">
                Terminé
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
