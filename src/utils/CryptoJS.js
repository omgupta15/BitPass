import CryptoJS from "crypto-js";

class CustomCryptoJS {
  static generateSHA512 = (text) => {
    return CryptoJS.SHA512(text).toString();
  };

  // verificationHash to verify if the data has been successfully decrypted
  static generateVerificationHash = (data, passwordHash) => {
    return this.generateSHA512(`${data}:${passwordHash}`);
  };

  static encrypt = (data, passwordHash) => {
    try {
      // creating random initialization vector
      const iv = CryptoJS.lib.WordArray.random(16);

      // using the hashed password to encrypt the data string
      const encrypted = CryptoJS.AES.encrypt(
        data,
        CryptoJS.enc.Utf8.parse(passwordHash),
        { iv }
      );

      // converting cipher text to string for storage
      const encryptedText = iv
        .concat(encrypted.ciphertext)
        .toString(CryptoJS.enc.Base64);

      return {
        success: true,
        encryptedText,
        verificationHash: this.generateVerificationHash(data, passwordHash),
      };
    } catch (e) {
      // in case the encryption fails
      return { success: false };
    }
  };

  static decrypt = (encryptedText, passwordHash, verificationHash) => {
    try {
      // converting string to cipher text
      const ciphertext = CryptoJS.enc.Base64.parse(encryptedText);

      // copying the cipher text and selecting first 16 bytes as initialization vector
      const iv = ciphertext.clone();
      iv.sigBytes = 16;
      iv.clamp();

      // removing the initialization vector from cipher text
      ciphertext.words.splice(0, 4);
      ciphertext.sigBytes -= 16;

      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext },
        CryptoJS.enc.Utf8.parse(passwordHash),
        { iv }
      );
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      // generating verification hash for decrypted data
      const newVerificationHash = this.generateVerificationHash(
        decryptedText,
        passwordHash
      );

      // comparing the verification hash for old and new data
      // to verify if the data has been successfully decrypted
      if (verificationHash !== newVerificationHash) {
        return { success: false, error: "decryption-failed" };
      }

      return { success: true, data: decryptedText };
    } catch (e) {
      return { success: false, error: "decryption-failed" };
    }
  };
}

export default CustomCryptoJS;
