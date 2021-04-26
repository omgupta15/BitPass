import React, { useEffect } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";

// Actions
import { logout } from "../redux/user/userActions";

const Logout = (props) => {
  const history = useHistory();

  useEffect(() => {
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("passwordHash");
    props.logout();
    history.push("/login");
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
