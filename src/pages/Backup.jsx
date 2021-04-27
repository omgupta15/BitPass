import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";

// Redux Actions
import { backupAccount } from "../redux/user/userActions";

// Material UI
import { Button, CircularProgress } from "@material-ui/core";

// Icons
import {
  GetAppRounded as GetAppRoundedIcon,
  WarningRounded as WarningRoundedIcon,
  ArrowBackRounded as ArrowBackRoundedIcon,
} from "@material-ui/icons";

// Styles
import StyledForm from "../styles/StyledForm";

const Backup = (props) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  document.title = "Backup Account - BitPass";

  const [backupFileName, setBackupFileName] = useState(null);
  const [backupFileUrl, setBackupFileUrl] = useState(null);

  useEffect(() => {
    if (!props.isLoggedIn) {
      history.push("/login");
      return;
    }

    setLoading(true);
    props.backupAccount(props.currentUser.username, onSuccess, onFailure);
  }, []);

  const onFormSubmit = (event) => {
    event.preventDefault();
  };

  const onSuccess = (fileName, url) => {
    setLoading(false);
    setBackupFileName(fileName);
    setBackupFileUrl(url);
  };

  const onFailure = (error) => {
    setLoading(false);
    setBackupFileName(null);
    setBackupFileUrl(null);
  };

  if (!props.isLoggedIn) {
    return <>{history.push("/login")}</>;
  }

  return (
    <StyledForm onSubmit={onFormSubmit}>
      <div className="logo">
        <img src="/logo-text.png" alt="BitPass" />
      </div>
      <div className="form">
        <div className="title">Backup Account</div>
        <div className="form-fields-container" style={{ paddingTop: 0 }}>
          <div className="form-field submit-button-wrapper">
            <a
              href={backupFileUrl}
              download={backupFileName}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {loading ? (
                <Button
                  variant="contained"
                  color="primary"
                  className="button"
                  size="large"
                  startIcon={
                    <CircularProgress
                      size="1.25rem"
                      thickness={5}
                      // style={{ color: "white" }}
                    />
                  }
                  disabled
                >
                  Creating your Backup...
                </Button>
              ) : backupFileName ? (
                <Button
                  variant="contained"
                  color="primary"
                  className="button"
                  size="large"
                  startIcon={<GetAppRoundedIcon />}
                >
                  Download Backup
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className="button"
                  size="large"
                  startIcon={<WarningRoundedIcon />}
                  disabled
                >
                  An Error Occurred
                </Button>
              )}
            </a>
          </div>
        </div>
        {!loading && (
          <span
            style={{
              display: "inline-block",
              textAlign: "center",
              marginBottom: "1.5rem",
            }}
          >
            {backupFileName
              ? "This backup is encrypted with your password and you'll need to enter it to decrypt the backup file."
              : "Please refresh this page to try again."}
          </span>
        )}
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
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    isLoggedIn: state.user.isLoggedIn,
    currentUser: {
      username: state.user.currentUser.username,
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    backupAccount: (...args) => dispatch(backupAccount(...args)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Backup);
