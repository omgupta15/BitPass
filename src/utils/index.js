import lStorage from "local-storage-json";
import CryptoJS from "./CryptoJS";

// to generate SHA512 hash of the password
export const generateHash = (password) => CryptoJS.generateSHA512(password);

// to get user data if it exists in the database
export const getUser = (username) => {
  try {
    let database = lStorage.get("database");

    // if database doesnt exist or has been tampered with
    if (!Array.isArray(database)) {
      database = [];
      lStorage.set("database", database);
    }

    // if no users exist in the database
    if (database.length <= 0) {
      return { success: false, error: "not-found" };
    }

    for (let index = 0; index < database.length; index++) {
      const user = database[index];
      // checking if the username matches
      if (
        user.username &&
        typeof user.username === "string" &&
        user.username === username
      ) {
        // if username matches, returning the index & encrypted user data
        return { success: true, index, user };
      }
    }

    // if the user wasn't found in the database
    return { success: false, error: "not-found" };
  } catch (e) {
    // in case there are some problems with the database
    return { success: false, error: "unknown-error" };
  }
};

// to find the user and decrypt the user data with the passwordHash and return in JSON format
export const getData = (username, passwordHash) => {
  // to get decrypted data as string
  const response = getDecryptedData(username, passwordHash);

  // if user wasn't found or password was incorrect
  if (!response.success) {
    return response;
  }

  const decryptedData = response.data;
  let data;

  try {
    // parsing the string data into a JSON object
    data = JSON.parse(decryptedData);
  } catch (e) {
    // if the data has been tampered with
    return { success: false };
  }

  return { success: true, data };
};

// to find the user and decrypt the user data with the passwordHash and return in string format
export const getDecryptedData = (username, passwordHash) => {
  // to get user data if username exists in the database
  const userResponse = getUser(username);

  // if user wasn't found
  if (!userResponse.success) {
    return userResponse;
  }

  // destructuring the response into encrypted data string & verification hash
  const { data: encryptedData, verificationHash } = userResponse.user;

  // decrypting the encrypted string and verifying it
  const decryptionResponse = CryptoJS.decrypt(
    encryptedData,
    passwordHash,
    verificationHash
  );

  return decryptionResponse;
};

// to decrypt the encrypted string data of backup file and verifying the hash
export const decryptBackupData = (
  encryptedData,
  verificationHash,
  password
) => {
  // generating SHA512 hash of the password entered by the user
  const passwordHash = generateHash(password);

  // decrypting data and verifying hash
  const decryptionResponse = CryptoJS.decrypt(
    encryptedData,
    passwordHash,
    verificationHash
  );

  // invalid password or data
  if (!decryptionResponse.success) {
    return decryptionResponse;
  }

  try {
    // parsing the string as JSON
    decryptionResponse.data = JSON.parse(decryptionResponse.data);
  } catch (e) {
    return { success: false, error: "invalid-json" };
  }

  // to check if data is in a valid format
  if (
    !Array.isArray(decryptionResponse.data.passwords) ||
    !Array.isArray(decryptionResponse.data.notes)
  ) {
    return { success: false, error: "invalid-json" };
  }

  return decryptionResponse;
};

// to update the user in the database
export const updateUser = (username, passwordHash, dataToUpdate) => {
  try {
    // finding and getting the encrypted user data
    const userResponse = getUser(username);

    let database = lStorage.get("database");

    // encrypting the data and generating the verification hash
    const { encryptedText, verificationHash } = CryptoJS.encrypt(
      JSON.stringify(dataToUpdate),
      passwordHash
    );
    // creating user data object
    const userData = {
      username,
      data: encryptedText,
      verificationHash,
    };

    if (!userResponse.success) {
      // adding the user if it doesn't exist
      database.push(userData);
    } else {
      // updating the index of user in array if user exists
      database[userResponse.index] = userData;
    }

    // saving the database
    lStorage.set("database", database);
    return { success: true };
  } catch (e) {
    // in case of error while handling the database
    return { success: false, error: "unknown-error" };
  }
};

// to delete the user from the database
export const deleteUser = (username) => {
  try {
    let database = lStorage.get("database");

    // if database doesnt exist or has been tampered with
    if (!Array.isArray(database)) {
      database = [];
      lStorage.set("database", database);
    }

    for (let index = 0; index < database.length; index++) {
      const user = database[index];
      // matching the username
      if (
        user.username &&
        typeof user.username === "string" &&
        user.username === username
      ) {
        // using the splice function to remove the user from the database array
        database.splice(index, 1);
        // saving the database
        lStorage.set("database", database);
        return { success: true };
      }
    }

    // in case the user wasn't found in the database array
    return { success: false, error: "not-found" };
  } catch (e) {
    // error while handling database
    return { success: false, error: "unknown-error" };
  }
};
