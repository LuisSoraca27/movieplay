import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_KEY_SECRET
console.log(ENCRYPTION_KEY);

export default function decrypt(encryptedText) {
    const parts = encryptedText.split(':');
    const iv = CryptoJS.enc.Hex.parse(parts.shift());
    const encrypted = CryptoJS.enc.Hex.parse(parts.join(':'));
    const key = CryptoJS.enc.Hex.parse(ENCRYPTION_KEY);

    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encrypted },
        key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
}
