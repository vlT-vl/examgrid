// jsonparse-browser.js
// Versione compatibile solo browser (senza fs, path, url)

// ✅ Funzione per derivare la chiave AES da password + salt
async function deriveKey(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  const saltBuffer = encoder.encode(salt);
  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-CBC", length: 256 },
    true,
    ["decrypt"]
  );
}

// ✅ Base64 → Uint8Array
function base64ToUint8Array(base64) {
  try {
    const raw = atob(base64);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
      bytes[i] = raw.charCodeAt(i);
    }
    return bytes;
  } catch {
    return new Uint8Array([]);
  }
}

// ✅ Decrittazione JSON AES
async function decryptJSON(encryptedJSON, password) {
  try {
    const key = await deriveKey(password, "static_salt");
    const iv = base64ToUint8Array(encryptedJSON.iv);
    const encryptedData = base64ToUint8Array(encryptedJSON.data);
    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv },
      key,
      encryptedData
    );
    return JSON.parse(new TextDecoder().decode(decryptedData));
  } catch (error) {
    console.error("❌ Errore AES:", error);
    throw new Error("❌ Decrittazione fallita. Password errata o file danneggiato.");
  }
}

// ✅ Funzione principale
export default async function jsonparse(filePath, password) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`❌ Errore fetch JSON: ${filePath}`);
    }
    let jsonData = await response.json();

    if (jsonData.iv && jsonData.data) {
      jsonData = await decryptJSON(jsonData, password);
    }

    return jsonData;
  } catch (error) {
    console.error("❌ Errore jsonparse:", error);
    throw new Error("❌ Impossibile caricare o decrittare il JSON.");
  }
}
