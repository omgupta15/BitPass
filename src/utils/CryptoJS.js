import CryptoJS from "crypto-js";

class CustomCryptoJS {
  static generateSHA512 = (text) => {
    return CryptoJS.SHA512(text).toString();
  };

  static generateVerificationHash = (data, passwordHash) => {
    return this.generateSHA512(`${data}:${passwordHash}`);
  };

  static encrypt = (data, passwordHash) => {
    try {
      const iv = CryptoJS.lib.WordArray.random(16);
      const encrypted = CryptoJS.AES.encrypt(
        data,
        CryptoJS.enc.Utf8.parse(passwordHash),
        { iv }
      );
      const encryptedText = iv
        .concat(encrypted.ciphertext)
        .toString(CryptoJS.enc.Base64);
      return {
        success: true,
        encryptedText,
        verificationHash: this.generateVerificationHash(data, passwordHash),
      };
    } catch (e) {
      return { success: false };
    }
  };

  static decrypt = (encryptedText, passwordHash, verificationHash) => {
    try {
      const ciphertext = CryptoJS.enc.Base64.parse(encryptedText);
      const iv = ciphertext.clone();
      iv.sigBytes = 16;
      iv.clamp();
      ciphertext.words.splice(0, 4);
      ciphertext.sigBytes -= 16;

      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext },
        CryptoJS.enc.Utf8.parse(passwordHash),
        { iv }
      );
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      const newVerificationHash = this.generateVerificationHash(
        decryptedText,
        passwordHash
      );

      if (verificationHash !== newVerificationHash) {
        return { success: false, error: "decryption-failed" };
      }

      return { success: true, data: decryptedText };
    } catch (e) {
      // console.log("Error while decrypting:", e);
      return { success: false, error: "decryption-failed" };
    }
  };
}

export default CustomCryptoJS;
