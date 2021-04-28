import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";

// Redux Actions
import { loginUser, checkUserLogin } from "../redux/user/userActions";

// Components
import AlertModal from "../components/AlertModal";

// Material UI
import { CircularProgress, InputAdornment, TextField } from "@material-ui/core";

// Icons
import {
  LockOutlined as LockOutlinedIcon,
  ArrowForwardRounded as ArrowForwardRoundedIcon,
  AccountCircleRounded as AccountCircleRoundedIcon,
} from "@material-ui/icons";

// Styles
import StyledForm from "../styles/StyledForm";

const Login = (props) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  document.title = "Login - BitPass";

  useEffect(() => {
    // setLoading(false);

    if (props.isLoggedIn) {
      history.push("/");
      return;
    }

    props.checkUserLogin(onLoginSuccess, () => setLoading(false));
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

  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const onFormSubmit = (event) => {
    event.preventDefault();

    if (!username || !password) {
      if (!username) {
        setUsernameError("Enter your username.");
      }

      if (!password) {
        setPasswordError("Enter your password.");
      }

      return;
    }

    if (password.length < 8) {
      setPasswordError("Invalid Password entered.");
      return;
    }

    setLoading(true);
    props.loginUser(username, password, onLoginSuccess, onLoginFailure);
  };

  const onLoginSuccess = () => {
    setLoading(false);
    // openModal("Login Successful", "You've successfully logged in!");
    history.push("/");
  };

  const onLoginFailure = (error) => {
    setLoading(false);

    if (error === "not-found") {
      setUsernameError("Username not found.");
      return;
    }

    if (error === "invalid-password") {
      setPasswordError("Invalid Password entered.");
      return;
    }

    openModal(
      "Login Failed",
      "An unknown error occurred while logging in! Please try again."
    );
  };

  // if (props.isLoggedIn) {
  //   return <>{history.push("/")}</>;
  // }

  return (
    <>
      <StyledForm onSubmit={onFormSubmit}>
        <div className="logo">
          <img src="/img/logo-text.png" alt="BitPass" />
        </div>
        <div className="form">
          <div className="title">Login</div>

          <div className="form-fields-container">
            <div className="form-field">
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
                  : {})}
              />
            </div>
            <div className="form-field">
              <TextField
                label="Password"
                className="form-field-input"
                type="password"
                variant="outlined"
                placeholder="Enter your password"
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
              <Link to="/signup">
                <span>Don't have an account?</span>
                <span>Sign up here!</span>
              </Link>
            </div>
            <div className="link">
              <Link to="/restore">
                <span>Restore Account</span>
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
    loginUser: (username, password, onLoginSuccess, onLoginFailure) =>
      dispatch(loginUser(username, password, onLoginSuccess, onLoginFailure)),

    checkUserLogin: (onSuccess, onFailure) =>
      dispatch(checkUserLogin(onSuccess, onFailure)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
