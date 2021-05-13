import React, { useEffect, useState } from "react";
import styled from "styled-components";

// Material UI
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  makeStyles,
} from "@material-ui/core";

// Icons
import {
  AccountCircleRounded as AccountCircleRoundedIcon,
  Title as TitleIcon,
  Link as LinkIcon,
  MailOutline as MailOutlineIcon,
  LockOutlined as LockOutlinedIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Close as CloseIcon,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EditPasswordModal = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const isPortait = useMediaQuery("(orientation: portrait)");

  useEffect(() => {
    clearTextFields();
    setTitleError(null);
    setWebsiteUrlError(null);
    setIsPasswordVisible(false);
  }, [props.open]);

  const clearTextFields = () => {
    const { details } = props;

    setTitle(details.title || "");
    setWebsiteUrl(details.websiteUrl || "");
    setEmail(details.email || "");
    setUsername(details.username || "");
    setPassword(details.password || "");
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  const [readOnly, setReadOnly] = useState(true);

  const { details } = props;
  const [title, setTitle] = useState(details.title || "");
  const [websiteUrl, setWebsiteUrl] = useState(details.websiteUrl || "");
  const [email, setEmail] = useState(details.email || "");
  const [username, setUsername] = useState(details.username || "");
  const [password, setPassword] = useState(details.password || "");

  const [titleError, setTitleError] = useState(null);
  const [websiteUrlError, setWebsiteUrlError] = useState(null);

  const createInputHandlerCallback = (function_) => {
    if (function_ === setTitle) {
      return (event) => {
        if (titleError) setTitleError(null);
        function_(event.target.value.slice(0, 1000));
      };
    }

    if (function_ === setWebsiteUrl) {
      return (event) => {
        if (websiteUrlError) setWebsiteUrlError(null);
        function_(event.target.value.slice(0, 1000));
      };
    }

    return (event) => function_(event.target.value.slice(0, 1000));
  };

  // Password Visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();

    if (!title) {
      setTitleError("Title is required.");
      return;
    }

    let url = websiteUrl;

    if (url) {
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = `http://${url}`;
        setWebsiteUrl(url);
      }

      try {
        new URL(url);
      } catch (e) {
        setWebsiteUrlError("Invalid URL entered.");
        return;
      }
    }

    props.onSave({
      passwordId: props.passwordId || null,
      title,
      websiteUrl: url,
      username,
      email,
      password,
    });
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={handleClose}
        TransitionComponent={Transition}
        {...(isPortait ? { fullScreen: true } : {})}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {props.title}
            </Typography>
            <Button autoFocus color="inherit" onClick={onFormSubmit}>
              Save
            </Button>
          </Toolbar>
        </AppBar>

        <FormContainer onSubmit={onFormSubmit}>
          <TextField
            label="Title"
            className="form-field-input"
            variant="outlined"
            placeholder="Enter the website name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TitleIcon />
                </InputAdornment>
              ),
            }}
            value={title}
            onChange={createInputHandlerCallback(setTitle)}
            disabled={loading}
            required
            {...(titleError ? { error: true, helperText: titleError } : {})}
          />
          <TextField
            label="Website URL"
            className="form-field-input"
            variant="outlined"
            placeholder="Enter the Website URL"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LinkIcon />
                </InputAdornment>
              ),
            }}
            value={websiteUrl}
            onChange={createInputHandlerCallback(setWebsiteUrl)}
            disabled={loading}
            {...(websiteUrlError
              ? { error: true, helperText: websiteUrlError }
              : {})}
          />
          <TextField
            label="Username"
            className="form-field-input"
            variant="outlined"
            placeholder="Enter the username"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleRoundedIcon />
                </InputAdornment>
              ),
            }}
            value={username}
            onChange={createInputHandlerCallback(setUsername)}
            disabled={loading}
          />
          <TextField
            label="Email"
            className="form-field-input"
            variant="outlined"
            placeholder="Enter the email address"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon />
                </InputAdornment>
              ),
              readOnly: readOnly, // to prevent autofilling of username password of user
            }}
            onFocus={() => setReadOnly(false)}
            onBlur={() => setReadOnly(true)}
            value={email}
            onChange={createInputHandlerCallback(setEmail)}
            disabled={loading}
          />
          <TextField
            label="Password"
            className="form-field-input"
            type={isPasswordVisible ? "text" : "password"}
            variant="outlined"
            placeholder="Enter the password"
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
            onChange={createInputHandlerCallback(setPassword)}
            disabled={loading}
          />
        </FormContainer>
      </Dialog>
    </div>
  );
};

const FormContainer = styled.form`
  padding: 1.5rem 1rem;

  .form-field-input {
    width: 100%;
    margin-bottom: 1.5rem;
  }

  .form-field-input:last-child {
    margin-bottom: 0;
  }
`;

export default EditPasswordModal;
