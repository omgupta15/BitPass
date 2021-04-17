import React from "react";

// Material UI
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const AlertModal = (props) => {
  const dialogStyles = () => {
    return {
      root: {
        margin: 0,
        padding: 16,
      },
      closeButton: {
        position: "absolute",
        right: 8,
        top: 8,
        color: "#9e9e9e",
      },
    };
  };

  const DialogTitle = withStyles(dialogStyles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const DialogContent = withStyles(() => ({
    root: {
      padding: 16,
    },
  }))(MuiDialogContent);

  const DialogActions = withStyles(() => ({
    root: {
      margin: 0,
      padding: 8,
    },
  }))(MuiDialogActions);

  return (
    <Dialog
      onClose={props.handleClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
        {props.title}
      </DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>{props.text}</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.handleClose}>
          {props.buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertModal;
