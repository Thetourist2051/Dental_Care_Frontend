import style from "./PageHeader.module.scss";
import { ImageUrls } from "../../utils/ImageUrls";
import { useEffect, useRef, useState } from "react";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useNavigate } from "react-router";
import { RouteConstant } from "../../utils/RouteConstant";
import { TypescriptEnum } from "../../utils/TypescriptEnum";
import { GlobalService } from "../../services/global-service/GlobalService";
// import { useAuth } from "../../context/auth-context/AuthContext";

const PageHeader = () => {
  const [activeTab, setActiveTab] =
    useState<TypescriptEnum["TabTypes"]>("Home");
  const LoginMenu = useRef<Menu>(null);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(GlobalService.userInfo.getValue());
  const  Logout  = ()=>{
    console.log('in logout section')
  }
  const [profileActions, setProfileActions] = useState<MenuItem[]>([]);

  const CommonItem = [
    {
      label: "Book Appointments",
      icon: "pi pi-plus",
      command: () => {
        navigate(RouteConstant.BookAppoinments, { replace: true });
      },
    },
  ];
  const LoginItem = [
    {
      label: "Login",
      icon: "pi pi-sign-in",
      command: () => {
        navigate(RouteConstant.LoginPage, { replace: true });
      },
    },
  ];

  const LogoutItem = [
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => {
        Logout();
      },
    },
    {
      label: "Profile",
      icon: "pi pi-user",
      command: () => {
        navigate(RouteConstant.Profilepage);
      },
    },
  ];

  useEffect(() => {
    const subscription = GlobalService.userInfo.subscribe((data) => {
      setUserInfo(data);
      if (data) {
        setProfileActions([
          {
            label: "Options",
            items: [...LogoutItem, ...CommonItem],
          },
        ]);
      } else {
        setProfileActions([
          {
            label: "Options",
            items: [...LoginItem, ...CommonItem],
          },
        ]);
      }
    });
    console.log("UserInfo", userInfo);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <Menu
        model={profileActions}
        popup
        ref={LoginMenu}
        closeOnEscape={true}
        id="LoginMenu"
      />
      <div className={style["top_header"] + " w-full"}>
        <div className="container m-auto">
          <div className="flex flex-row justify-between w-full items-center p-4 m-0">
            <div className={style["header-logo"] + " w-[175px]"}>
              <img src={ImageUrls.logo} alt="" />
            </div>
            <div className={style["header-nav"] + " flex-1"}>
              <ul className="m-0 flex items-center justify-center">
                <li
                  onClick={() => setActiveTab("Home")}
                  className={`${style["nav-li"]} inline-block px-5 py-2 ${
                    activeTab === "Home" ? style["activeli"] : ""
                  }`}
                >
                  Home
                </li>
                <li
                  onClick={() => setActiveTab("About")}
                  className={`${style["nav-li"]} inline-block px-5 py-2 ${
                    activeTab === "About" ? style["activeli"] : ""
                  }`}
                >
                  About
                </li>
                <li
                  onClick={() => setActiveTab("Service")}
                  className={`${style["nav-li"]} inline-block px-5 py-2 ${
                    activeTab === "Service" ? style["activeli"] : ""
                  }`}
                >
                  Services
                </li>
              </ul>
            </div>
            <div
              className={
                style["profile-section"] +
                " font-light cursor-pointer px-2 flex justify-end items-center w-[200px]"
              }
            >
              <div
                className={style["profile-avater"]}
                onClick={(event) =>
                  LoginMenu &&
                  LoginMenu.current &&
                  LoginMenu.current.toggle(event)
                }
                aria-controls="LoginMenu"
                aria-haspopup
              >
                {userInfo ? (
                  <span>{userInfo?.fullname[0]}</span>
                ) : (
                  <i className="pi pi-user"></i>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageHeader;
