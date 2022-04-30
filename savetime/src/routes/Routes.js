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
  homeLayoutRoutes,
} from "./index";
import { ToastProvider, useToasts } from "react-toast-notifications";
import { ToastContainer, toast } from "react-toastify";
//Book appointment component
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "../layouts/Dashboard";
import AuthLayout from "../layouts/Auth";
import Page404 from "../pages/auth/Page404";
import { useSelector } from "react-redux";
import Home from "../pages/home/Home";
import SignIn from "../pages/auth/SignIn";
import CenterDetails from "../pages/center/CenterDetails";

const childRoutes = (Layout, routes, IsAuthenticated, ActiveAdmin,workerLoginStatus,workerPermissions) =>
  routes.map(({ children, path, component: Component }, index) =>
    children ? (
      // Route item with children
      children.map(({ path, component: Component }, index) => {
        {
          console.log(path, "path");
          console.log("enter1");
          console.log(workerPermissions, "workerPermissions");
          console.log(workerLoginStatus, "workerLoginStatus");
        }
        return (
          <>
            <Route
              key={index}
              path={path}
              exact
              render={(props) =>
                IsAuthenticated == true && (path == "/center/centerDataManager" ||
                path == "/center/centerData" ||
                path == "/center/suggetions" || 
                path == "/center/clients" || 
                path == "/center/workerlogin" || 
                path == "/center/workersdetails" || 
                path == "/center/emergencycancle" || 
                path == "/center/events" ||
                path == "/center/main-page" ||
                path == "/center/services" ||
                path == "/customcalendar/:type" || 
                path == "/center/center-details" ||
                path == "/activate/:token" ||
                path == "/client/maindashboard" ||
                path == "/client/profile-update" || 
                path == "/client/appointment" ||
                path == "/client/repeatAppoinment" ||
                path == "/client/emergencyCancle" || 
                path == "/client/add-pet" || 
                path == "/center/centerImage"||
                path == "/center/admin-login"||
                path == "/center/admin/login") ? (
                  <>
                    <Layout>
                      <Component {...props} />
                    </Layout>
                  </>
                ) : ActiveAdmin == true &&
                 (path == "/center/admin/login" ||
                path == "/center/admin/emergencycancle" ||
                path == "/center/admin/plan" ||
                path == "/center/admin/permission" || 
                path == "/center/admin/clients" ||
                path == "/center/admin/centerImage" ||
                path == "/center/admin/tax-data" ||
                path == "/center/admin/servicescustomcalendar/:type" ||
                path == "/center/admin/services/interleave"||
                path == "/center/admin/services/create" ||
                path == "/center/admin/services" || 
                path == "/center/admin/workers/update" ||
                path == "/center/admin/workers" ||
                path == "/center/admin/events" ||
                path == "/center/admin/action-dates" ||
                path == "/center/admin/center-database" ||
                path == "/center/admin/center-details" || 
                path == "/center/admin/dashboard" ||
                path == "/center/centerAdminPassword/:id" ||
                path == "/center/admin/center-management" ||
                path == "/center/admin-login")  ? (
                  <Layout>
                    <Component {...props} />
                  </Layout>
                ) : path == "/center/admin/login" ||
                path == "/center/admin/emergencycancle" ||
                path == "/center/admin/plan" ||
                path == "/center/admin/permission" || 
                path == "/center/admin/clients" ||
                path == "/center/admin/centerImage" ||
                path == "/center/admin/tax-data" ||
                path == "/center/admin/servicescustomcalendar/:type" ||
                path == "/center/admin/services/interleave"||
                path == "/center/admin/services/create" ||
                path == "/center/admin/services" || 
                path == "/center/admin/workers/update" ||
                path == "/center/admin/workers" ||
                path == "/center/admin/events" ||
                path == "/center/admin/action-dates" ||
                path == "/center/admin/center-database" ||
                path == "/center/admin/center-details" || 
                path == "/center/admin/dashboard" ||
                path == "/center/centerAdminPassword/:id" ||
                path == "/center/admin/center-management" ||
                path == "/center/admin-login"  ? (
                  <>
                   <Redirect to="/center/center-details" />
                  </>
      
                ) : workerLoginStatus!=undefined && workerLoginStatus == true && workerPermissions !=undefined ?(
                Object.keys(workerPermissions).forEach((data) => "accessTOAdmin"==data && workerPermissions[data]==true)  && 
                (path=="/center/admin-login") ?
                (
                  <>
                  <Layout>
                    <Component {...props} />
                  </Layout>
                  </>
                ) : Object.keys(workerPermissions).forEach((data) => "actualSubscription"==data && workerPermissions[data]==true) &&
                 (path=="/center/worker/plan") ? (
                  <Layout>
                  <Component {...props} />
                </Layout>
                ):Object.keys(workerPermissions).forEach((data) => "centerData"==data && workerPermissions[data]==true) && 
                (path=="/center/worker/center-details") ? (
                  <Layout>
                  <Component {...props} />
                </Layout>
                ) : Object.keys(workerPermissions).forEach((data) => "centerImages"==data && workerPermissions[data]==true) && 
                (path=="/center/worker/centerImage") ? (
                  <Layout>
                  <Component {...props} />
                </Layout>
                ): Object.keys(workerPermissions).forEach((data) => "clientFile"==data && workerPermissions[data]==true) && 
                (path=="/center/worker/clients") ? (
                  <Layout>
                  <Component {...props} />
                </Layout>
                ): Object.keys(workerPermissions).forEach((data) => "dayManagement"==data && workerPermissions[data]==true) && 
                (path=="/center/worker/events") ? (
                  <Layout>
                  <Component {...props} />
                </Layout>
                ) :
                Object.keys(workerPermissions).forEach((data) => "emergencyCancellation"==data && workerPermissions[data]==true) && 
                (path=="/center/worker/emergencycancle") ? (
                  <Layout>
                  <Component {...props} />
                </Layout>
                ):
                Object.keys(workerPermissions).forEach((data) => "fiscalData"==data && workerPermissions[data]==true) && 
                (path=="/center/worker/tax-data") ? (
                  <Layout>
                  <Component {...props} />
                </Layout>
                ):
                Object.keys(workerPermissions).forEach((data) => "moreCenters"==data && workerPermissions[data]==true) && 
                (path=="/center/worker/center-management") ? (
                  <Layout>
                  <Component {...props} />
                </Layout>
                ) :
                Object.keys(workerPermissions).forEach((data) => "permissionToWorkers"==data && workerPermissions[data]==true) && 
                (path=="/center/worker/workers") ? (
                  <Layout>
                  <Component {...props} />
                </Layout>
                ) :
                Object.keys(workerPermissions).forEach((data) => "registryOfInternalActions"==data && workerPermissions[data]==true) && 
                (path=="/center/worker/action-dates") ? (
                  <Layout>
                  <Component {...props} />
                </Layout>
                ) :
                Object.keys(workerPermissions).forEach((data) => "Services"==data && workerPermissions[data]==true) && 
                (path=="/center/worker/services") && (
                  <Layout>
                  <Component {...props} />
                </Layout>
                )
                // :(
                //   <>
                //   </>
                // //   <Layout>
                // //   <Component {...props} />
                // // </Layout>
                // )
                ) :
                  (path=="/center/worker/services" ||
                  path=="/center/worker/action-dates" ||
                  path=="/center/worker/workers" ||
                  path=="/center/worker/center-management"||
                  path=="/center/worker/tax-data"||
                  path=="/center/worker/emergencycancle" ||
                  path=="/center/worker/events" ||
                  path=="/center/worker/clients" ||
                  path=="/center/worker/centerImage" ||
                  path=="/center/worker/center-details" ||
                  path=="/center/worker/plan" ||
                  path=="/center/admin-login" )?(
                    <>
                   <Redirect to="/center/workersdetails" />
                  </>
                  
                ): path === "/auth/sign-in" ||
                  path === "/auth/sign-up" ||
                  path === "/auth/change-password" ||
                  path === "/auth/reset-password" ||
                  path === "/auth/Otp" ||
                  path === "/auth/404" ||
                  path === "/auth/500" ||
                  path === "/auth/center-signup" ||
                  path === "/client/maindashboard" ||
                  path == "/centers/:centertype" ||
                  path === "/client/appointment" ||
                  path === "/center/cookies" ||
                  path === "/center/termsandconditions" ||
                  path == "/center/privacypolicy" ? (
                  <>
                    <Layout>
                      <Component {...props} />
                    </Layout>
                  </>
                ) : (
                  <>
                    <Redirect to="/" />
                    {/* <Layout>
                      <Home {...props} />
                    </Layout> */}
                  </>
                )
                  
                  }
                  
              
            />
          </>
        );
      })
    ) : (
      <>
        {/* // Route item without children */}

        <Route
          key={index}
          path={path}
          exact
          render={(props) =>
            IsAuthenticated == true ? (
              <>
                <Layout>
                  <Component {...props} />
                </Layout>
              </>
            ) : path === "/reset-password" ? (
              <>
                <Layout>
                  <Component {...props} />
                </Layout>
              </>
            ) : (
              <>
                {/* <Redirect
              to="/"
            /> */}
                <Layout>
                  <Home {...props} />
                </Layout>
              </>
            )
          }
        />
      </>
    )
  );

const Routes = () => {
  const token = useSelector((state) => state.token);
  const ActiveAdmin = useSelector(
    (state) => state?.selectedLoginCenter?.isActive
  );

  const logincenterToken = useSelector(
    (state) => state.selectedLoginCenter.token
  );
  const workerLoginStatus = useSelector(
    (state) => state.workerLoginStatus
  );
  const workerPermissions = useSelector(
    (state) => state.selectedLoginCenter.permissions
  );
  const IsAuthenticated = () => {
    if (token || logincenterToken) {
      if (token.length > 0) {
        return true;
      } else if (logincenterToken.length > 0) {
        return true;
      } else return false;
    } else {
      return false;
    }
  };
  console.log(IsAuthenticated(), "auth");
  console.log(!IsAuthenticated(), "auth");
  console.log(ActiveAdmin, "Activeadmin");
  return (
    <>
      <Router>
        <Switch>
          {/* <Route exact to="/book-appointment">
        <Appointment2/>
      </Route> */}
          <ToastProvider>
            {/* {IsAuthenticated() ? ( */}
            <>
              {" "}
              {
                (childRoutes(
                  DashboardLayout,
                  dashboardLayoutRoutes,
                  IsAuthenticated(),
                  ActiveAdmin,
                  workerLoginStatus,
                  workerPermissions
                ),
                childRoutes(
                  AuthLayout,
                  authLayoutRoutes,
                  IsAuthenticated(),
                  ActiveAdmin,
                  workerLoginStatus,
                  workerPermissions
                ))
              }{" "}
            </>
            {/* ) : (
              childRoutes(
                AuthLayout,
                homeLayoutRoutes,
                IsAuthenticated(),
                ActiveAdmin
              )
            )} */}
            {/* <Route path="**" exact={true} component={!IsAuthenticated() && Home} /> */}
            {/* {childRoutes(
              DashboardLayout,
              dashboardLayoutRoutes,
              IsAuthenticated
            )}
            {childRoutes(AuthLayout, authLayoutRoutes, IsAuthenticated)} */}
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
