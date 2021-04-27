import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { decryptBackupData } from "../utils";

// Redux Actions
import { restoreUser, checkUserLogin } from "../redux/user/userActions";

// Components
import AlertModal from "../components/AlertModal";

// Material UI
import {
  CircularProgress,
  Input,
  InputAdornment,
  TextField,
} from "@material-ui/core";

// Icons
import {
  Check as CheckIcon,
  PublishRounded as PublishRoundedIcon,
  LockOutlined as LockOutlinedIcon,
  ArrowForwardRounded as ArrowForwardRoundedIcon,
  AccountCircleRounded as AccountCircleRoundedIcon,
} from "@material-ui/icons";

// Styles
import StyledForm from "../styles/StyledForm";

const Restore = (props) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  document.title = "Restore Account - BitPass";

  useEffect(() => {
    // setLoading(false);

    if (props.isLoggedIn) {
      history.push("/");
      return;
    }

    props.checkUserLogin(onSuccess, () => setLoading(false));
  }, []);

  // Modal for alert
  const [modalData, setModalData] = useState({ title: "", message: "" });
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (title, message) => {
    setModalData({
      title: title,
      message: message,
    });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);

    if (props.isLoggedIn) {
      history.push("/");
    }
  };

  // User Input
  const [backupFileData, setBackupFileData] = useState({
    data: null,
    verificationHash: null,
  });
  const [decryptedData, setDecryptedData] = useState(null);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.slice(0, 250));

    if (passwordError) {
      setPasswordError(null);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files.length < 1) {
      openModal("No File", "Please select a valid .bitpass backup file.");
      return;
    }

    setLoading(true);

    const file = files[0];

    const reader = new FileReader();

    reader.addEventListener("load", (e) => {
      const rawData = e.target.result;
      let tempData;

      try {
        tempData = JSON.parse(atob(rawData));
      } catch (err) {
        openModal(
          "Invalid File",
          "Please select a valid .bitpass backup file."
        );
        setLoading(false);
        return;
      }

      if (
        !tempData.d ||
        !tempData.v ||
        typeof tempData.d !== "string" ||
        typeof tempData.v !== "string"
      ) {
        openModal(
          "Invalid File",
          "Please select a valid .bitpass backup file."
        );
        setLoading(false);
        return;
      }

      const data = tempData.d;
      const verificationHash = tempData.v;

      setLoading(false);
      setBackupFileData({ data, verificationHash });
      return;
    });

    reader.readAsText(file);
  };

  const handleUsernameChange = (e) => {
    // Don't allow any other characters than a-z, A-Z & 0-9
    setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 50));

    if (usernameError) {
      setUsernameError(null);
    }
  };

  const [passwordError, setPasswordError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);

  const onFormSubmit = (event) => {
    event.preventDefault();

    if (!decryptedData) {
      if (!backupFileData.data) {
        openModal("No File", "Please select a valid .bitpass backup file.");
        return;
      }

      if (!password) {
        setPasswordError("Enter the password to decrypt the backup.");
        return;
      }

      if (password.length < 8) {
        setPasswordError("Invalid Password entered.");
        return;
      }

      setLoading(true);

      const decryptionResponse = decryptBackupData(
        backupFileData.data,
        backupFileData.verificationHash,
        password
      );

      if (!decryptionResponse.success) {
        if (decryptionResponse.error === "invalid-json") {
          openModal(
            "Account Restore Failed",
            "An error occurred while restoring your account! Looks like the backup file has been tampered with."
          );
          setLoading(false);
          return;
        }

        setPasswordError("Invalid Password entered.");
        setLoading(false);
        return;
      }

      setDecryptedData(decryptionResponse.data);
      setLoading(false);
      return;
    }

    if (!username) {
      setUsernameError("Create a new username for your account.");
      return;
    }

    setLoading(true);
    props.restoreUser(username, password, decryptedData, onSuccess, onFailure);
  };

  const onSuccess = () => {
    setLoading(false);

    openModal(
      "Account Restore Successful",
      "Your backup has been successfully restored! You can login using the same password now."
    );
  };

  const onFailure = (error) => {
    setLoading(false);

    if (error === "already-exists") {
      setUsernameError("Username already exists.");
      return;
    }

    openModal(
      "Account Restore Failed",
      "An unknown error occurred while restoring your account! Please try again."
    );
  };

  // if (props.isLoggedIn) {
  //   return <>{history.push("/")}</>;
  // }

  return (
    <>
      <StyledForm onSubmit={onFormSubmit}>
        <div className="logo">
          <img src="/logo-text.png" alt="BitPass" />
        </div>
        <div className="form">
          <div className="title">Restore Account</div>

          <div className="form-fields-container" style={{ paddingTop: 0 }}>
            <div className="form-field">
              <Input
                className="form-field-file-input"
                color="primary"
                type="file"
                inputProps={{ accept: ".bitpass" }}
                onChange={handleFileChange}
                startAdornment={
                  <InputAdornment position="start">
                    <PublishRoundedIcon />
                  </InputAdornment>
                }
                disableUnderline
                disabled={loading || backupFileData.data}
              />
              <p className="helper-text MuiFormHelperText-root MuiFormHelperText-contained">
                {loading ? (
                  "Checking the backup file..."
                ) : backupFileData.data ? (
                  <div
                    style={{
                      color: "#00cc00",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <CheckIcon
                      style={{ fontSize: "0.9rem", marginRight: "0.2rem" }}
                    />
                    <div>Backup File is valid.</div>
                  </div>
                ) : (
                  "Upload the backup file."
                )}
              </p>
            </div>
            <div className="form-field" hidden={!backupFileData.data}>
              <TextField
                label="Password"
                className="form-field-input"
                type="password"
                variant="outlined"
                placeholder="Enter the password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
                value={password}
                onChange={handlePasswordChange}
                minLength={8}
                maxLength={250}
                disabled={loading || decryptedData}
                {...(passwordError
                  ? { error: true, helperText: passwordError }
                  : {
                      helperText: "Enter the password to decrypt the backup.",
                    })}
              />
            </div>
            <div className="form-field" hidden={!decryptedData}>
              <TextField
                label="Username"
                className="form-field-input"
                variant="outlined"
                placeholder="Enter your username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleRoundedIcon />
                    </InputAdornment>
                  ),
                }}
                value={username}
                onChange={handleUsernameChange}
                maxLength={50}
                disabled={loading}
                {...(usernameError
                  ? { error: true, helperText: usernameError }
                  : { helperText: "Create a new username for your account." })}
              />
            </div>
            <div
              className="form-field submit-button-wrapper"
              style={{ paddingTop: "0.5rem" }}
            >
              <button
                type="submit"
                className="submit-buttom"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size="1.25rem"
                      thickness={5}
                      style={{ color: "white" }}
                    />
                    <span>Please wait</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowForwardRoundedIcon />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bottom-links">
            <div className="link">
              <Link to="/login">
                <span>Login</span>
              </Link>
            </div>
            <div className="link">
              <Link to="/signup">
                <span>Don't have an account?</span>
                <span>Sign up here!</span>
              </Link>
            </div>
          </div>
        </div>
      </StyledForm>
      <AlertModal
        handleClose={handleModalClose}
        open={modalOpen}
        title={modalData.title}
        text={modalData.message}
        buttonText="OK"
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    error: state.user.error,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    restoreUser: (...args) => dispatch(restoreUser(...args)),

    checkUserLogin: (onSuccess, onFailure) =>
      dispatch(checkUserLogin(onSuccess, onFailure)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Restore);
