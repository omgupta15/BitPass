import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect } from "react-redux";

const Home = (props) => {
  const history = useHistory();

  useEffect(() => {});

  return <>{!props.isLoggedIn ? history.push("/login") : "Home"}</>;
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
