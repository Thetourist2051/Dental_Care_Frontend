import style from "./PageHeader.module.scss";
import { ImageUrls } from "../../utils/ImageUrls";
import { useRef, useState } from "react";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useNavigate } from "react-router";
import { RouteConstant } from "../../utils/RouteConstant";
import { TypescriptEnum } from "../../utils/TypescriptEnum";


const PageHeader = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TypescriptEnum["TabTypes"]>("Home");
  const LoginMenu = useRef<Menu>(null);
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
        label: 'Options',
        items: [
            {
                label: 'Login',
                icon: 'pi pi-sign-in',
                command :()=> {
                  navigate(RouteConstant.LoginPage, {replace: true, state: '1'})
                },
            },
            {
                label: 'Export',
                icon: 'pi pi-upload'
            }
        ]
    }
];

  
  return (
    <>
    <Menu model={items} popup ref={LoginMenu} closeOnEscape={true}  id="LoginMenu" />
      <div className={style["top_header"] + " w-full"}>
        <div className="container m-auto">
          <div className="flex flex-row justify-between w-full items-center p-4 m-0">
            <div className={style["header-logo"] + " w-[200px]"}>
              <img src={ImageUrls.logo} alt="" />
              <h6 className="text-base">Dental Care</h6>
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
              <span className="material-symbols-rounded" onClick={(event) => LoginMenu && LoginMenu.current && LoginMenu.current.toggle(event)} aria-controls="LoginMenu" aria-haspopup >account_circle</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageHeader;
