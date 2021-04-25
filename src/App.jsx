import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import { SnackbarProvider } from "notistack";

// Styles
import GlobalStyle from "./styles/GlobalStyle";

// Pages
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Logout from "./pages/Logout";

// Components
import SideBar from "./components/SideBar";

const App = (props) => {
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
            {props.isLoggedIn ? (
              <>
                <SideBar />
                <div
                  style={{
                    minHeight: "calc(100vh - 64px)",
                    backgroundColor: "white",
                  }}
                >
                  <Route path="/" exact>
                    <Home />
                  </Route>
                  <Route path="/profile" exact>
                    <Profile />
                  </Route>
                  <Route path="/logout" exact>
                    <Logout />
                  </Route>
                </div>
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
