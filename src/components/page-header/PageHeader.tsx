import style from "./PageHeader.module.scss";
import { ImageUrls } from "../../utils/ImageUrls";
import { useState } from "react";

const PageHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  return (
    <>
      <div className="w-full bg-slate-300">
        <div className="container m-auto">
          <div className="flex flex-row justify-between w-full items-center p-4 m-0">
            <div className={style["header-logo"] + " w-auto"}>
              <img src={ImageUrls.logo} alt="" />
              <h6 className="text-xl">Dental Care</h6>
            </div>
            <div className={style["header-nav"] + " w-auto flex items-center"}>
              <ul>
                <li
                  className={
                    style["nav-li"] + " inline-block px-5 py-2 text-base"
                  }
                >
                  Home
                </li>
                <li
                  className={
                    style["nav-li"] + " inline-block px-5 py-2 text-base"
                  }
                >
                  About
                </li>
                <li
                  className={
                    style["nav-li"] + " inline-block px-5 py-2 text-base"
                  }
                >
                  Services
                </li>
              </ul>
            </div>
            <div className={style["profile-section"] + " px-2"}>
              <span className="material-symbols-rounded">account_circle</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageHeader;
