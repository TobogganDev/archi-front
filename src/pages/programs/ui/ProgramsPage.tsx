import { useState } from 'react';
import { useAuthContext } from '@/app/providers/auth-context';
import { usePrograms, deleteProgram } from '@/entities/program';
import type { Program } from '@/entities/program';
import { CreateProgramModal } from '@/features/create-program';
import { Button } from '@/shared/ui/Button';
import { useQueryClient } from '@tanstack/react-query';

export function ProgramsPage() {
  const { user } = useAuthContext();
  const merchantId = user?.id ?? '';
  const { data: programs, isLoading } = usePrograms(merchantId);
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (program: Program) => {
    if (!confirm(`Supprimer le programme "${program.name}" ?`)) return;
    setDeletingId(program.id);
    try {
      await deleteProgram(program.id);
      void queryClient.invalidateQueries({ queryKey: ['programs', merchantId] });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brown">Programmes de fidélité</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Créer un programme
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-brown/10" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs?.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              isDeleting={deletingId === program.id}
              onDelete={handleDelete}
            />
          ))}

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-48 items-center justify-center rounded-xl border-2 border-dashed border-brown/20 bg-white text-brown/60 transition-colors hover:border-orange hover:text-orange"
          >
            <div className="text-center">
              <svg className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <p className="mt-2 text-sm font-medium">Nouveau programme</p>
            </div>
          </button>
        </div>
      )}

      {programs?.length === 0 && !isLoading && (
        <p className="mt-8 text-center text-brown/50">
          Aucun programme de fidélité pour le moment.
        </p>
      )}

      {isModalOpen && (
        <CreateProgramModal
          merchantId={merchantId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}


interface ProgramCardProps {
  program: Program;
  isDeleting: boolean;
  onDelete: (program: Program) => void;
}

function ProgramCard({ program, isDeleting, onDelete }: ProgramCardProps) {
  const filled = Math.min(program.stamps_required, 10);

  return (
    <div className="flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-brown/10 overflow-hidden">
      {/* Carte visuelle */}
      <div
        className="flex items-center justify-between px-5 py-4 text-white"
        style={{ backgroundColor: program.color }}
      >
        <div>
          <p className="font-semibold leading-tight">{program.name}</p>
          <p className="mt-0.5 text-sm opacity-80">{program.reward}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex flex-wrap justify-end gap-1">
            {Array.from({ length: filled }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-4 rounded-full border border-white/60 bg-white/25"
              />
            ))}
            {program.stamps_required > 10 && (
              <span className="text-xs opacity-70">+{program.stamps_required - 10}</span>
            )}
          </div>
          <p className="text-xs opacity-70">{program.stamps_required} tampons</p>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-xs text-brown/40">
          {new Date(program.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <Button
          variant="danger"
          size="sm"
          isLoading={isDeleting}
          onClick={() => onDelete(program)}
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
}
