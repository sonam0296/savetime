import React from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import {
  dashboardLayoutRoutes,
  authLayoutRoutes,
  adminLayoutRoutes,
} from "./index";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import DashboardLayout from "../layouts/Dashboard";
import AuthLayout from "../layouts/Auth";
import { useSelector } from "react-redux";
import Login from "../admin/Login/Login";
import Dashboard from "../layouts/Dashboard";
import AdminDashboard from "../admin/Dashboard/AdminDashboard";

const childRoutes = (Layout, routes,IsAuthenticated) => {
  return routes.map(({ children, path, component: Component }, index) =>
    children ? (
      // Route item with children
      children.map(({ path, component: Component }, index) => {
        return(
        <>
          <Route
            key={index}
            path={path}
            exact
            render={(props) => (IsAuthenticated ?
              <>
                <Layout>
                  <Component {...props} />
                </Layout>
              </>
              :
              <>
              <Layout>
                <Login {...props} />
              </Layout>
            </>
            )}
          />
        </>
      )})
    ) : (
      // Route item without children
      <>
        <Route
          key={index}
          path={path}
          exact
          render={(props) => (IsAuthenticated ?
            <>
              <Layout>
                <Component {...props} />
              </Layout>
            </>
            :
            <>
            <Layout>
              <Login {...props} />
            </Layout>
          </>
          )}
        />

      </>
    )
  );
};

const Routes = () => {
  const token = useSelector((state) => state.token);
  const IsAuthenticated = token && token.length > 0 ? true : false;

  console.log(IsAuthenticated);
  return (
    <>
      <Router>
        <Switch>
          <ToastProvider>
            {IsAuthenticated
              ? childRoutes(AuthLayout, adminLayoutRoutes,IsAuthenticated)
              : childRoutes(AuthLayout, authLayoutRoutes,IsAuthenticated)}
           <Route path="**" exact={true} component={!IsAuthenticated && Login} />

            {/* <Route
          render={() => (
            <AuthLayout>
              <Page404 />
            </AuthLayout>
          )}
        /> */}
          </ToastProvider>
        </Switch>
      </Router>
    </>
  );
};

export default Routes;
