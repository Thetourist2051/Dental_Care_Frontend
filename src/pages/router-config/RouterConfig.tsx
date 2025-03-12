import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { RouteConstant } from "../../utils/RouteConstant";
import CustomLoader from "../../components/custom-loader/CustomLoader";
import ProtectedLayout from "./ProtectedLayout";
import BookAppoinments from "../book-appoinments/BookAppoinments";
import { v4 as uuidv4 } from "uuid";
import AllUsers from "../all-users/AllUsers";
import { AuthProvider } from "../../context/auth-context/AuthContext";
import BookingHistory from "../booking-history/BookingHistory";

interface Route {
  path: string;
  element: React.ReactNode;
  id?: any;
}

const RouterConfig = () => {
  console.log("RouterConfig");
  const DefaultPageCompoment = React.lazy(() => {
    return import("../default-page/DefaultPage");
  });

  const LoginPageComponent = React.lazy(() => {
    return import("../login-page/LoginPage");
  });

  const SignupPageComponent = React.lazy(() => {
    return import("../signup-page/SignupPage");
  });
  const PageNotFoundComponent = React.lazy(() => {
    return import("../page-not-found/PageNotFound");
  });

  const routes: Route[] = [
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
    {
      path: "*",
      element: <PageNotFoundComponent />,
      id: uuidv4(),
    },
  ];

  const ProtectedRoutes: Route[] = [
    {
      path: RouteConstant.AllUsers,
      element: <AllUsers />,
      id: uuidv4(),
    },
    {
      path: RouteConstant.BookAppoinments,
      element: <BookAppoinments />,
      id: uuidv4(),
    },
    {
      path: RouteConstant.BookAppoinments,
      element: <BookAppoinments />,
      id: uuidv4(),
    },
    {
      path: RouteConstant.BookAppoinments,
      element: <BookingHistory />,
      id: uuidv4(),
    },
  ];

  return (
    <AuthProvider>
      <BrowserRouter>
        <React.Suspense fallback={<CustomLoader />}>
          <Routes>
            {routes.map((route: Route) => (
              <Route key={route.id} path={route.path} element={route.element} />
            ))}
            <Route element={<ProtectedLayout />}>
              {ProtectedRoutes.map((route: Route) => (
                <Route
                  key={route.id}
                  path={route.path}
                  element={route.element}
                />
              ))}
            </Route>
          </Routes>
        </React.Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default RouterConfig;
