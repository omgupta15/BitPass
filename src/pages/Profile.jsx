import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import styled from "styled-components";

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

const StyledProfile = styled.div`
  padding: 1rem;

  .buttons-container {
    display: flex;
    flex-wrap: wrap;

    .button {
      color: white;
      margin-top: 1rem;
      margin-right: 1rem;
    }

    .button:last-child {
      margin-right: 0;
    }

    @media all and (max-width: 500px) {
      flex-direction: column;

      .button {
        margin-right: 0;
        margin-top: 1rem;
      }
    }
  }

  .header {
    display: flex;
    flex-direction: column;

    margin-top: 0.5rem;

    .heading {
      color: #111111;
      font-size: 2.1rem;
      margin-right: 0.75rem;

      @media all and (max-width: 450px) {
        font-size: 1.75rem;
      }
    }

    .user-detail {
      display: inline-block;
      padding-top: 0.5rem;
      font-size: 1.25rem;
      color: rgba(0, 0, 0, 0.9);

      .username {
        font-family: monospace;
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }

  .success-button {
    background-color: #43a047;
  }

  .success-button:hover {
    background-color: #1ab322;
  }

  .danger-button {
    background-color: #ff3333;
  }

  .danger-button:hover {
    background-color: #ff1212;
  }
`;

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
