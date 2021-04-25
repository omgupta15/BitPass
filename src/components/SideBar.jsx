import React, { useState } from "react";
import { useHistory } from "react-router-dom";

// Material UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

// Icons
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import NoteAddOutlinedIcon from "@material-ui/icons/NoteAddOutlined";
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded";
import SettingsBackupRestoreRoundedIcon from "@material-ui/icons/SettingsBackupRestoreRounded";
import ExitToAppRoundedIcon from "@material-ui/icons/ExitToAppRounded";

const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();

  // Styles
  const flexGrowStyle = { flexGrow: 1 };
  const colorStyle = { color: "white" };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (event, open) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      // to make drawer usable by keyboard
      return;
    }

    setIsOpen(open);
  };

  const openLink = (path, closeMenu) => {
    return () => {
      history.push(path);
      if (closeMenu) {
        closeMenu();
      }
    };
  };

  return (
    <>
      <div style={flexGrowStyle}>
        <AppBar
          position="static"
          color="transparent"
          style={{ height: "64px" }}
        >
          <Toolbar style={{ height: "64px" }}>
            <IconButton
              edge="start"
              aria-label="menu"
              style={{ marginRight: 10, ...colorStyle }}
              onClick={(event) => toggleDrawer(event, true)}
            >
              <MenuIcon />
            </IconButton>

            <div
              onClick={openLink("/")}
              style={{ cursor: "pointer", ...flexGrowStyle }}
            >
              <img src="/logo-text.png" style={{ height: "2.5rem" }} alt="" />
            </div>

            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
                style={colorStyle}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={openLink("/profile", handleMenuClose)}
                  style={{ height: "3rem" }}
                >
                  <AccountCircleRoundedIcon style={{ minWidth: 30 }} />
                  &nbsp; My Profile
                </MenuItem>
                <MenuItem
                  onClick={openLink("/logout", handleMenuClose)}
                  style={{ height: "3rem" }}
                >
                  <ExitToAppRoundedIcon style={{ minWidth: 30 }} />
                  &nbsp; Logout
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </div>
      <div>
        <SwipeableDrawer
          anchor="left"
          open={isOpen}
          onClose={(event) => toggleDrawer(event, false)}
          onOpen={(event) => toggleDrawer(event, true)}
        >
          <div
            role="presentation"
            onClick={(event) => toggleDrawer(event, false)}
            onKeyDown={(event) => toggleDrawer(event, false)}
            style={{ width: 270 }}
          >
            <List>
              <ListItem button onClick={openLink("/generate")}>
                <ListItemIcon>
                  <VpnKeyIcon />
                </ListItemIcon>
                <ListItemText primary="Generate Password" />
              </ListItem>
              <ListItem button onClick={openLink("/")}>
                <ListItemIcon>
                  <LockRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="My Passwords" />
              </ListItem>
              <ListItem button onClick={openLink("/notes")}>
                <ListItemIcon>
                  <NoteAddOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="My Notes" />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem button onClick={openLink("/profile")}>
                <ListItemIcon>
                  <AccountCircleRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItem>
              <ListItem button onClick={openLink("/backup")}>
                <ListItemIcon>
                  <SettingsBackupRestoreRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Backup Passwords" />
              </ListItem>
              <ListItem button onClick={openLink("/logout")}>
                <ListItemIcon>
                  <ExitToAppRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </List>
          </div>
        </SwipeableDrawer>
      </div>
    </>
  );
};

export default NavBar;
