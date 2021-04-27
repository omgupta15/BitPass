import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

// Actions
import {
  addPassword,
  deletePassword,
  updatePassword,
} from "../redux/user/userActions";

// Components
import EditPasswordModal from "../components/EditPasswordModal";

// Styles
import StyledPasswords from "../styles/StyledPasswords";

// Material UI
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  Tooltip,
} from "@material-ui/core";

// Icons
import {
  Add as AddIcon,
  Edit as EditIcon,
  MailOutline as MailOutlineIcon,
  LockOutlined as LockOutlinedIcon,
  FileCopyOutlined as FileCopyOutlinedIcon,
  OpenInNewRounded as OpenInNewRoundedIcon,
  AccountCircleRounded as AccountCircleRoundedIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";

const Home = (props) => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  document.title = "My Passwords - BitPass";

  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordDialogTitle, setPasswordDialogTitle] = useState(null);

  useEffect(() => {}, []);

  const createCopyCallback = (text) => {
    return () => {
      navigator.clipboard.writeText(text);
      enqueueSnackbar("Copied to clipboard!", { variant: "success" });
    };
  };

  const [passwordId, setPasswordId] = useState(null);
  const [passwordDialogDetails, setPasswordDialogDetails] = useState({});

  const openPasswordDialog = (details = null) => {
    setIsPasswordDialogOpen(true);

    let title;
    if (!details.title) {
      title = "Add Password";
      setPasswordId(null);
    } else {
      title = "Edit Password";
    }

    setPasswordDialogTitle(title);
    setPasswordDialogDetails(details || {});
  };

  const createEditPasswordDialogCallback = (id, details) => {
    return () => {
      setPasswordId(id);
      openPasswordDialog(details);
    };
  };

  const onPasswordSave = ({
    passwordId,
    title,
    websiteUrl,
    email,
    username,
    password,
  }) => {
    // when password is edited
    if (passwordId) {
      const passwordDetails = {
        passwordId,
        title,
        websiteUrl,
        email,
        username,
        password,
      };
      props.updatePassword(
        props.currentUser.username,
        props.currentUser.passwordHash,
        passwordDetails,
        onPasswordUpdateSuccess,
        onPasswordUpdateFailure
      );
      return;
    }

    const passwordDetails = { title, websiteUrl, email, username, password };
    props.addPassword(
      props.currentUser.username,
      props.currentUser.passwordHash,
      passwordDetails,
      onPasswordUpdateSuccess,
      onPasswordUpdateFailure
    );
  };

  const onPasswordUpdateSuccess = (isUpdated) => {
    let message = "Password added successfully!";
    if (isUpdated) {
      message = "Password updated successfully!";
    }

    enqueueSnackbar(message, { variant: "success" });
    setIsPasswordDialogOpen(false);
  };

  const onPasswordUpdateFailure = (error) => {
    // console.log("Error while updating password:", error);
    enqueueSnackbar("An error occurred. Please try again!", {
      variant: "error",
    });
    setIsPasswordDialogOpen(false);
  };

  const [passwordIdToDelete, setPasswordIdToDelete] = useState(null);

  const closePasswordDeleteDialog = () => setPasswordIdToDelete(null);

  const deletePassword = () => {
    if (!passwordIdToDelete) return;

    props.deletePassword(
      props.currentUser.username,
      props.currentUser.passwordHash,
      passwordIdToDelete,
      onPasswordDeleteSuccess,
      onPasswordDeleteFailure
    );
  };

  const onPasswordDeleteSuccess = () => {
    enqueueSnackbar("Successfully deleted the saved account!", {
      variant: "success",
    });
    closePasswordDeleteDialog();
  };

  const onPasswordDeleteFailure = (error) => {
    enqueueSnackbar("An error occurred. Please try again!", {
      variant: "error",
    });
    closePasswordDeleteDialog();
  };

  if (!props.isLoggedIn) {
    return <>{history.push("/login")}</>;
  }

  return (
    <>
      <EditPasswordModal
        open={isPasswordDialogOpen}
        setOpen={setIsPasswordDialogOpen}
        title={passwordDialogTitle}
        details={passwordDialogDetails}
        onSave={onPasswordSave}
        passwordId={passwordId}
      />
      <Dialog
        open={Boolean(passwordIdToDelete)}
        onClose={closePasswordDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete the Saved Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this saved account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePasswordDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deletePassword} style={{ color: "red" }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <StyledPasswords>
        <div className="cards-container">
          <div className="header">
            <div className="heading">Saved Passwords</div>
            <button className="add-button" onClick={openPasswordDialog}>
              <AddIcon />
              <span>Add</span>
              <span>a Password</span>
            </button>
          </div>

          {!props.data.passwords.length && (
            <div className="alert">
              <span>You haven&rsquo;t saved any passwords yet!</span>
              {/* <span>
                Click on the &ldquo;Add&rdquo; button to start securing your
                passwords.
              </span> */}
            </div>
          )}

          <div className="cards">
            {props.data.passwords.map(({ id, details }, index) => (
              <div className="card" key={id || index + 1}>
                <div className="title">
                  <span>{details.title}</span>&nbsp;
                  {details.websiteUrl && (
                    <a
                      className="url"
                      href={details.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewRoundedIcon />
                    </a>
                  )}
                </div>
                <div className="field">
                  <TextField
                    label="Username"
                    className="field-input"
                    type="text"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleRoundedIcon />
                        </InputAdornment>
                      ),
                      ...(details.username
                        ? {
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip
                                  title="Copy to clipboard"
                                  placement="top"
                                  arrow
                                >
                                  <FileCopyOutlinedIcon
                                    className="copy-icon"
                                    fontSize="small"
                                    style={{ cursor: "pointer" }}
                                    onClick={createCopyCallback(
                                      details.username
                                    )}
                                  />
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }
                        : {}),
                    }}
                    value={details.username || "Not Set"}
                  />
                </div>
                <div className="field">
                  <TextField
                    label="Email"
                    className="field-input"
                    type="email"
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutlineIcon />
                        </InputAdornment>
                      ),
                      ...(details.email
                        ? {
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip
                                  title="Copy to clipboard"
                                  placement="top"
                                  arrow
                                >
                                  <FileCopyOutlinedIcon
                                    className="copy-icon"
                                    fontSize="small"
                                    style={{ cursor: "pointer" }}
                                    onClick={createCopyCallback(details.email)}
                                  />
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }
                        : {}),
                    }}
                    value={details.email || "Not Set"}
                  />
                </div>
                <div className="field">
                  <TextField
                    label="Password"
                    className="field-input"
                    type={details.password ? "password" : "text"}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlinedIcon />
                        </InputAdornment>
                      ),
                      ...(details.password
                        ? {
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip
                                  title="Copy to clipboard"
                                  placement="top"
                                  arrow
                                >
                                  <FileCopyOutlinedIcon
                                    className="copy-icon"
                                    fontSize="small"
                                    style={{ cursor: "pointer" }}
                                    onClick={createCopyCallback(
                                      details.password
                                    )}
                                  />
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }
                        : {}),
                    }}
                    value={details.password || "Not Set"}
                  />
                </div>
                <div className="buttons-wrapper">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={createEditPasswordDialogCallback(id, details)}
                  >
                    <EditIcon fontSize="small" />
                    <span className="edit-text">Edit</span>
                  </Button>
                  <Button
                    variant="outlined"
                    className="delete-button"
                    onClick={() => setPasswordIdToDelete(id)}
                  >
                    <DeleteIcon fontSize="small" />
                    <span className="edit-text">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </StyledPasswords>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    currentUser: {
      username: state.user.currentUser.username,
      passwordHash: state.user.currentUser.passwordHash,
    },
    data: state.user.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addPassword: (...args) => dispatch(addPassword(...args)),
    updatePassword: (...args) => dispatch(updatePassword(...args)),
    deletePassword: (...args) => dispatch(deletePassword(...args)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
