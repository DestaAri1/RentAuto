import CryptoJS from "crypto-js";

const SECRET_KEY = "your-secret-key";

// Fungsi untuk enkripsi string
export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

// Fungsi untuk dekripsi string terenkripsi
export function decrypt(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
