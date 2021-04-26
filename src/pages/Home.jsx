import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";
import { useSnackbar } from "notistack";

// Actions
import {
  addPassword,
  deletePassword,
  updatePassword,
} from "../redux/user/userActions";

// Components
import EditPasswordModal from "../components/EditPasswordModal";

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
    console.log("Error while updating password:", error);
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

const StyledPasswords = styled.div`
  padding: 1rem;

  .alert {
    margin-top: 1.5rem;
    font-size: 1.1rem;

    span {
      display: inline-block;
    }

    span:first-child {
      margin-right: 0.3rem;
    }
  }

  .cards-container {
    .cards {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-gap: 1rem;

      @media all and (max-width: 1800px) {
        grid-template-columns: repeat(4, 1fr);
      }

      @media all and (max-width: 1300px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media all and (max-width: 1000px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media all and (max-width: 600px) {
        grid-template-columns: repeat(1, 1fr);
      }

      .card {
        box-sizing: border-box;
        padding: 1.5rem;

        background: #eeeeee;

        border-radius: 0.25rem;

        .title {
          text-align: center;
          cursor: default;
          margin-bottom: 1.1rem;

          span {
            display: inline-block;
            font-size: 1.75rem;
          }

          .url {
            svg {
              font-size: 1rem;
              transition: all 0.15s ease-in-out;
            }
          }

          &:hover svg {
            font-size: 1.1rem;
          }
        }

        transition: all 0.2s ease-in-out;

        .field {
          margin-top: 1rem;

          .field-input {
            width: 100%;

            .copy-icon {
              opacity: 0;
              transition: all 0.2s ease-in-out;

              @media all and (orientation: portrait) {
                opacity: 1;
              }

              &:hover {
                transform: scale(1.1);
              }
            }

            &:hover .copy-icon {
              opacity: 1;
            }
          }
        }

        .buttons-wrapper {
          margin-top: 1rem;
          display: flex;
          justify-content: space-between;

          button {
            display: flex;
            padding: 0.3rem 0.7rem;
          }

          .delete-button {
            color: #ff1212;
            border-color: rgba(255, 18, 18, 0.4);

            &:hover {
              background-color: rgba(255, 18, 18, 0.05);
              border-color: #ff1212;
            }
          }

          svg {
            display: inline-block;
            vertical-align: middle;
            font-size: 1rem;
          }

          .edit-text {
            display: inline-block;
            vertical-align: middle;
            margin-left: 0.2rem;
          }
        }
      }

      .card:hover {
        background: #ebebeb;
        box-shadow: 0 0 0.4rem 0 rgba(0, 0, 0, 0.7);
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      margin-top: 0.5rem;
      margin-bottom: 1rem;

      .heading {
        color: #111111;
        font-size: 2.1rem;

        @media all and (max-width: 450px) {
          font-size: 1.75rem;
        }
      }

      .add-button {
        display: flex;
        align-items: center;

        padding: 0.5rem 0.75rem;
        border-radius: 100rem;

        cursor: pointer;
        border: none;

        background: linear-gradient(90deg, #6f00ff, #00ddad);
        background-size: 250% 250%;
        background-position: 100% 52%;
        transition: all 0.3s ease-in-out;

        font-weight: 500;
        color: white;

        &:hover {
          background-position: 0% 49%;
        }

        span {
          margin: 0 0.25rem;
          font-size: 1.05rem;
        }

        span:last-child {
          margin-left: 0;
        }

        @media all and (max-width: 600px) {
          padding: 0.5rem;

          span:last-child {
            display: none;
          }
        }

        @media all and (max-width: 350px) {
          padding: 0.3rem;

          span {
            display: none;
          }
        }
      }
    }
  }
`;

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
