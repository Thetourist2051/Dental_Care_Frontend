import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { RouteConstant } from "../../utils/RouteConstant";
import ProtectedLayout from "./ProtectedLayout";
import { v4 as uuidv4 } from "uuid";
import { RouteInterface } from "../../utils/TypescriptEnum";
import CustomLoader from "../../components/custom-loader/CustomLoader";
import AxiosService from "../../services/axios-service/AxiosService";
import { ApiEndpoints, UserAuthConfig } from "../../utils/ApiEndpoints";
import {
  getAuthToken,
  removeAuthToken,
} from "../../services/cookie-service/CookieService";
import { useLoginPageStore } from "../../store/login-page-store/useLoginPageStore";

const RouterConfig = () => {
  console.log("in router");
  const DefaultPageCompoment = React.lazy(
    () => import("../default-page/DefaultPage")
  );
  const LoginPageComponent = React.lazy(
    () => import("../login-page/LoginPage")
  );
  const SignupPageComponent = React.lazy(
    () => import("../signup-page/SignupPage")
  );
  const PageNotFoundComponent = React.lazy(
    () => import("../page-not-found/PageNotFound")
  );
  const AllUsers = React.lazy(() => import("../all-users/AllUsers"));
  const BookAppoinments = React.lazy(
    () => import("../book-appoinments/BookAppoinments")
  );
  // const BookingHistory = React.lazy(
  //   () => import("../booking-history/BookingHistory")
  // );
  const ProfilePage = React.lazy(() => import("../profile-page/ProfilePage"));

  const axios = new AxiosService();
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const {setUserInfo, userInfo} = useLoginPageStore()

  const fetchProfile = async () => {
    try {
      const res = await axios.getRequest(
        ApiEndpoints.FetchProfile,
        UserAuthConfig
      );
      if (res.state === 1) {
        setUserInfo(res?.data)
        setIsAuthenticated(true);
      } else {
        setUserInfo(null);
        setIsAuthenticated(false);
        removeAuthToken();
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setUserInfo(null);
      setIsAuthenticated(false);
      removeAuthToken();
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      fetchProfile();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <CustomLoader />;
  }

  const routes: RouteInterface[] = [
    {
      path: RouteConstant.DefaultPage,
      element: <DefaultPageCompoment />,
      id: uuidv4(),
      accessRole: ["admin", "user"],
    },
    {
      path: RouteConstant.LoginPage,
      element: <LoginPageComponent />,
      id: uuidv4(),
      accessRole: ["admin", "user"],
    },
    {
      path: RouteConstant.SignupPage,
      element: <SignupPageComponent />,
      id: uuidv4(),
      accessRole: ["admin", "user"],
    },
    {
      path: "*",
      element: <PageNotFoundComponent />,
      id: uuidv4(),
      accessRole: ["admin", "user"],
    },
  ];

  const ProtectedRoutes: any[] = [
    {
      path: RouteConstant.AllUsers,
      element: <AllUsers />,
      modulename: "All Users",
      id: uuidv4(),
      moduleicon: "pi pi-users",
      accessRole: ["admin"],
    },
    {
      path: RouteConstant.Appoinments,
      element: <BookAppoinments />,
      modulename: "Appoinments",
      id: uuidv4(),
      moduleicon: "pi pi-plus-circle",
      accessRole: ["admin", "user"],
    },
    // {
    //   path: RouteConstant.BookingHistory,
    //   element: <BookingHistory />,
    //   modulename: "Booking History",
    //   id: uuidv4(),
    //   moduleicon: "pi pi-history",
    //   accessRole: ["admin", "user"],
    // },
    {
      path: RouteConstant.Profilepage,
      element: <ProfilePage />,
      modulename: "Profile",
      id: uuidv4(),
      moduleicon: "pi pi-user",
      accessRole: ["admin", "user"],
    },
  ];

  return (
    <BrowserRouter>
      <React.Suspense fallback={<CustomLoader />}>
        <Routes>
          {routes.map((route) => (
            <Route key={route.id} path={route.path} element={route.element} />
          ))}
          <Route
            element={
              userInfo ? (
                <ProtectedLayout
                  userInfo={userInfo}
                  ProtectedRoutes={ProtectedRoutes}
                />
              ) : (
                <>
                  <Navigate to={RouteConstant.LoginPage} replace />
                </>
              )
            }
          >
            {ProtectedRoutes.map((route) => (
              <Route key={route.id} path={route.path} element={route.element} />
            ))}
          </Route>
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default RouterConfig;
