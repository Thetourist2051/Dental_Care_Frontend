import { NavLink, Navigate, Outlet, matchPath, useLocation, useNavigate } from "react-router";
import style from "./ProtectedLayout.module.scss";
import { useAuth } from "../../context/auth-context/AuthContext";
import CustomLoader from "../../components/custom-loader/CustomLoader";
import { RouteConstant } from "../../utils/RouteConstant";
import { RouteInterface } from "../../utils/TypescriptEnum";
import { useEffect, useRef, useState } from "react";
import { GlobalService } from "../../services/global-service/GlobalService";
import { MenuItem } from "primereact/menuitem";
import { Menu } from "primereact/menu";
import { ImageUrls } from "../../utils/ImageUrls";

interface ProtectedLayoutProps {
  ProtectedRoutes: RouteInterface[];
}

const ProtectedLayout = ({ ProtectedRoutes }: ProtectedLayoutProps) => {
  const { isValidToken, Logout } = useAuth();
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState<RouteInterface | undefined>(undefined);
  const [userInfo, setUserInfo] = useState(GlobalService.userInfo.getValue());
  const navigate = useNavigate();
  const ProfileMenuRef = useRef<Menu>(null);

  const profileMenu: MenuItem[] = [
    {
      label: "Profile Action",
      items: [
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: () => Logout(),
        },
        {
          label: "Profile",
          icon: "pi pi-user",
          command: () => navigate(RouteConstant.Profilepage),
        },
      ],
    },
  ];

  useEffect(() => {
    console.log('In valid toekn', isValidToken,window.location.hostname)
    if (ProtectedRoutes && ProtectedRoutes?.length) {
      const currentModule = ProtectedRoutes.find((route) => matchPath(route.path, location.pathname));
      setCurrentRoute(currentModule);
    }
  }, [location.pathname, ProtectedRoutes]);

  useEffect(() => {
    const subscription = GlobalService.userInfo.subscribe((data) => setUserInfo(data));
    return () => subscription.unsubscribe();
  }, []);

  if (isValidToken === null) return <CustomLoader />;
  if (!isValidToken) return <Navigate to={RouteConstant.LoginPage} replace />;

  return (
    <>
      <Menu model={profileMenu} popup ref={ProfileMenuRef} closeOnEscape={true} id="ProfileMenu" />
      <div className={style["render-layout"]}>
        <div className={style["sidenav-section"] + " border-gray-400 border border-collapse"}>
          <div className={style.logo_section + " flex items-center p-4 transition border-b-1 border-gray-400 bg-lime-100 hover:bg-amber-600 text-slate-700 hover:text-white"}>
            <img src={ImageUrls.logo} className="h-12" alt="" />
            <h6 className="m-0 pl-2 text-lg transition ">Dental Care</h6>
          </div>
          <div className={style.nav_scroll_section + " bg-gray-50 p-2"}>
            {ProtectedRoutes.map((route: RouteInterface) => (
              <NavLink key={route.id} to={route.path} className={({ isActive }) => `${isActive ? " bg-amber-600 text-gray-100 hover:text-white hover:bg-amber-700" : "hover:bg-amber-100 hover:text-amber-700 "} ${style.nav_item} p-3 transition text-sm font-semibold rounded-lg mb-1 last:mb-0 relative`}>
                {({ isActive }) => (
                  <>
                    <i className={`${route.moduleicon} pr-2 ![text-xl]`}></i>
                    <span className="w-full">{route.modulename}</span>
                    {<i className={`pi pi-arrow-right text-sm! ${isActive ? style.active_arrow : style.hide_arrow}`}></i>}
                  </>
                )}
              </NavLink>
            ))}
          </div>
          <div className={style.logout_section + " cursor-pointer p-4 flex items-center justify-center transition border-t-1 border-gray-400 bg-lime-100 hover:bg-lime-200 text-slate-700 hover:text-slate-800"} onClick={Logout}>
            <i className="pi pi-power-off font-bold!"></i>
            <h6 className="pl-3 text-base m-0">Logout</h6>
          </div>
        </div>
        <div className={style.outlet_section}>
          <nav className={style.outlet_header + " py-4 px-3 md:p-4 xl:px-5 flex justify-between items-center bg-teal-500 hover:bg-teal-600 transition"}>
            <div className={style.outlet_heading}>
              <h5 className="text-base font-semibold m-0 text-gray-100 hover:text-white">{currentRoute?.modulename}</h5>
            </div>
            <div className="avatar_section">
              <div className={style.profile_avater + " transition hover:bg-amber-600 hover:text-white"} onClick={(event) => ProfileMenuRef && ProfileMenuRef.current && ProfileMenuRef.current.toggle(event)} aria-controls="ProfileMenu" aria-haspopup>
                <span className="text-lg text-white font-bold">{userInfo?.fullname[0]}</span>
              </div>
            </div>
          </nav>
          <div className={style.scrollable_section + "  transition-all p-3"}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProtectedLayout;