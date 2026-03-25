import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Props {
  onScan: (customerId: string) => void;
  onError?: (message: string) => void;
}

function parseCustomerId(raw: string): string | null {
  // Try to parse as a URL (e.g. https://example.com/wallet/uuid)
  try {
    const url = new URL(raw);
    const parts = url.pathname.split('/').filter(Boolean);
    const walletIndex = parts.indexOf('wallet');
    if (walletIndex !== -1 && parts[walletIndex + 1]) {
      return parts[walletIndex + 1];
    }
  } catch {
    // Not a valid URL, fall back to raw string
  }

  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(raw.trim())) {
    return raw.trim();
  }

  return null;
}

const SCANNER_ELEMENT_ID = 'qr-scanner-container';

export function CustomerScanner({ onScan, onError }: Props) {
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  useEffect(() => { onScanRef.current = onScan; }, [onScan]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1 },
        (decodedText) => {
          const customerId = parseCustomerId(decodedText);
          if (customerId) {
            scanner.stop().then(() => onScanRef.current(customerId)).catch(console.error);
          }
        },
        () => undefined,
      )
      .catch((err: Error) => {
        const msg =
          err.message.includes('Permission')
            ? "Accès à la caméra refusé. Autorisez la caméra dans les paramètres de votre navigateur."
            : `Impossible de démarrer la caméra : ${err.message}`;
        onErrorRef.current?.(msg);
      });

    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl bg-black">
      {/* html5-qrcode */}
      <div id={SCANNER_ELEMENT_ID} className="w-full [&_video]:[-webkit-transform:scaleX(-1)] [&_video]:transform-[scaleX(-1)]" />
    </div>
  );
}
