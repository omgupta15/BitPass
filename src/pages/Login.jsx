import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

// Redux Actions
import { loginUser } from "../redux/user/userActions";

// Material UI
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

// Icons
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ArrowForwardRoundedIcon from "@material-ui/icons/ArrowForwardRounded";
import CircularProgress from "@material-ui/core/CircularProgress";

// Styles
import StyledForm from "../styles/StyledForm";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    // Don't allow any other characters than a-z, A-Z & 0-9
    setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 50));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.slice(0, 250));
  };

  const onFormSubmit = (event) => {
    event.preventDefault();

    if (password.length < 8) {
      console.log("Please enter a valid password.");
      return;
    }

    console.log("Form submitted!");
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <StyledForm onSubmit={onFormSubmit}>
      <div className="logo">
        <img src="/logo-text.png" alt="BitPass" />
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
              required
              disabled={props.loading}
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
              required
              disabled={props.loading}
            />
          </div>
          <div className="form-field submit-button-wrapper">
            <button
              type="submit"
              className="submit-buttom"
              disabled={props.loading}
            >
              {props.loading ? (
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
            <Link to="/signup">Don't have an account? Sign up here!</Link>
          </div>
        </div>
      </div>
    </StyledForm>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (username, password) => dispatch(loginUser(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
