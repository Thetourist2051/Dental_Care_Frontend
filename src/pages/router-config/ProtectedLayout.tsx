import { Navigate, Outlet } from "react-router";
import style from "./ProtectedLayout.module.scss";
import { useAuth } from "../../context/auth-context/AuthContext";
import CustomLoader from "../../components/custom-loader/CustomLoader";

const ProtectedLayout = () => {
  const { isValidToken } = useAuth();
  console.log("ProtectedLayout", isValidToken);

  if (isValidToken === null) {
    return (
      <>
        <CustomLoader />
      </>
    );
  }

  if (!isValidToken) {
    return <Navigate to="/login" replace />;
  }
  return (
    <>
      <div className={style["render-layout"]}>
        <div className={style["sidenav-section"] + " bg-amber-200"}></div>
        <div className={style["outlet-section"]}>
          <div
            className={style["scrollable-outlet-section"] + " bg-gray-100 p-3"}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProtectedLayout;
