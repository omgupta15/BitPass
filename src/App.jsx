import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { SnackbarProvider } from "notistack";

// Styles
import GlobalStyle from "./styles/GlobalStyle";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import GeneratePassword from "./pages/GeneratePassword";
import ChangePassword from "./pages/ChangePassword";
import Backup from "./pages/Backup";
import DeleteAccount from "./pages/DeleteAccount";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Restore from "./pages/Restore";
import Logout from "./pages/Logout";

// Components
import SideBar from "./components/SideBar";

const App = (props) => {
  const contentContainerStyle = {
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "white",
  };

  return (
    <SnackbarProvider maxSnack={1} autoHideDuration={1000}>
      <Router>
        <div className="App">
          <GlobalStyle />
          <Switch>
            <Route path="/login" exact>
              <Login />
            </Route>
            <Route path="/signup" exact>
              <SignUp />
            </Route>
            <Route path="/restore" exact>
              <Restore />
            </Route>
            {props.isLoggedIn ? (
              <>
                <Route path="/" exact>
                  <SideBar />
                  <div style={contentContainerStyle}>
                    <Home />
                  </div>
                </Route>
                <Route path="/profile" exact>
                  <SideBar />
                  <div style={contentContainerStyle}>
                    <Profile />
                  </div>
                </Route>
                <Route path="/generate" exact>
                  <GeneratePassword />
                </Route>
                <Route path="/backup" exact>
                  <Backup />
                </Route>
                <Route path="/change-password" exact>
                  <ChangePassword />
                </Route>
                <Route path="/delete-account" exact>
                  <DeleteAccount />
                </Route>
                <Route path="/logout" exact>
                  <Logout />
                </Route>
              </>
            ) : (
              <Route path="/">
                <Home />
              </Route>
            )}
          </Switch>
        </div>
      </Router>
    </SnackbarProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
