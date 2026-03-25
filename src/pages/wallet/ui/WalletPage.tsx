import { useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useCustomerById } from '@/entities/customer';
import { useStampsByCustomer } from '@/entities/stamp';
import { usePrograms } from '@/entities/program';
import { LoyaltyCard } from '@/shared/ui/LoyaltyCard';

function detectPlatform(): 'ios' | 'android' | 'other' {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

export function WalletPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const { data: customer, isLoading, isError } = useCustomerById(customerId ?? '');
  const { data: stamps = [] } = useStampsByCustomer(customerId ?? '');
  const { data: programs = [] } = usePrograms(customer?.merchant_id ?? '');

  const walletUrl = `${window.location.origin}/wallet/${customerId}`;
  const passUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pass?customerId=${customerId}&walletUrl=${encodeURIComponent(walletUrl)}`;
  const platform = detectPlatform();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange border-t-transparent" />
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-cream px-4 text-center">
        <svg className="h-12 w-12 text-brown/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <h1 className="text-xl font-semibold text-brown">Carte introuvable</h1>
        <p className="text-brown/60">Ce lien n'est pas valide ou a expiré.</p>
      </div>
    );
  }

  const primaryProgram = programs[0];
  const activeStampsCount = primaryProgram
    ? stamps.filter((s) => s.program_id === primaryProgram.id && !s.redeemed).length
    : stamps.filter((s) => !s.redeemed).length;
  const stampsRequired = primaryProgram?.stamps_required ?? 10;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-sm">

        <div className="mb-8">
          <LoyaltyCard
            name={customer.name}
            email={customer.email}
            createdAt={customer.created_at}
            stampsRequired={stampsRequired}
            activeStampsCount={activeStampsCount}
            programName={primaryProgram?.name}
          />
        </div>

        {platform === 'ios' && (
          <a
            href={passUrl}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-black px-5 py-4 font-medium text-white shadow-sm transition-transform active:scale-95"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Ajouter à Apple Wallet
          </a>
        )}

        {platform === 'android' && (
          <a
            href={passUrl}
            download
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-4 font-medium text-brown shadow-sm ring-2 ring-brown/10 transition-transform active:scale-95"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Télécharger ma carte (.pkpass)
          </a>
        )}

        {platform === 'other' && (
          <div className="flex flex-col gap-3">
            <a
              href={passUrl}
              download
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-4 font-medium text-brown shadow-sm ring-2 ring-brown/10 transition-transform active:scale-95"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Télécharger le .pkpass
            </a>
            <p className="text-center text-xs text-brown/40">
              Double-cliquez sur le fichier pour le prévisualiser (Mac) ou ouvrez-le sur iPhone.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-xs font-medium uppercase tracking-wider text-brown/40">
            Votre code fidélité
          </p>
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-brown/10">
            <QRCodeSVG
              value={walletUrl}
              size={180}
              fgColor="#3b2a1a"
              bgColor="#ffffff"
              level="M"
            />
          </div>
          <p className="text-center text-xs text-brown/40">
            Présentez ce QR code à votre commerçant pour cumuler vos tampons
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-brown/40">
          Gardez cette carte dans votre wallet mobile. Elle sera mise à jour automatiquement après chaque visite.
        </p>
      </div>
    </div>
  );
}
