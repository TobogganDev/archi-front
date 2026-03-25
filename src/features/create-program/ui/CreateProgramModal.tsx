import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProgramSchema } from '../model/program.schema';
import type { CreateProgramFormData } from '../model/program.schema';
import { useCreateProgram } from '../model/useCreateProgram';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

interface CreateProgramModalProps {
  merchantId: string;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#E87C3E',
  '#3b2a1a',
  '#22c55e',
  '#3b82f6',
  '#a855f7',
  '#ef4444',
  '#f59e0b',
  '#14b8a6',
];

export function CreateProgramModal({ merchantId, onClose }: CreateProgramModalProps) {
  const { createProgramAsync, isPending, error } = useCreateProgram();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateProgramFormData>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      color: PRESET_COLORS[0],
      stamps_required: 10,
    },
  });

  const selectedColor = watch('color');

  const onSubmit = async (data: CreateProgramFormData) => {
    await createProgramAsync({
      merchant_id: merchantId,
      name: data.name,
      stamps_required: data.stamps_required,
      reward: data.reward,
      color: data.color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-brown/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-brown">Créer un programme</h2>
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

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
          <Input
            label="Nom du programme *"
            placeholder="Café offert"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Récompense *"
            placeholder="1 café offert"
            error={errors.reward?.message}
            {...register('reward')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-brown">Nombre de tampons requis *</label>
            <input
              type="number"
              min={1}
              className={`w-full rounded-md border bg-white px-3 py-2 text-brown placeholder:text-brown/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-1 ${
                errors.stamps_required ? 'border-red-400' : 'border-brown/20 hover:border-brown/40'
              }`}
              {...register('stamps_required', { valueAsNumber: true })}
            />
            {errors.stamps_required && (
              <p className="text-sm text-red-500">{errors.stamps_required.message}</p>
            )}
          </div>

          {/* Color picker */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-brown">Couleur de la carte *</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('color', color)}
                  className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? '#3b2a1a' : 'transparent',
                  }}
                  aria-label={`Couleur ${color}`}
                />
              ))}
            </div>
            {errors.color && (
              <p className="text-sm text-red-500">{errors.color.message}</p>
            )}
          </div>

          <div
            className="flex items-center justify-between rounded-xl px-5 py-4 text-white shadow-md"
            style={{ backgroundColor: selectedColor }}
          >
            <div>
              <p className="font-semibold">{watch('name') || 'Nom du programme'}</p>
              <p className="mt-0.5 text-sm opacity-80">{watch('reward') || 'Récompense'}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex gap-1">
                {Array.from({ length: Math.min(watch('stamps_required') || 10, 10) }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded-full border border-white/60 bg-white/20"
                  />
                ))}
              </div>
              <p className="mt-1 text-xs opacity-70">{watch('stamps_required') || 10} tampons</p>
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error.message}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" isLoading={isPending} className="flex-1">
              Créer le programme
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
