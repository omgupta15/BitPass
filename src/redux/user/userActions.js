import * as _ from "./userTypes";
import lStorage from "local-storage-json";
import CryptoJS from "../../utils/CryptoJS";

// const getUser = (username) => {
//   let data = lStorage.get("database");

//   if (!Array.isArray(data)) {
//     lStorage.set("database", []);
//     data = [];
//   }

//   if (!data) {
//     return { success: false, error: "not-found" };
//   }

//   for (let user of data) {
//     if (
//       user.username &&
//       typeof user.username === "string" &&
//       user.username === username
//     ) {
//       return { success: true, user };
//     }
//   }

//   return { success: false, error: "not-found" };
// };

const getUser = (username) => {
  let database = lStorage.get("database");

  if (!Array.isArray(database)) {
    lStorage.set("database", []);
    database = [];
  }

  if (!database) {
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
};

const updateUser = (username, passwordHash, dataToUpdate) => {
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
};

export const loginUser = (username, password) => {
  return (dispatch) => {
    const userResponse = getUser(username);

    if (!userResponse.success) {
      // return { success: false, error: "not-found" };
      dispatch(setError("not-found"));
      return;
    }

    const { encryptedData, verificationHash } = userResponse.user;
    const passwordHash = CryptoJS.generateSHA512(password);

    const decryptionResponse = CryptoJS.decrypt(
      encryptedData,
      passwordHash,
      verificationHash
    );

    if (!decryptionResponse.success) {
      // return { sucess: false, error: "invalid-password" };
      dispatch(setError("invalid-password"));
      return;
    }

    const decryptedData = decryptionResponse.data;
    let data;

    try {
      data = JSON.parse(decryptedData);
    } catch (e) {
      // return { success: false, error: "unknown-error" };
      dispatch(setError("unknown-error"));
      return;
    }

    dispatch(setUser(username, passwordHash, data));
    return; // { success: true };
  };
};

export const startLoading = () => {
  return {
    type: _.SET_LOADING,
    payload: true,
  };
};

export const stopLoading = () => {
  return {
    type: _.SET_LOADING,
    payload: false,
  };
};

export const setError = (error) => {
  return {
    type: _.SET_ERROR,
    payload: error,
  };
};

export const setUser = (username, passwordHash, data) => {
  return {
    type: _.SET_USER,
    payload: { username, passwordHash, data },
  };
};
