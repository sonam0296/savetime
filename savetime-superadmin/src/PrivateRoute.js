import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { USER_LOGIN } from "./redux/constants";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const isAuthenticated = () => {
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        dispatch(USER_LOGIN(""));
        return false;
      }
      return true;
    }
  };

  
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location },
              }}
            />
          )
        }
      />
    );
  
};

export default PrivateRoute;
