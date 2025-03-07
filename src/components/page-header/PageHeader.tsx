import style from "./PageHeader.module.scss";
import { ImageUrls } from "../../utils/ImageUrls";
import { useState } from "react";

type TabTypes = "Home" | "About" | "Service";

const PageHeader = () => {
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabTypes>("Home");

  return (
    <>
      <div className={style['top_header'] + ' w-full'}>
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
                <li className={style["nav-li"] + " inline-block px-5 py-2"}>
                  About
                </li>
                <li className={style["nav-li"] + " inline-block px-5 py-2"}>
                  Services
                </li>
              </ul>
            </div>
            <div className={style["profile-section"] + " px-2 flex justify-end items-center w-[200px]"}>
              <span className="material-symbols-rounded">account_circle</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageHeader;
