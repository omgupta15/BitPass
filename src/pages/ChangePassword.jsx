import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { generateHash } from "../utils";

// Redux Actions
import { changePassword } from "../redux/user/userActions";

// Components
import AlertModal from "../components/AlertModal";

// Material UI
import { CircularProgress, InputAdornment, TextField } from "@material-ui/core";

// Icons
import {
  Visibility as VisibilityIcon,
  LockOutlined as LockOutlinedIcon,
  VisibilityOff as VisibilityOffIcon,
  SecurityRounded as SecurityRoundedIcon,
  ArrowBackRounded as ArrowBackRoundedIcon,
  ArrowForwardRounded as ArrowForwardRoundedIcon,
} from "@material-ui/icons";

// Styles
import StyledForm from "../styles/StyledForm";

const ChangePassword = (props) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  document.title = "Change Password - BitPass";

  useEffect(() => {
    setLoading(false);

    if (!props.isLoggedIn) {
      history.push("/login");
    }
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
    history.push("/logout");
  };

  // User Input
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleCurrentPasswordChange = (e) => {
    setCurrentPassword(e.target.value.slice(0, 250));

    if (currentPasswordError) {
      setCurrentPasswordError(null);
    }
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value.slice(0, 250));

    if (newPasswordError) {
      setNewPasswordError(null);
    }
  };

  // Password Visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  // Errors
  const [currentPasswordError, setCurrentPasswordError] = useState(null);
  const [newPasswordError, setNewPasswordError] = useState(null);

  const onFormSubmit = (event) => {
    event.preventDefault();

    setIsPasswordVisible(false);

    if (!currentPassword || !newPassword) {
      if (!currentPassword) {
        setCurrentPasswordError("Enter your current password.");
      }

      if (!newPassword) {
        setNewPasswordError("Create a new password.");
      }

      return;
    }

    if (currentPassword.length < 8) {
      setCurrentPasswordError("Invalid password entered.");
      return;
    }

    if (newPassword.length < 8) {
      setNewPasswordError("Password must contain at least 8 characters.");
      return;
    }

    if (generateHash(currentPassword) !== props.currentUser.passwordHash) {
      setCurrentPasswordError("Invalid password entered.");
      return;
    }

    setLoading(true);
    props.changePassword(
      props.currentUser.username,
      props.currentUser.passwordHash,
      newPassword,
      onSuccess,
      onFailure
    );
  };

  const onSuccess = () => {
    setLoading(false);
    openModal(
      "Password changed successfully",
      "Your password has been successfully changed! You need to re-login now."
    );
  };

  const onFailure = (error) => {
    setLoading(false);

    openModal(
      "Error while updating the password",
      "An unknown error occurred while updating the password! Please try again."
    );
  };

  if (!props.isLoggedIn) {
    return <>{history.push("/login")}</>;
  }

  return (
    <>
      <StyledForm onSubmit={onFormSubmit}>
        <div className="logo">
          <img src="/img/logo-text.png" alt="BitPass" />
        </div>
        <div className="form">
          {/* <div className="top-link">
            <Link
              onClick={(e) => {
                e.preventDefault();
                history.goBack();
              }}
            >
              <span style={{ display: "flex" }}>
                <ArrowBackRoundedIcon
                  style={{ fontSize: "1.1rem", marginRight: "0.2rem" }}
                />
                Back
              </span>
            </Link>
          </div> */}
          <div className="title">Change Password</div>
          <div className="form-fields-container">
            <div className="form-field">
              <TextField
                label="Current Password"
                className="form-field-input"
                type="password"
                variant="outlined"
                placeholder="Enter your current password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SecurityRoundedIcon />
                    </InputAdornment>
                  ),
                }}
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                maxLength={50}
                disabled={loading}
                {...(currentPasswordError
                  ? { error: true, helperText: currentPasswordError }
                  : {})}
              />
            </div>
            <div className="form-field">
              <TextField
                label="New Password"
                className="form-field-input"
                type={isPasswordVisible ? "text" : "password"}
                variant="outlined"
                placeholder="Create a new password"
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
                value={newPassword}
                onChange={handleNewPasswordChange}
                minLength={8}
                maxLength={250}
                disabled={loading}
                {...(newPasswordError
                  ? { error: true, helperText: newPasswordError }
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
              <Link
                to="/profile"
                onClick={(e) => {
                  e.preventDefault();
                  history.goBack();
                }}
              >
                <span style={{ display: "flex" }}>
                  <ArrowBackRoundedIcon
                    style={{ fontSize: "1.1rem", marginRight: "0.2rem" }}
                  />
                  Back
                </span>
              </Link>
            </div>
            {/* <div className="link">
              <Link to="/logout">
                <span>Logout</span>
              </Link>
            </div> */}
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
    isLoggedIn: state.user.isLoggedIn,
    currentUser: {
      username: state.user.currentUser.username,
      passwordHash: state.user.currentUser.passwordHash,
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changePassword: (...args) => dispatch(changePassword(...args)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
