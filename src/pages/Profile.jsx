import React from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

// Styles
import StyledProfile from "../styles/StyledProfile";

// Material UI
import { Button } from "@material-ui/core";

// Icons
import {
  Delete as DeleteIcon,
  LockOutlined as LockOutlinedIcon,
  SettingsBackupRestoreRounded as SettingsBackupRestoreRoundedIcon,
} from "@material-ui/icons";

const Profile = (props) => {
  const history = useHistory();

  return (
    <StyledProfile>
      <div className="header">
        <div className="heading">My Profile</div>
        <span className="user-detail">
          Logged in as &ldquo;
          <span className="username">{props.currentUser.username}</span>&rdquo;
        </span>
      </div>

      <div className="buttons-container">
        <Button
          variant="contained"
          color="primary"
          className="button"
          size="large"
          startIcon={<LockOutlinedIcon />}
          onClick={() => history.push("/change-password")}
        >
          Change Password
        </Button>
        <Button
          variant="contained"
          className="button success-button"
          size="large"
          startIcon={<SettingsBackupRestoreRoundedIcon />}
          onClick={() => history.push("/backup")}
        >
          Backup Account
        </Button>
        <Button
          variant="contained"
          className="button danger-button"
          size="large"
          startIcon={<DeleteIcon />}
          onClick={() => history.push("/delete-account")}
        >
          Delete Account
        </Button>
      </div>
    </StyledProfile>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    currentUser: {
      username: state.user.currentUser.username,
      passwordHash: state.user.currentUser.passwordHash,
    },
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
