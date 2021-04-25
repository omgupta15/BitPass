import React, { useEffect } from "react";
import { connect } from "react-redux";

// Actions
import { logout } from "../redux/user/userActions";

const Logout = (props) => {
  useEffect(() => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("passwordHash");
    props.logout();
  }, []);

  return <></>;
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
