import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

// Material UI
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

// Icons
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import ArrowForwardRoundedIcon from "@material-ui/icons/ArrowForwardRounded";

// Styles
import StyledForm from "../styles/StyledForm";

const SignUp = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    // Don't allow any other characters than a-z, A-Z & 0-9
    setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, 50));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value.slice(0, 250));
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();

    if (password.length < 8) {
      console.log("Password too small.");
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
              required
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
              required
            />
          </div>
          <div className="form-field submit-button-wrapper">
            <button type="submit" className="submit-buttom">
              <span>Continue</span>
              <ArrowForwardRoundedIcon />
            </button>
          </div>
        </div>

        <div className="bottom-links">
          <div className="link">
            <Link to="/">Have an account already? Login here!</Link>
          </div>
        </div>
      </div>
    </StyledForm>
  );
};

export default SignUp;
