import React from "react";

import async from "../components/Async";

import {
  BookOpen,
  Briefcase,
  Calendar as CalendarIcon,
  CheckSquare,
  CreditCard,
  Grid,
  Heart,
  Layout,
  List,
  Map,
  Monitor,
  ShoppingCart,
  PieChart,
  Sliders,
  User,
  Users
} from "react-feather";
import Event from "../pages/center/Event";
import RepeatAppoinment from "../Modal/RepeatAppoinment";
import EmergencyCancle from "../pages/client/EmergencyCancle";
import WorkersDetails from "../pages/center/WorkersDetails";
import WorkerLogin from "../pages/center/WorkerLogin";
import Clients from "../pages/center/Clients";
import CenterImage from "../pages/center-admin/CenterImage/CenterImage";
import TaxData from "../pages/center-admin/TaxData/TaxData";
import Login from "../pages/center-admin/Login/Login";
import PlanCenter from "../pages/center-admin/PlanCenter/PlanCenter";
import CenterPermission from "../pages/center-admin/CenterPermission/CenterPermission";
import Suggetion from "../pages/center/suggetion/Suggetion";
import AddPet from "../pages/client/AddPet/AddPet";
import CenterData from "../pages/center/CenterData/CenterData";
import ManagerCenterImages from "../pages/center/CenterData/ManagerCenterImages";
import TermsandCondition from "../pages/center/CompanyRules/TermsandCondition";
import PrivacyPolicy from "../pages/center/CompanyRules/PrivacyPolicy";
import Cookies from "../pages/center/CompanyRules/Cookies";


// Auth components
const SignIn = async(() => import("../pages/auth/SignIn"));
const Home = async(() => import("../pages/home/Home"))
const SignUp = async(() => import("../pages/auth/SignUp"));
const ResetPassword = async(() => import("../pages/auth/ResetPassword"));
const Otp = async(() => import("../pages/auth/Otp"))
const ChangePassword = async(() => import("../pages/auth/ChangePassword"))
const Page404 = async(() => import("../pages/auth/Page404"));
const Page500 = async(() => import("../pages/auth/Page500"));

// Client Components

const MainDashboard = async(() => import("../pages/client/MainDashboard"))
const UserProfile  = async(() => import("../pages/client/UserProfile"))
const Appointment = async(()=> import( "../Modal/Appointment"));

// Center Admin Component
const CenterAdminSignIn = async(() => import("../pages/auth/Center-Admin/SignIn"))
const CenterAdminSetPwd = async (() => import ("../pages/auth/Center-Admin/SetPassword"))
const CenterAdminDashboard = async (() => import ("../pages/center-admin/dashboard/Dashboard"))
const CenterAdminManageCenter = async (() => import ("../pages/center-admin/CenterManagement/CenterManagement"))
const CenterDatabase = async (() => import("../pages/center-admin/Database/centerDatabase"))
const CenterAdminWorker = async (() => import ("../pages/center-admin/CenterAdminWorker/centerAdminWorker"))
const CenterAdminEditWorker = async (() => import ("../pages/center-admin/CenterAdminWorker/EditWorker/editWorker"))
const CenterAdminServices = async (() => import ("../pages/center-admin/CenterAdminServices/centerAdminServices"))
const CenterAdminAddService = async(() => import("../pages/center/Service"))
const CenterAdminInterLeaved = async (() => import("../pages/center-admin/CenterAdminServices/interleavedservices/InterlevedService"))
const CenterAdminActionDates = async (() => import("../pages/center-admin/ActionDates/actionDates"))


// Center components
const CenterSignUp = async(() => import("../pages/center/CenterRegistration"))
const ActivateCenter = async(() => import("../pages/center/Activate"))
const CenterDetails = async(() => import("../pages/center/CenterDetails"))
const ScheduleCalendar = async(() => import("../pages/center/Calender"))
const Service = async(() => import("../pages/center/Service"))
const CenterMainPage  = async (()=> import("../pages/center/CenterMainPage"))
const EmergencyCancleCenter  = async (()=> import("../pages/center/EmergencyCancleCenter"))



// Components components
const Alerts = async(() => import("../pages/components/Alerts"));
const Avatars = async(() => import("../pages/components/Avatars"));
const Badges = async(() => import("../pages/components/Badges"));
const Buttons = async(() => import("../pages/components/Buttons"));
const Cards = async(() => import("../pages/components/Cards"));
const Chips = async(() => import("../pages/components/Chips"));
const Dialogs = async(() => import("../pages/components/Dialogs"));
const ExpPanels = async(() => import("../pages/components/ExpansionPanels"));
const Lists = async(() => import("../pages/components/Lists"));
const Menus = async(() => import("../pages/components/Menus"));
const Pagination = async(() => import("../pages/components/Pagination"));
const Progress = async(() => import("../pages/components/Progress"));
const Snackbars = async(() => import("../pages/components/Snackbars"));
const Tooltips = async(() => import("../pages/components/Tooltips"));

// Dashboards components
const Default = async(() => import("../pages/dashboards/Default"));
const Analytics = async(() => import("../pages/dashboards/Analytics"));

// Forms components
const Pickers = async(() => import("../pages/forms/Pickers"));
const SelectionCtrls = async(() => import("../pages/forms/SelectionControls"));
const Selects = async(() => import("../pages/forms/Selects"));
const TextFields = async(() => import("../pages/forms/TextFields"));
const Dropzone = async(() => import("../pages/forms/Dropzone"));
const Editors = async(() => import("../pages/forms/Editors"));

// Icons components
const MaterialIcons = async(() => import("../pages/icons/MaterialIcons"));
const FeatherIcons = async(() => import("../pages/icons/FeatherIcons"));

// Pages components
const Blank = async(() => import("../pages/pages/Blank"));
const InvoiceDetails = async(() => import("../pages/pages/InvoiceDetails"));
const InvoiceList = async(() => import("../pages/pages/InvoiceList"));
const Orders = async(() => import("../pages/pages/Orders"));
const Pricing = async(() => import("../pages/pages/Pricing"));
const Profile = async(() => import("../pages/pages/Profile"));
const Settings = async(() => import("../pages/pages/Settings"));
const Tasks = async(() => import("../pages/pages/Tasks"));
const Projects = async(() => import("../pages/pages/Projects"));
const Calendar = async(() => import("../pages/pages/Calendar"));
const ThemePage = async(() => import("../pages/auth/Uitheme"))


// Tables components
const SimpleTable = async(() => import("../pages/tables/SimpleTable"));
const AdvancedTable = async(() => import("../pages/tables/AdvancedTable"));

// Chart components
const Chartjs = async(() => import("../pages/charts/Chartjs"));

// Maps components
const GoogleMaps = async(() => import("../pages/maps/GoogleMaps"));
const VectorMaps = async(() => import("../pages/maps/VectorMaps"));

// Documentation
const Welcome = async(() => import("../pages/docs/Welcome"));
const GettingStarted = async(() => import("../pages/docs/GettingStarted"));
const EnvironmentVariables = async(() => import("../pages/docs/EnvironmentVariables"));
const Deployment = async(() => import("../pages/docs/Deployment"));
const Theming = async(() => import("../pages/docs/Theming"));
const StateManagement = async(() => import("../pages/docs/StateManagement"));
const Support = async(() => import("../pages/docs/Support"));
const Changelog = async(() => import("../pages/docs/Changelog"));
const Presentation = async(() => import("../pages/docs/Presentation"));

const dashboardsRoutes = {
  id: "Dashboard",
  path: "/dashboard",
  header: "Pages",
  icon: <Sliders />,
  containsHome: true,
  children: [
    {
      path: "/dashboard/default",
      name: "Default",
      component: Default
    },
    {
      path: "/dashboard/analytics",
      name: "Analytics",
      component: Analytics
    }
  ],
  component: null
};

const pagesRoutes = {
  id: "Pages",
  path: "/pages",
  icon: <Layout />,
  children: [
    {
      path: "/pages/settings",
      name: "Settings",
      component: Settings
    },
    {
      path: "/pages/pricing",
      name: "Pricing",
      component: Pricing
    },
    {
      path: "/pages/blank",
      name: "Blank Page",
      component: Blank
    }
  ],
  component: null
};

const profileRoutes = {
  id: "Profile",
  path: "/profile",
  icon: <User />,
  component: Profile,
  children: null
};

const projectsRoutes = {
  id: "Projects",
  path: "/projects",
  icon: <Briefcase />,
  badge: "8",
  component: Projects,
  children: null
};

const invoiceRoutes = {
  id: "Invoices",
  path: "/invoices",
  icon: <CreditCard />,
  children: [
    {
      path: "/invoices",
      name: "List",
      component: InvoiceList
    },
    {
      path: "/invoices/detail",
      name: "Details",
      component: InvoiceDetails
    }
  ],
  component: null
};

const orderRoutes = {
  id: "Orders",
  path: "/orders",
  icon: <ShoppingCart />,
  component: Orders,
  children: null
};

const tasksRoutes = {
  id: "Tasks",
  path: "/tasks",
  icon: <CheckSquare />,
  badge: "17",
  component: Tasks,
  children: null
};

const calendarRoutes = {
  id: "Calendar",
  path: "/calendar",
  icon: <CalendarIcon />,
  component: Calendar,
  children: null
};


const componentsRoutes = {
  id: "Components",
  path: "/components",
  header: "Elements",
  icon: <Grid />,
  children: [
    {
      path: "/components/alerts",
      name: "Alerts",
      component: Alerts
    },
    {
      path: "/components/avatars",
      name: "Avatars",
      component: Avatars
    },
    {
      path: "/components/badges",
      name: "Badges",
      component: Badges
    },
    {
      path: "/components/buttons",
      name: "Buttons",
      component: Buttons
    },
    {
      path: "/components/cards",
      name: "Cards",
      component: Cards
    },
    {
      path: "/components/chips",
      name: "Chips",
      component: Chips
    },
    {
      path: "/components/dialogs",
      name: "Dialogs",
      component: Dialogs
    },
    {
      path: "/components/expansion-panels",
      name: "Expansion Panels",
      component: ExpPanels
    },
    {
      path: "/components/lists",
      name: "Lists",
      component: Lists
    },
    {
      path: "/components/menus",
      name: "Menus",
      component: Menus
    },
    {
      path: "/components/pagination",
      name: "Pagination",
      component: Pagination
    },
    {
      path: "/components/progress",
      name: "Progress",
      component: Progress
    },
    {
      path: "/components/snackbars",
      name: "Snackbars",
      component: Snackbars
    },
    {
      path: "/components/tooltips",
      name: "Tooltips",
      component: Tooltips
    }
  ],
  component: null
};

const formsRoutes = {
  id: "Forms",
  path: "/forms",
  icon: <CheckSquare />,
  children: [
    {
      path: "/forms/pickers",
      name: "Pickers",
      component: Pickers
    },
    {
      path: "/forms/selection-controls",
      name: "Selection Controls",
      component: SelectionCtrls
    },
    {
      path: "/forms/selects",
      name: "Selects",
      component: Selects
    },
    {
      path: "/forms/text-fields",
      name: "Text Fields",
      component: TextFields
    },
    {
      path: "/forms/dropzone",
      name: "Dropzone",
      component: Dropzone
    },
    {
      path: "/forms/editors",
      name: "Editors",
      component: Editors
    }
  ],
  component: null
};

const tablesRoutes = {
  id: "Tables",
  path: "/tables",
  icon: <List />,
  children: [
    {
      path: "/tables/simple-table",
      name: "Simple Table",
      component: SimpleTable
    },
    {
      path: "/tables/advanced-table",
      name: "Advanced Table",
      component: AdvancedTable
    }
  ],
  component: null
};

const iconsRoutes = {
  id: "Icons",
  path: "/icons",
  icon: <Heart />,
  children: [
    {
      path: "/icons/material-icons",
      name: "Material Icons",
      component: MaterialIcons
    },
    {
      path: "/icons/feather-icons",
      name: "Feather Icons",
      component: FeatherIcons
    }
  ],
  component: null
};

const chartRoutes = {
  id: "Charts",
  path: "/charts",
  icon: <PieChart />,
  component: Chartjs,
  children: null
};

const mapsRoutes = {
  id: "Maps",
  path: "/maps",
  icon: <Map />,
  children: [
    {
      path: "/maps/google-maps",
      name: "Google Maps",
      component: GoogleMaps
    },
    {
      path: "/maps/vector-maps",
      name: "Vector Maps",
      component: VectorMaps
    }
  ],
  component: null
};

// const HomeRoute = {
//   id: "Home",
//   path: "/",
//   icon: <Monitor />,
//   component: SignIn, Home
//   children: null
// };
const HomeRoute = {
  id: "Home",
  path: "/",
  icon: <Monitor />,
  name: "Home",
  component: Home,
  children: null
};

const resetPasswordRoute = {
  id: "ResetPassword",
  path: "/reset-password",
  icon: <Monitor />,
  component: ResetPassword,
  children: null
};

const authRoutes = {
  id: "Auth",
  path: "/auth",
  icon: <Users />,
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn
    },
    {
      path: "/auth/sign-up",
      name: "Sign Up",
      component: SignUp
    },
    {
      path: "/auth/change-password",
      name: "Change Password",
      component: ChangePassword
    },
    {
      path: "/auth/reset-password",
      name: "Reset Password",
      component: ResetPassword
    },
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500
    },
    {
      path: "/auth/Otp",
      name: "Otp",
      component: Otp
    },
    {
      path: "/auth/theme",
      name: "Theme",
      component: ThemePage
    },
    {
      path: "/auth/center-signup",
      name: "Center",
      component: CenterSignUp
    },
  ],
  component: null
};

const centerRoutes = {
  id: "Center",
  path: "/center",
  icon: <Users />,
  children: [
    {
      path: "/center/worker/services",
      name: "Center",
      component: CenterAdminServices
    },
    {
      path: "/center/worker/action-dates",
      name: "Center",
      component: CenterAdminActionDates
    },
    {
      path: "/center/worker/workers",
      name: "Center",
      component: CenterAdminWorker
    },
    {
      path: "/center/worker/tax-data",
      name: "Center",
      component: TaxData
    },
     {
      path: "/center/worker/events",
      name: "Center",
      component: Event
    },
     {
      path: "/center/worker/emergencycancle",
      name: "Center",
      component: EmergencyCancleCenter
    },
    {
      path: "/center/worker/centerImage",
      name: "Center",
      component: CenterImage
    },
    {
      path: "/center/centerImage",
      name: "Center",
      component: CenterImage
    },
    {
      path: "/center/worker/clients",
      name: "Center",
      component: Clients
    },
    {
      path: "/center/worker/plan",
      name: "Center",
      component: PlanCenter
    },
    {
      path: "/center/worker/center-details",
      name: "Center",
      component: CenterDetails
    },
    {
      path:"/center/worker/center-management",
      name: "Center",
      component: CenterAdminManageCenter
    },
    {
      path: "/center/admin-login",
      name: "Center",
      component: CenterAdminSignIn
    },
    {
      path:"/center/admin/center-management",
      name: "Center",
      component: CenterAdminManageCenter
    },
    {
      path: "/center/centerAdminPassword/:id",
      name: "Center",
      component: CenterAdminSetPwd
    },
    {
      path: "/center/admin/dashboard",
      name: "Center",
      component: CenterAdminDashboard
    },
    {
      path: "/center/admin/center-details",
      name: "Center",
      component: CenterDetails
    },
    {
      path: "/center/admin/center-database",
      name: "Center",
      component: CenterDatabase
    },
    {
      path: "/center/admin/action-dates",
      name: "Center",
      component: CenterAdminActionDates
    },
    {
      path: "/center/admin/events",
      name: "Center",
      component: Event
    },
    {
      path: "/center/admin/workers",
      name: "Center",
      component: CenterAdminWorker
    },
    {
      path: "/center/admin/workers/update",
      name: "Center",
      component: CenterAdminEditWorker
    },
    {
      path: "/center/admin/services",
      name: "Center",
      component: CenterAdminServices
    },
    {
      path: "/center/admin/services/create",
      name: "Center",
      component: CenterAdminAddService
    },
    {
      path: "/center/admin/services/interleave",
      name: "Center",
      component: CenterAdminInterLeaved
    },
    {
      path: "/center/admin/servicescustomcalendar/:type",
      name: "Calendar",
      component: ScheduleCalendar
    },
    {
      path: "/center/admin/tax-data",
      name: "Center",
      component: TaxData
    },
    {
      path: "/center/admin/centerImage",
      name: "Center",
      component: CenterImage
    },
    {
      path: "/center/admin/clients",
      name: "Center",
      component: Clients
    },
    {
      path: "/center/admin/permission",
      name: "Center",
      component: CenterPermission
    },
    {
      path: "/center/admin/plan",
      name: "Center",
      component: PlanCenter
    },
    {
      path: "/center/admin/emergencycancle",
      name: "Center",
      component: EmergencyCancleCenter
    },
    {
      path: "/center/admin/login",
      name: "Center",
      component: Login
      
    },
    // {
    //   path: "/center/center-signup",
    //   name: "Center",
    //   component: CenterSignUp
    // },

    {
      path: "/activate/:token",
      name: "Activate",
      component: ActivateCenter
    },
    {
      path: "/center/center-details",
      name: "Center Details",
      component: CenterDetails
    },
    {
      path: "/customcalendar/:type",
      name: "Calendar",
      component: ScheduleCalendar
    },
    {
      path: "/center/services",
      name: "Service",
      component: Service
    },
    {
      path: "/center/main-page",
      name: "Main-Page",
      component:CenterMainPage
    },
    {
      path: "/center/events",
      name: "Event",
      component: Event
    
    },
    {
      path: "/center/emergencycancle",
      name: "EmergencyCancleCenter",
      component: EmergencyCancleCenter
    
    },
    {
      path: "/center/workersdetails",
      name: "WorkersDetails",
      component: WorkersDetails
    
    },
    {
      path: "/center/workerlogin",
      name: "WorkerLogin",
      component: WorkerLogin
    
    },
    {
      path: "/center/clients",
      name: "Clients",
      component: Clients
    
    },
    {
      path: "/center/suggetions",
      name: "Suggetion",
      component: Suggetion    
    },
    {
      path: "/center/centerData",
      name: "CenterData",
      component: CenterData    
    },
    {
      path: "/center/centerDataManager",
      name: "ManagerCenterImages",
      component: ManagerCenterImages    
    },
    {
      path: "/centers/:centertype",
      name: "Appointment",
      component: Appointment    
    },
    {
      path: "/center/cookies",
      name: "Cookies",
      component: Cookies    
    },
    {
      path: "/center/termsandconditions",
      name: "TermsandCondition",
      component: TermsandCondition    
    },
    {
      path: "/center/privacypolicy",
      name: "PrivacyPolicy",
      component: PrivacyPolicy    
    },
   

  ],
  component: null
}

const clientsRoutes = {
  id: "client",
  path: "/client",
  icon: <Users />,
  children: [
    {
      path: "/client/maindashboard",
      name: "Maindashboard",
      component: MainDashboard
    },
    {
    path: "/client/profile-update",
    name: "UserProfile",
    component:UserProfile
    },
    {
      path: "/client/appointment",
      name: "Appointment",
      component: Appointment
    },
    {
      path: "/client/repeatAppoinment",
      name: "RepeatAppointment",
      component: RepeatAppoinment
    },
    {
      path: "/client/emergencyCancle",
      name: "EmergencyCancle",
      component: EmergencyCancle
    },
    {
      path: "/client/add-pet",
      name: "AddPet",
      component: AddPet
    },
  ]

}




const documentationRoutes = {
  id: "Documentation",
  path: "/documentation",
  icon: <BookOpen />,
  children: [
    {
      path: "/documentation/welcome",
      name: "Welcome",
      component: Welcome
    },
    {
      path: "/documentation/getting-started",
      name: "Getting Started",
      component: GettingStarted
    },
    {
      path: "/documentation/environment-variables",
      name: "Environment Variables",
      component: EnvironmentVariables
    },
    {
      path: "/documentation/deployment",
      name: "Deployment",
      component: Deployment
    },
    {
      path: "/documentation/theming",
      name: "Theming",
      component: Theming
    },
    {
      path: "/documentation/state-management",
      name: "State Management",
      component: StateManagement
    },
    {
      path: "/documentation/support",
      name: "Support",
      component: Support
    },
  ],
  component: null
};

const changelogRoutes = {
  id: "Changelog",
  path: "/changelog",
  badge: "v1.2.0",
  icon: <List />,
  component: Changelog,
  children: null
};

// This route is not visisble in the sidebar
const privateRoutes = {
  id: "Private",
  path: "/private",
  component: Blank,
  children: null,
};

// Routes using the Dashboard layout
export const dashboardLayoutRoutes = [
  dashboardsRoutes,
  pagesRoutes,
  profileRoutes,
  projectsRoutes,
  orderRoutes,
  invoiceRoutes,
  tasksRoutes,
  calendarRoutes,
  componentsRoutes,
  chartRoutes,
  formsRoutes,
  tablesRoutes,
  iconsRoutes,
  mapsRoutes,
  documentationRoutes,
  changelogRoutes,
  // presentationRoutes,
  privateRoutes
];

// Routes using the Auth layout
export const authLayoutRoutes = [HomeRoute, authRoutes,resetPasswordRoute, centerRoutes, clientsRoutes];
export const homeLayoutRoutes = [HomeRoute,authRoutes,resetPasswordRoute,clientsRoutes,centerRoutes];
// Routes visible in the sidebar
export const sidebarRoutes = [
  dashboardsRoutes,
  pagesRoutes,
  profileRoutes,
  projectsRoutes,
  orderRoutes,
  invoiceRoutes,
  tasksRoutes,
  calendarRoutes,
  authRoutes,
  componentsRoutes,
  chartRoutes,
  formsRoutes,
  tablesRoutes,
  iconsRoutes,
  mapsRoutes,
  HomeRoute,
  // presentationRoutes,
  documentationRoutes,
  changelogRoutes
];
