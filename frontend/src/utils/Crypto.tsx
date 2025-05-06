import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key";

// Fungsi untuk enkripsi string atau array
export function encrypt(data: string | any[]): string {
  const text = typeof data === "string" ? data : JSON.stringify(data);
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

// Fungsi untuk dekripsi ke string atau array
export function decrypt<T = any>(cipherText: string): T {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedText);
}
