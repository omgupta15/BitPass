import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";

// Redux Actions
import { signUpUser, checkUserLogin } from "../redux/user/userActions";

// Components
import AlertModal from "../components/AlertModal";

// Material UI
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

// Icons
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ArrowForwardRoundedIcon from "@material-ui/icons/ArrowForwardRounded";
import CircularProgress from "@material-ui/core/CircularProgress";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";

// Styles
import StyledForm from "../styles/StyledForm";

const SignUp = (props) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    setLoading(false);

    if (props.isLoggedIn) {
      history.push("/");
    }

    props.checkUserLogin(
      () => onSignUpSuccess(true),
      () => setLoading(false)
    );
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
    console.log("Modal Closed!");

    if (props.isLoggedIn) {
      history.push("/");
    }
  };

  // User Input
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    // Don't allow any other characters than a-z, A-Z & 0-9
    setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 50));

    if (usernameError) {
      setUsernameError(null);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.slice(0, 250));

    if (passwordError) {
      setPasswordError(null);
    }
  };

  // Password Visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const onFormSubmit = (event) => {
    event.preventDefault();

    setIsPasswordVisible(false);

    if (!username || !password) {
      if (!username) {
        setUsernameError("Create a new username.");
      }

      if (!password) {
        setPasswordError("Create a password.");
      }

      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);
    props.signUpUser(username, password, onSignUpSuccess, onSignUpFailure);
  };

  const onSignUpSuccess = (callbackFromSessionStorageCheck) => {
    setLoading(false);
    if (callbackFromSessionStorageCheck) {
      history.push("/");
    } else {
      openModal(
        "Sign Up Successful",
        "Your account has been successfully created! Remember that all your data is stored locally in an encrypted format and hence, there's no way to recover your password incase your forget it."
      );
      console.log("Modal opened!");
    }
  };

  const onSignUpFailure = (error) => {
    setLoading(false);

    if (error === "already-exists") {
      setUsernameError("Username already exists.");
      return;
    }

    openModal(
      "Sign Up Failed",
      "An unknown error occurred while signing you up! Please try again."
    );
  };

  return (
    <>
      <StyledForm onSubmit={onFormSubmit}>
        <div className="logo">
          <img src="/logo-text.png" alt="BitPass" />
        </div>
        <div className="form">
          <div className="title">Sign Up</div>

          <div className="form-fields-container">
            <div className="form-field">
              <TextField
                label="Username"
                className="form-field-input"
                variant="outlined"
                placeholder="Create a new username"
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
                  : {})}
              />
            </div>
            <div className="form-field">
              <TextField
                label="Password"
                className="form-field-input"
                type={isPasswordVisible ? "text" : "password"}
                variant="outlined"
                placeholder="Create a password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {isPasswordVisible ? (
                        <VisibilityIcon
                          style={{ cursor: "pointer" }}
                          onClick={togglePasswordVisibility}
                        />
                      ) : (
                        <VisibilityOffIcon
                          style={{ cursor: "pointer" }}
                          onClick={togglePasswordVisibility}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
                value={password}
                onChange={handlePasswordChange}
                minLength={8}
                maxLength={250}
                disabled={loading}
                {...(passwordError
                  ? { error: true, helperText: passwordError }
                  : {})}
              />
            </div>
            <div className="form-field submit-button-wrapper">
              <button
                type="submit"
                className="submit-buttom"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size="1.25rem"
                      thickness="5"
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
                <span>Have an account already?</span>
                <span>Login here!</span>
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
    signUpUser: (username, password, onSignUpSuccess, onSignUpFailure) =>
      dispatch(
        signUpUser(username, password, onSignUpSuccess, onSignUpFailure)
      ),

    checkUserLogin: (onSuccess, onFailure) =>
      dispatch(checkUserLogin(onSuccess, onFailure)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
