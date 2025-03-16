import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { RouteConstant } from "../../utils/RouteConstant";
import ProtectedLayout from "./ProtectedLayout";
import { v4 as uuidv4 } from "uuid";
import { AuthProvider } from "../../context/auth-context/AuthContext";
import { RouteInterface } from "../../utils/TypescriptEnum";
import CustomLoader from "../../components/custom-loader/CustomLoader";

const RouterConfig = () => {
  console.log("RouterConfig");
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
      moduleicon: " pi pi-history",
    },
  ];

  return (
    <AuthProvider>
      <BrowserRouter>
        <React.Suspense fallback={<CustomLoader />}>
          <Routes>
            {routes.map((route: RouteInterface) => (
              <Route key={route.id} path={route.path} element={route.element} />
            ))}
            <Route
              element={<ProtectedLayout ProtectedRoutes={ProtectedRoutes} />}
            >
              {ProtectedRoutes.map((route: RouteInterface) => (
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
