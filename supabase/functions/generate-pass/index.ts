// Supabase Edge Function — generate-pass
// Generates and returns a signed Apple Wallet .pkpass file for a given customer.
//
// PRODUCTION — requires 5 Supabase secrets (see APPLE_WALLET_SETUP.md):
//   APPLE_PASS_TYPE_IDENTIFIER  APPLE_TEAM_IDENTIFIER
//   APPLE_CERT_PEM              APPLE_KEY_PEM          APPLE_WWDR_PEM
//
// POC / TEST MODE (aucun compte Apple requis) — déployer tel quel.
//   Quand les secrets Apple ne sont pas définis, la fonction génère
//   automatiquement des certificats auto-signés de test.
//   → Le fichier .pkpass est téléchargeable et inspectable.
//   → Il NE s'installe PAS sur iPhone (signature non reconnue par Apple).
//   → Parfait pour valider le pipeline complet en POC.
//
// SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont injectés automatiquement.

import { createClient } from 'npm:@supabase/supabase-js@2';
import forge from 'npm:node-forge@1.3.1';
import { zipSync } from 'npm:fflate@0.8.2';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Customer {
  id: string;
  merchant_id: string;
  name: string;
  email: string | null;
  created_at: string;
}

interface Merchant {
  id: string;
  name: string;
  color: string;
}

interface CertBundle {
  certPem: string;
  keyPem: string;
  wwdrPem: string;
  passTypeIdentifier: string;
  teamIdentifier: string;
  testMode: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

/**
 * Minimal 29×29 px white PNG icon (base64).
 * Replace with a real branded icon for production.
 */
const PLACEHOLDER_ICON_B64 =
  'iVBORw0KGgoAAAANSUhEUgAAAB0AAAAdCAYAAABWk2cPAAAANklEQVR42mNk' +
  'YGBg+M9AAowqGlU0qmhU0aiiUUWjikYVjSoaVTSqaFTRqKJRRaOKRhWNKho1' +
  'lAEAFbsBOFa5X4EAAAAASUVORK5CYII=';

function b64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sha1Hex(data: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-1', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function bytesToBinStr(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return s;
}

function binStrToBytes(s: string): Uint8Array {
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return bytes;
}

// ---------------------------------------------------------------------------
// Test certificate generation (POC mode — no Apple account needed)
// ---------------------------------------------------------------------------

/**
 * Generates a pair of ephemeral self-signed certificates.
 * 512-bit RSA — intentionally weak, fast, test-only.
 * The resulting .pkpass will NOT be accepted by Apple Wallet.
 */
function generateTestCertBundle(): Omit<CertBundle, 'passTypeIdentifier' | 'teamIdentifier' | 'testMode'> {
  function makeKeyAndCert(cn: string) {
    const keys = forge.pki.rsa.generateKeyPair(512);
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = Math.floor(Math.random() * 1e9).toString();
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const attrs = [{ name: 'commonName', value: cn }];
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.sign(keys.privateKey, forge.md.sha256.create());
    return { cert, privateKey: keys.privateKey };
  }

  const signer = makeKeyAndCert('pass.test.loyaltycard');
  const wwdr   = makeKeyAndCert('Apple WWDR Test CA (POC)');

  return {
    certPem: forge.pki.certificateToPem(signer.cert),
    keyPem:  forge.pki.privateKeyToPem(signer.privateKey),
    wwdrPem: forge.pki.certificateToPem(wwdr.cert),
  };
}

/** Returns the certificate bundle — either from Supabase secrets or auto-generated for POC. */
function resolveCertBundle(): CertBundle {
  const certPem = Deno.env.get('APPLE_CERT_PEM');
  const keyPem  = Deno.env.get('APPLE_KEY_PEM');
  const wwdrPem = Deno.env.get('APPLE_WWDR_PEM');

  if (certPem && keyPem && wwdrPem) {
    return {
      certPem,
      keyPem,
      wwdrPem,
      passTypeIdentifier: Deno.env.get('APPLE_PASS_TYPE_IDENTIFIER') ?? 'pass.test.loyaltycard',
      teamIdentifier:     Deno.env.get('APPLE_TEAM_IDENTIFIER')      ?? 'TESTTEAM01',
      testMode: false,
    };
  }

  console.warn('[generate-pass] Apple certs not configured — using auto-generated test certs (POC mode)');
  return {
    ...generateTestCertBundle(),
    passTypeIdentifier: 'pass.test.loyaltycard',
    teamIdentifier:     'TESTTEAM01',
    testMode: true,
  };
}

// ---------------------------------------------------------------------------
// PKCS#7 signature
// ---------------------------------------------------------------------------

function createPkcs7Signature(
  manifestBytes: Uint8Array,
  certPem: string,
  keyPem: string,
  wwdrPem: string,
): Uint8Array {
  const signerCert  = forge.pki.certificateFromPem(certPem);
  const privateKey  = forge.pki.privateKeyFromPem(keyPem);
  const wwdrCert    = forge.pki.certificateFromPem(wwdrPem);

  const p7 = forge.pkcs7.createSignedData();
  p7.content = forge.util.createBuffer(bytesToBinStr(manifestBytes));
  p7.addCertificate(wwdrCert);
  p7.addCertificate(signerCert);
  p7.addSigner({
    key: privateKey,
    certificate: signerCert,
    digestAlgorithm: forge.pki.oids.sha1,
    authenticatedAttributes: [
      { type: forge.pki.oids.contentType, value: forge.pki.oids.data },
      { type: forge.pki.oids.messageDigest },
      { type: forge.pki.oids.signingTime, value: new Date() },
    ],
  });
  p7.sign({ detached: true });

  return binStrToBytes(forge.asn1.toDer(p7.toAsn1()).getBytes());
}

// ---------------------------------------------------------------------------
// pass.json builder
// ---------------------------------------------------------------------------

function buildPassJson(
  customer: Customer,
  merchant: Merchant,
  stampCount: number,
  bundle: CertBundle,
): string {
  const memberSince = new Date(customer.created_at).toLocaleDateString('fr-FR', {
    month: 'long', year: 'numeric',
  });

  const descriptionSuffix = bundle.testMode ? ' [TEST]' : '';

  return JSON.stringify({
    formatVersion: 1,
    passTypeIdentifier: bundle.passTypeIdentifier,
    serialNumber:       customer.id,
    teamIdentifier:     bundle.teamIdentifier,
    organizationName:   merchant.name,
    description:        `Carte de fidélité — ${merchant.name}${descriptionSuffix}`,

    foregroundColor: 'rgb(255, 255, 255)',
    backgroundColor: 'rgb(59, 42, 26)',
    labelColor:      'rgb(230, 186, 100)',
    logoText:        merchant.name,

    storeCard: {
      headerFields: [
        {
          key: 'stamps',
          label: 'TAMPONS',
          value: String(stampCount),
          changeMessage: 'Vous avez maintenant %@ tampons !',
        },
      ],
      primaryFields: [
        { key: 'member', label: 'CLIENT FIDÈLE', value: customer.name },
      ],
      secondaryFields: customer.email
        ? [{ key: 'email', label: 'EMAIL', value: customer.email }]
        : [],
      backFields: [
        {
          key: 'info',
          label: 'Comment ça marche',
          value: 'Présentez cette carte à votre commerçant à chaque visite. Il ajoutera un tampon. Une fois votre carte complète, profitez de votre récompense !',
        },
        {
          key: 'since',
          label: 'Membre depuis',
          value: memberSince,
        },
        ...(bundle.testMode ? [{
          key: 'test_notice',
          label: 'Mode test',
          value: 'Cette carte utilise des certificats de test. Elle ne peut pas être ajoutée à Apple Wallet. Configurez vos certificats Apple Developer pour la production.',
        }] : []),
      ],
    },
  }, null, 2);
}

// ---------------------------------------------------------------------------
// Main pkpass builder
// ---------------------------------------------------------------------------

async function buildPkPass(
  customer: Customer,
  merchant: Merchant,
  stampCount: number,
): Promise<{ bytes: Uint8Array; testMode: boolean }> {
  const bundle = resolveCertBundle();

  const iconBytes    = b64ToBytes(PLACEHOLDER_ICON_B64);
  const passJsonBytes = new TextEncoder().encode(
    buildPassJson(customer, merchant, stampCount, bundle),
  );

  // Manifest: SHA-1 of every file except manifest.json and signature
  const fileEntries: Record<string, Uint8Array> = {
    'pass.json':  passJsonBytes,
    'icon.png':   iconBytes,
    'icon@2x.png': iconBytes,
  };

  const manifest: Record<string, string> = {};
  for (const [name, data] of Object.entries(fileEntries)) {
    manifest[name] = await sha1Hex(data);
  }
  const manifestBytes = new TextEncoder().encode(JSON.stringify(manifest));

  // PKCS#7 detached signature of manifest.json
  const signatureBytes = createPkcs7Signature(
    manifestBytes,
    bundle.certPem,
    bundle.keyPem,
    bundle.wwdrPem,
  );

  // ZIP — level 0 (STORED) required by Apple
  const stored = (b: Uint8Array): [Uint8Array, { level: 0 }] => [b, { level: 0 }];

  const bytes = zipSync(
    {
      'pass.json':    stored(passJsonBytes),
      'manifest.json': stored(manifestBytes),
      signature:       stored(signatureBytes),
      'icon.png':      stored(iconBytes),
      'icon@2x.png':   stored(iconBytes),
    },
    { level: 0 },
  );

  return { bytes, testMode: bundle.testMode };
}

// ---------------------------------------------------------------------------
// Request handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get('customerId');

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: 'Paramètre customerId manquant.' }),
        { status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data: customer, error: customerErr } = await supabase
      .from('customers')
      .select('id, merchant_id, name, email, created_at')
      .eq('id', customerId)
      .single<Customer>();

    if (customerErr || !customer) {
      return new Response(
        JSON.stringify({ error: 'Client introuvable.' }),
        { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    const { data: merchant, error: merchantErr } = await supabase
      .from('merchants')
      .select('id, name, color')
      .eq('id', customer.merchant_id)
      .single<Merchant>();

    if (merchantErr || !merchant) {
      return new Response(
        JSON.stringify({ error: 'Commerçant introuvable.' }),
        { status: 404, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
      );
    }

    const { count } = await supabase
      .from('stamps')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', customerId)
      .eq('redeemed', false);

    const { bytes, testMode } = await buildPkPass(customer, merchant, count ?? 0);

    // Deno's Response accepts Uint8Array, but the DOM BodyInit type doesn't include it.
    // Casting via ArrayBuffer is the typed-safe workaround.
    return new Response(bytes.buffer as ArrayBuffer, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type':        'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${merchant.name.replace(/\s+/g, '-')}-fidelite.pkpass"`,
        'Content-Length':      String(bytes.byteLength),
        'X-Pass-Mode':         testMode ? 'test' : 'production',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur interne.';
    console.error('[generate-pass]', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    );
  }
});
