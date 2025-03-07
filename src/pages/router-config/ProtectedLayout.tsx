import { Outlet } from "react-router";
import style from "./ProtectedLayout.module.scss";
type Props = {};

const ProtectedLayout = (props: Props) => {
  console.log(props)
  return (
    <>
      <div className={style["render-layout"]}>
        <div className={style["sidenav-section"]}>
          
        </div>
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
