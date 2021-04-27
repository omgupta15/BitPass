import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { useSnackbar } from "notistack";

// Material UI
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Grid,
  Input,
  InputAdornment,
  Slider,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";

// Icons
import {
  LockOutlined as LockOutlinedIcon,
  ArrowBackRounded as ArrowBackRoundedIcon,
  FileCopyOutlined as FileCopyOutlinedIcon,
  ArrowForwardRounded as ArrowForwardRoundedIcon,
} from "@material-ui/icons";

// Styles
import StyledForm from "../styles/StyledForm";

const GeneratePassword = (props) => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(false);

    if (!props.isLoggedIn) {
      history.push("/login");
    }
  }, []);

  const [password, setPassword] = useState("");

  const handleCopyButtonClick = () => {
    navigator.clipboard.writeText(password);
    enqueueSnackbar("Copied to clipboard!", { variant: "success" });
  };

  // Password configurations
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const setPasswordLengthValue = (value) => {
    let input = Number(value.replace(/[^0-9]/g, ""));
    if (input < 1) {
      input = 1;
    } else if (input > 75) {
      input = 75;
    }
    setPasswordLength(input);
  };

  const handlepasswordLengthSliderChange = (e, newValue) => {
    setPasswordLengthValue(newValue + "");
  };

  const handlePasswordLengthInputChange = (e) => {
    setPasswordLengthValue(e.target.value);
  };

  useEffect(() => {
    generatePassword({
      passwordLength,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    });
  }, [
    passwordLength,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  const getRange = (start, end) => {
    const chars = [];
    for (let i = start; i <= end; i++) {
      chars.push(String.fromCharCode(i));
    }
    return chars;
  };

  const uppercaseCharacters = new Array(2).fill(getRange(65, 90)).flat();
  const lowercaseCharacters = new Array(3).fill(getRange(97, 122)).flat();
  const numberCharacters = new Array(2).fill(getRange(48, 57)).flat();
  // not including backticks because some devices don't have it
  const symbolCharacters = getRange(33, 47)
    .concat(getRange(58, 64))
    .concat(getRange(91, 95));

  const generatePassword = (options) => {
    let chars = [];

    if (options.includeUppercase) chars = chars.concat(uppercaseCharacters);
    if (options.includeLowercase) chars = chars.concat(lowercaseCharacters);
    if (options.includeNumbers) chars = chars.concat(numberCharacters);
    if (options.includeSymbols) chars = chars.concat(symbolCharacters);

    if (chars.length < 1) {
      setIncludeLowercase(true);
      chars = chars.concat(lowercaseCharacters);
    }

    const tempPassword = [];
    for (let i = 0; i < options.passwordLength; i++) {
      tempPassword.push(chars[Math.floor(Math.random() * chars.length)]);
    }

    setPassword(tempPassword.join(""));
  };

  const onFormSubmit = (event) => {
    event.preventDefault();

    const options = {
      passwordLength,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols,
    };
    generatePassword(options);
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
          <div className="title">Generate Password</div>
          <div className="form-fields-container" style={{ minWidth: "60%" }}>
            <div className="form-field">
              <TextField
                label="Password"
                className="form-field-input"
                type="text"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Copy to clipboard" placement="top" arrow>
                        <FileCopyOutlinedIcon
                          className="copy-icon"
                          fontSize="small"
                          style={{ cursor: "pointer" }}
                          onClick={handleCopyButtonClick}
                        />
                      </Tooltip>
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                value={password}
              />
            </div>
            <div className="form-field">
              <Typography id="input-slider" gutterBottom>
                Password Length
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item>{/* <LockOutlinedIcon /> */}</Grid>
                <Grid item xs>
                  <Slider
                    min={1}
                    max={75}
                    value={
                      typeof passwordLength === "number" ? passwordLength : 0
                    }
                    onChange={handlepasswordLengthSliderChange}
                    aria-labelledby="input-slider"
                  />
                </Grid>
                <Grid item>
                  <Input
                    // className={classes.input}

                    value={passwordLength}
                    margin="dense"
                    onChange={handlePasswordLengthInputChange}
                    // onBlur={handlePasswordLengthChange}
                    inputProps={{
                      step: 1,
                      min: 1,
                      max: 75,
                      type: "number",
                      "aria-labelledby": "input-slider",
                    }}
                  />
                </Grid>
              </Grid>
            </div>
            <div className="form-field" style={{ marginBottom: 0 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeUppercase}
                    onChange={() => setIncludeUppercase((prev) => !prev)}
                    name="includeUppercase"
                    color="primary"
                  />
                }
                label="Include Uppercase"
              />
            </div>
            <div className="form-field" style={{ marginBottom: 0 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeLowercase}
                    onChange={() => setIncludeLowercase((prev) => !prev)}
                    name="includeLowercase"
                    color="primary"
                  />
                }
                label="Include Lowercase"
              />
            </div>
            <div className="form-field" style={{ marginBottom: 0 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeNumbers}
                    onChange={() => setIncludeNumbers((prev) => !prev)}
                    name="includeNumbers"
                    color="primary"
                  />
                }
                label="Include Numbers"
              />
            </div>
            <div className="form-field">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={includeSymbols}
                    onChange={() => setIncludeSymbols((prev) => !prev)}
                    name="includeSymbols"
                    color="primary"
                  />
                }
                label="Include Symbols"
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
                    <span>Generate</span>
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
          </div>
        </div>
      </StyledForm>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.user.loading,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(GeneratePassword);
