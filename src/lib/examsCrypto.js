const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const SIGNATURE_BYTES = 64;
const SIGNATURE_LENGTH = 103;
const MESSAGE_PREFIX = "examgrid-exams-v1:";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const base64ToBytes = (base64) => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

const decodeBig = (text) => {
  let value = 0n;
  for (const ch of text.toUpperCase()) {
    const digit = ALPHABET.indexOf(ch);
    if (digit < 0) throw new Error("Firma malformata");
    value = (value << 5n) | BigInt(digit);
  }
  return value;
};

const bigToBytes = (value, length) =>
  Uint8Array.from({ length }, (_, i) => Number((value >> BigInt(8 * (length - 1 - i))) & 255n));

const decodeSignature = (text) => {
  if (text.length !== SIGNATURE_LENGTH) throw new Error("Firma malformata");
  const value = decodeBig(text);
  if (value >> BigInt(SIGNATURE_BYTES * 8)) throw new Error("Firma malformata");
  return bigToBytes(value, SIGNATURE_BYTES);
};

const signedMessage = (ivBytes, ciphertextBytes) => {
  const prefix = encoder.encode(MESSAGE_PREFIX);
  const out = new Uint8Array(prefix.length + ivBytes.length + ciphertextBytes.length);
  out.set(prefix, 0);
  out.set(ivBytes, prefix.length);
  out.set(ciphertextBytes, prefix.length + ivBytes.length);
  return out;
};

async function verifyEnvelope(envelope, publicKeyX) {
  const iv = base64ToBytes(envelope.iv);
  const ciphertext = base64ToBytes(envelope.ciphertext);
  const signature = decodeSignature(envelope.signature);
  const publicKey = await crypto.subtle.importKey(
    "jwk",
    { kty: "OKP", crv: "Ed25519", x: publicKeyX },
    { name: "Ed25519" },
    false,
    ["verify"]
  );
  return crypto.subtle.verify({ name: "Ed25519" }, publicKey, signature, signedMessage(iv, ciphertext));
}

async function decryptEnvelope(envelope, symmetricKeyBase64) {
  const key = await crypto.subtle.importKey(
    "raw",
    base64ToBytes(symmetricKeyBase64),
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );
  const iv = base64ToBytes(envelope.iv);
  const ciphertext = base64ToBytes(envelope.ciphertext);
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  return decoder.decode(plaintext);
}

export async function openEnvelope(envelope, { publicKeyX, symmetricKeyBase64 }) {
  const valid = await verifyEnvelope(envelope, publicKeyX);
  if (!valid) {
    throw new Error("Firma non valida: il file non proviene da examgrid.exams o è stato alterato.");
  }
  const plaintext = await decryptEnvelope(envelope, symmetricKeyBase64);
  return JSON.parse(plaintext);
}
