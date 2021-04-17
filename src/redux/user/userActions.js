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
  try {
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
  } catch (e) {
    console.log("Error while getting user:", e);
    return { success: false, error: "unknown-error" };
  }
};

const updateUser = (username, passwordHash, dataToUpdate) => {
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

export const signUpUser = (
  username,
  password,
  onSignUpSuccess,
  onSignUpFailure
) => {
  return (dispatch) => {
    dispatch(startLoading());

    const userResponse = getUser(username);

    if (userResponse.success) {
      dispatch(setError("already-exists"));
      onSignUpFailure("already-exists");
      return;
    }

    if (userResponse.error !== "not-found") {
      dispatch(setError("unknown-error"));
      onSignUpFailure("unknown-error");
      return;
    }

    const data = {
      passwords: [],
      notes: [],
      settings: {},
    };
    const passwordHash = CryptoJS.generateSHA512(password);

    const userUpdateResponse = updateUser(username, passwordHash, data);
    console.log("User update response:", userUpdateResponse);

    if (!userUpdateResponse.success) {
      dispatch(setError("unknown-error"));
      onSignUpFailure("unknown-error");
      return;
    }

    dispatch(setUser(username, passwordHash, data));
    onSignUpSuccess();
    return; // { success: true };
  };
};

export const checkUserLogin = (onSuccess, onFailure) => {
  return (dispatch) => {
    dispatch(startLoading());

    const username = sessionStorage.getItem("username");
    const passwordHash = sessionStorage.getItem("passwordHash");

    const killSession = () => {
      dispatch(stopLoading());
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("passwordHash");
      onFailure();
    };

    if (!username || !passwordHash) {
      return killSession();
    }

    const userResponse = getUser(username);
    console.log("User Query Response:", userResponse);

    if (!userResponse.success) {
      return killSession();
    }

    const { data: encryptedData, verificationHash } = userResponse.user;

    const decryptionResponse = CryptoJS.decrypt(
      encryptedData,
      passwordHash,
      verificationHash
    );

    if (!decryptionResponse.success) {
      return killSession();
    }

    const decryptedData = decryptionResponse.data;
    let data;

    try {
      data = JSON.parse(decryptedData);
    } catch (e) {
      return killSession();
    }

    dispatch(setUser(username, passwordHash, data));
    onSuccess();
    return;
  };
};

export const loginUser = (
  username,
  password,
  onLoginSuccess,
  onLoginFailure
) => {
  return (dispatch) => {
    dispatch(startLoading());

    const userResponse = getUser(username);

    if (!userResponse.success) {
      if (userResponse.error === "not-found") {
        dispatch(setError("not-found"));
        onLoginFailure("not-found");
        return;
      }

      dispatch(setError("unknown-error"));
      onLoginFailure("unknown-error");
      return;
    }

    const { data: encryptedData, verificationHash } = userResponse.user;
    const passwordHash = CryptoJS.generateSHA512(password);

    const decryptionResponse = CryptoJS.decrypt(
      encryptedData,
      passwordHash,
      verificationHash
    );

    if (!decryptionResponse.success) {
      // return { sucess: false, error: "invalid-password" };
      dispatch(setError("invalid-password"));
      onLoginFailure("invalid-password");
      return;
    }

    const decryptedData = decryptionResponse.data;
    let data;

    try {
      data = JSON.parse(decryptedData);
    } catch (e) {
      // return { success: false, error: "unknown-error" };
      dispatch(setError("unknown-error"));
      onLoginFailure("unknown-error");
      return;
    }

    dispatch(setUser(username, passwordHash, data));
    onLoginSuccess();
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
  sessionStorage.setItem("username", username);
  sessionStorage.setItem("passwordHash", passwordHash);
  return {
    type: _.SET_USER,
    payload: { username, passwordHash, data },
  };
};

export const logout = () => {
  return {
    type: _.LOGOUT,
  };
};
