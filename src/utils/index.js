import lStorage from "local-storage-json";
import CryptoJS from "./CryptoJS";

export const generateHash = (password) => CryptoJS.generateSHA512(password);

export const getUser = (username) => {
  try {
    let database = lStorage.get("database");

    if (!Array.isArray(database)) {
      lStorage.set("database", []);
      database = [];
    }

    if (database.length <= 0) {
      return { success: false, error: "not-found" };
    }

    for (let index = 0; index < database.length; index++) {
      const user = database[index];
      if (
        user.username &&
        typeof user.username === "string" &&
        user.username === username
      ) {
        return { success: true, index, user };
      }
    }

    return { success: false, error: "not-found" };
  } catch (e) {
    console.log("Error while getting user:", e);
    return { success: false, error: "unknown-error" };
  }
};

export const getData = (username, passwordHash) => {
  const response = getDecryptedData(username, passwordHash);

  if (!response.success) {
    return response;
  }

  const decryptedData = response.data;
  let data;

  try {
    data = JSON.parse(decryptedData);
  } catch (e) {
    return { success: false };
  }

  return { success: true, data };
};

export const getDecryptedData = (username, passwordHash) => {
  const userResponse = getUser(username);

  if (!userResponse.success) {
    return userResponse;
  }

  const { data: encryptedData, verificationHash } = userResponse.user;

  const decryptionResponse = CryptoJS.decrypt(
    encryptedData,
    passwordHash,
    verificationHash
  );

  return decryptionResponse;
};

export const updateUser = (username, passwordHash, dataToUpdate) => {
  try {
    const userResponse = getUser(username);

    let database = lStorage.get("database");

    const { encryptedText, verificationHash } = CryptoJS.encrypt(
      JSON.stringify(dataToUpdate),
      passwordHash
    );
    const userData = {
      username,
      data: encryptedText,
      verificationHash,
    };

    if (!userResponse.success) {
      database.push(userData);
    } else {
      database[userResponse.index] = userData;
    }

    lStorage.set("database", database);
    return { success: true };
  } catch (e) {
    console.log("Error while updating user:", e);
    return { success: false, error: "unknown-error" };
  }
};
