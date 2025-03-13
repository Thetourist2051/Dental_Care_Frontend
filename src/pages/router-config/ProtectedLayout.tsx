import { NavLink, Navigate, Outlet } from "react-router";
import style from "./ProtectedLayout.module.scss";
import { useAuth } from "../../context/auth-context/AuthContext";
import CustomLoader from "../../components/custom-loader/CustomLoader";
import { RouteConstant } from "../../utils/RouteConstant";
import { RouteInterface } from "../../utils/TypescriptEnum";

interface ProtectedLayoutProps {
  ProtectedRoutes: RouteInterface[];
}

const ProtectedLayout = ({ ProtectedRoutes }: ProtectedLayoutProps) => {
  const { isValidToken } = useAuth();

  if (isValidToken === null) {
    return <CustomLoader />;
  }

  if (!isValidToken) {
    return <Navigate to={RouteConstant.LoginPage} replace />;
  }

  return (
    <div className={style["render-layout"]}>
      <div className={style["sidenav-section"] + " bg-amber-100"}>
        {ProtectedRoutes.map((route: RouteInterface) => (
          <NavLink
            key={route.id}
            to={route.path}
            className={({ isActive }) =>
              `${isActive ? "active" : ""} ${style.nav_item} nav-class`
            }
          >
            {route.modulename}
          </NavLink>
        ))}
      </div>
      <div className={style["outlet-section"]}>
        <div className="outlet-header h-12 bg-blue-200"></div>
        <div className={style["scrollable-outlet-section"] + " bg-gray-100 p-3"}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;