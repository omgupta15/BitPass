import * as _ from "./userTypes";
import CryptoJS from "../../utils/CryptoJS";
import {
  generateHash,
  getUser,
  getData,
  getDecryptedData,
  updateUser,
  deleteUser,
} from "../../utils";
import { v4 as uuidv4 } from "uuid";

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

    const response = getDecryptedData(username, passwordHash);

    if (!response.success) {
      return killSession();
    }

    const decryptedData = response.data;
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

    const passwordHash = generateHash(password);
    const response = getDecryptedData(username, passwordHash);

    if (!response.success) {
      let error;

      switch (response.error) {
        case "not-found":
          error = "not-found";
          break;
        case "decryption-failed":
          error = "invalid-password";
          break;
        default:
          error = "unknown-error";
      }

      dispatch(setError(error));
      onLoginFailure(error);
      return;
    }

    const decryptedData = response.data;
    let data;

    try {
      data = JSON.parse(decryptedData);
    } catch (e) {
      dispatch(setError("unknown-error"));
      onLoginFailure("unknown-error");
      return;
    }

    dispatch(setUser(username, passwordHash, data));
    onLoginSuccess();
    return;
  };
};

export const signUpUser = (username, password, onSuccess, onFailure) => {
  return (dispatch) => {
    dispatch(startLoading());

    const userResponse = getUser(username);

    if (userResponse.success) {
      dispatch(setError("already-exists"));
      onFailure("already-exists");
      return;
    }

    if (userResponse.error !== "not-found") {
      dispatch(setError("unknown-error"));
      onFailure("unknown-error");
      return;
    }

    const data = {
      passwords: [],
      notes: [],
      settings: {},
    };
    const passwordHash = CryptoJS.generateSHA512(password);

    const userUpdateResponse = updateUser(username, passwordHash, data);
    // console.log("User update response:", userUpdateResponse);

    if (!userUpdateResponse.success) {
      dispatch(setError("unknown-error"));
      onFailure("unknown-error");
      return;
    }

    dispatch(setUser(username, passwordHash, data));
    onSuccess();
    return;
  };
};

export const changePassword = (
  username,
  currentPasswordHash,
  newPassword,
  onSuccess,
  onFailure
) => {
  return (dispatch) => {
    dispatch(startLoading());

    const data = getData(username, currentPasswordHash);

    const onError = () => {
      const error = "unknown-error";
      dispatch(setError(error));
      onFailure(error);
    };

    if (!data.success) {
      return onError();
    }

    const newPasswordHash = generateHash(newPassword);

    const userUpdateResponse = updateUser(username, newPasswordHash, data.data);
    // console.log("User update response:", userUpdateResponse);

    if (!userUpdateResponse.success) {
      return onError();
    }

    // dispatch(logout()); // logging out with on success event on modal close
    dispatch(stopLoading());
    onSuccess();
    return;
  };
};

export const deleteAccount = (username, onSuccess, onFailure) => {
  return (dispatch) => {
    dispatch(startLoading());

    const response = deleteUser(username);
    // console.log("User update response:", response);

    const onError = () => {
      const error = "unknown-error";
      dispatch(setError(error));
      onFailure(error);
    };

    if (!response.success) {
      return onError();
    }

    // dispatch(logout()); // logging out with on success event on modal close
    dispatch(stopLoading());
    onSuccess();
    return;
  };
};

export const backupAccount = (username, onSuccess, onFailure) => {
  return (dispatch) => {
    dispatch(startLoading());

    const response = getUser(username);

    const onError = () => {
      const error = "unknown-error";
      dispatch(setError(error));
      onFailure(error);
    };

    if (!response.success) {
      return onError();
    }

    const { data: encryptedData, verificationHash } = response.user;

    const fileName = `backup_${username} - ${new Date().toDateString()}.bitpass`;
    const backupData = {
      d: encryptedData,
      v: verificationHash,
    };

    const blob = new Blob([btoa(JSON.stringify(backupData))], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    dispatch(stopLoading());
    onSuccess(fileName, url);
    return;
  };
};

export const restoreUser = (username, password, data, onSuccess, onFailure) => {
  return (dispatch) => {
    dispatch(startLoading());

    const userResponse = getUser(username);

    if (userResponse.success) {
      dispatch(setError("already-exists"));
      onFailure("already-exists");
      return;
    }

    if (userResponse.error !== "not-found") {
      dispatch(setError("unknown-error"));
      onFailure("unknown-error");
      return;
    }

    const passwordHash = CryptoJS.generateSHA512(password);

    const userUpdateResponse = updateUser(username, passwordHash, data);
    // console.log("User update response:", userUpdateResponse);

    if (!userUpdateResponse.success) {
      dispatch(setError("unknown-error"));
      onFailure("unknown-error");
      return;
    }

    dispatch(setUser(username, passwordHash, data));
    onSuccess();
    return;
  };
};

export const addPassword = (
  username,
  passwordHash,
  passwordDetails,
  onSuccess,
  onFailure
) => {
  return (dispatch) => {
    dispatch(startLoading());

    const response = getData(username, passwordHash);

    const onError = () => {
      const error = "unknown-error";
      dispatch(setError(error));
      onFailure(error);
    };

    if (!response.success) {
      return onError();
    }

    const dataToAdd = {
      id: uuidv4(),
      details: {
        title: passwordDetails.title,
        websiteUrl: passwordDetails.websiteUrl || null,
        username: passwordDetails.username || null,
        email: passwordDetails.email || null,
        password: passwordDetails.password || null,
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    if (!Array.isArray(response.data.passwords)) {
      return onError();
    }

    response.data.passwords.push(dataToAdd);

    const userUpdateResponse = updateUser(
      username,
      passwordHash,
      response.data
    );
    // console.log("User update response:", userUpdateResponse);

    if (!userUpdateResponse.success) {
      return onError();
    }

    dispatch(setUser(username, passwordHash, response.data));
    onSuccess();
    return;
  };
};

export const updatePassword = (
  username,
  passwordHash,
  passwordDetails,
  onSuccess,
  onFailure
) => {
  return (dispatch) => {
    dispatch(startLoading());

    const data = getData(username, passwordHash);

    const onError = () => {
      const error = "unknown-error";
      dispatch(setError(error));
      onFailure(error);
    };

    if (!data.success) {
      return onError();
    }

    const dataToEdit = {
      details: {
        title: passwordDetails.title,
        websiteUrl: passwordDetails.websiteUrl || null,
        username: passwordDetails.username || null,
        email: passwordDetails.email || null,
        password: passwordDetails.password || null,
      },
      updatedAt: Date.now(),
    };

    // console.log(dataToEdit);

    if (!Array.isArray(data.data.passwords)) {
      return onError();
    }

    for (let i = 0; i < data.data.passwords.length; i++) {
      if (data.data.passwords[i].id === passwordDetails.passwordId) {
        data.data.passwords[i] = {
          ...data.data.passwords[i],
          ...dataToEdit,
        };
        break;
      }
    }

    const userUpdateResponse = updateUser(username, passwordHash, data.data);
    // console.log("User update response:", userUpdateResponse);

    if (!userUpdateResponse.success) {
      return onError();
    }

    dispatch(setUser(username, passwordHash, data.data));
    onSuccess(true);
    return;
  };
};

export const deletePassword = (
  username,
  passwordHash,
  passwordId,
  onSuccess,
  onFailure
) => {
  return (dispatch) => {
    dispatch(startLoading());

    const data = getData(username, passwordHash);

    const onError = () => {
      const error = "unknown-error";
      dispatch(setError(error));
      onFailure(error);
    };

    if (!data.success) {
      return onError();
    }

    if (!Array.isArray(data.data.passwords)) {
      return onError();
    }

    for (let i = 0; i < data.data.passwords.length; i++) {
      if (data.data.passwords[i].id === passwordId) {
        data.data.passwords.splice(i, 1);
        break;
      }
    }

    const userUpdateResponse = updateUser(username, passwordHash, data.data);
    // console.log("User update response:", userUpdateResponse);

    if (!userUpdateResponse.success) {
      return onError();
    }

    dispatch(setUser(username, passwordHash, data.data));
    onSuccess();
    return;
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
