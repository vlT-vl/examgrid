const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const SIGNATURE_BYTES = 64;
const SIGNATURE_LENGTH = 103;
const MESSAGE_PREFIX = "examgrid-voucher-v1:";

const encoder = new TextEncoder();

const decodeBig = (text) => {
  let value = 0n;
  for (const ch of text.toUpperCase()) {
    const digit = ALPHABET.indexOf(ch);
    if (digit < 0) throw new Error("format");
    value = (value << 5n) | BigInt(digit);
  }
  return value;
};

const bigToBytes = (value, length) =>
  Uint8Array.from({ length }, (_, i) => Number((value >> BigInt(8 * (length - 1 - i))) & 255n));

const decodeSignature = (text) => {
  if (text.length !== SIGNATURE_LENGTH) throw new Error("format");
  const value = decodeBig(text);
  if (value >> BigInt(SIGNATURE_BYTES * 8)) throw new Error("format");
  return bigToBytes(value, SIGNATURE_BYTES);
};

const base64urlToBytes = (base64url) => {
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(base64url.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
};

const decoder = new TextDecoder();

export function createRequestCode(name, examId) {
  const nonce = crypto.randomUUID().slice(0, 8);
  const json = JSON.stringify({ name, nonce, examId });
  const bytes = encoder.encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function parseVoucherInput(text) {
  const parts = text.trim().split(".");
  return parts.length === 2 ? { payloadB64: parts[0], signatureB32: parts[1] } : null;
}

export async function verifyVoucher({ payloadB64, signatureB32, publicKey }) {
  let payload;
  try {
    payload = JSON.parse(decoder.decode(base64urlToBytes(payloadB64)));
  } catch {
    return { ok: false, reason: "format" };
  }

  let signatureBytes;
  try {
    signatureBytes = decodeSignature(signatureB32);
  } catch {
    return { ok: false, reason: "format" };
  }

  if (!publicKey) return { ok: false, reason: "unavailable" };

  let valid;
  try {
    const key = await crypto.subtle.importKey(
      "jwk",
      { kty: "OKP", crv: "Ed25519", x: publicKey },
      { name: "Ed25519" },
      false,
      ["verify"]
    );
    valid = await crypto.subtle.verify(
      { name: "Ed25519" },
      key,
      signatureBytes,
      encoder.encode(MESSAGE_PREFIX + payloadB64)
    );
  } catch (error) {
    return { ok: false, reason: error?.name === "NotSupportedError" ? "unsupported" : "invalid" };
  }

  if (!valid) return { ok: false, reason: "invalid" };
  if (!payload?.expiresAt || !payload?.key || !payload?.name || !payload?.examId) return { ok: false, reason: "format" };
  if (Date.now() >= Date.parse(payload.expiresAt)) return { ok: false, reason: "expired" };

  return { ok: true, examId: payload.examId, name: payload.name, expiresAt: payload.expiresAt, key: payload.key };
}
