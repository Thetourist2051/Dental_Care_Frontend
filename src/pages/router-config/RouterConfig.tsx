import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { RouteConstant } from "../../utils/RouteConstant";
import ProtectedLayout from "./ProtectedLayout";
import { v4 as uuidv4 } from "uuid";
import { RouteInterface } from "../../utils/TypescriptEnum";
import CustomLoader from "../../components/custom-loader/CustomLoader";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/redux-store/appstore";
import AxiosService from "../../services/axios-service/AxiosService";
import { ApiEndpoints, UserAuthConfig } from "../../utils/ApiEndpoints";
import { adduser } from "../../utils/redux-store/userslice";
import { getAuthToken, removeAuthToken } from "../../services/cookie-service/CookieService";

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
  const BookingHistory = React.lazy(
    () => import("../booking-history/BookingHistory")
  );

  const axios = new AxiosService();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);


  const fetchProfile = async () => {
    try {
      const res = await axios.getRequest(ApiEndpoints.FetchProfile, UserAuthConfig);
      if (res.state === 1) {
        dispatch(adduser(res.data));
        setIsAuthenticated(true);
      } else {
        dispatch(adduser(null));
        setIsAuthenticated(false);
        removeAuthToken();
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      dispatch(adduser(null));
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
    },
    {
      path: RouteConstant.LoginPage,
      element: <LoginPageComponent />,
      id: uuidv4(),
    },
    {
      path: RouteConstant.SignupPage,
      element: <SignupPageComponent />,
      id: uuidv4(),
    },
    { path: "*", element: <PageNotFoundComponent />, id: uuidv4() },
  ];

  const ProtectedRoutes: RouteInterface[] = [
    {
      path: RouteConstant.AllUsers,
      element: <AllUsers />,
      modulename: "All Users",
      id: uuidv4(),
      moduleicon: "pi pi-users",
    },
    {
      path: RouteConstant.BookAppoinments,
      element: <BookAppoinments />,
      modulename: "Book Appoinments",
      id: uuidv4(),
      moduleicon: "pi pi-plus-circle",
    },
    {
      path: RouteConstant.BookingHistory,
      element: <BookingHistory />,
      modulename: "Booking History",
      id: uuidv4(),
      moduleicon: "pi pi-history",
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
               user ? (
                <ProtectedLayout
                  userInfo={user}
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
