import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";

// Redux Actions
import { deleteAccount } from "../redux/user/userActions";

// Components
import AlertModal from "../components/AlertModal";

// Material UI
import { CircularProgress, InputAdornment, TextField } from "@material-ui/core";

// Icons
import {
  ArrowBackRounded as ArrowBackRoundedIcon,
  ArrowForwardRounded as ArrowForwardRoundedIcon,
  AccountCircleRounded as AccountCircleRoundedIcon,
} from "@material-ui/icons";

// Styles
import StyledForm from "../styles/StyledForm";

const DeleteAccount = (props) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  document.title = "Delete Account - BitPass";

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
  const [username, setUsername] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 50));

    if (usernameError) {
      setUsernameError("Enter your username to confirm.");
    }
  };

  // Errors
  const [usernameError, setUsernameError] = useState(
    "Enter your username to confirm."
  );

  const onFormSubmit = (event) => {
    event.preventDefault();

    if (!username) {
      setUsernameError("Enter your username to confirm.");
      return;
    }

    if (username !== props.currentUser.username) {
      setUsernameError("Username doesn't match!");
      return;
    }

    setLoading(true);
    props.deleteAccount(props.currentUser.username, onSuccess, onFailure);
  };

  const onSuccess = () => {
    setLoading(false);
    openModal(
      "Account deleted successfully",
      "Your account has been successfully deleted."
    );
  };

  const onFailure = (error) => {
    setLoading(false);
    openModal(
      "Error while deleting the account",
      "An unknown error occurred while deleting your account! Please try again."
    );
  };

  if (!props.isLoggedIn) {
    return <>{history.push("/login")}</>;
  }

  return (
    <>
      <StyledForm onSubmit={onFormSubmit}>
        <div className="logo">
          <img src="/logo-text.png" alt="BitPass" />
        </div>
        <div className="form">
          <div className="title">Delete Account</div>
          <div className="form-fields-container">
            <div className="form-field">
              <TextField
                label="Your Username"
                className="form-field-input"
                type="text"
                variant="outlined"
                placeholder="Enter your username to confirm"
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
                helperText={usernameError}
                {...(usernameError ? { error: true } : {})}
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
    deleteAccount: (...args) => dispatch(deleteAccount(...args)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount);
