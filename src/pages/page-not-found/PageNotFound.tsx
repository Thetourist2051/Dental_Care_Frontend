import React from "react";
import { useNavigate } from "react-router";
import style from "./PageNotFound.module.scss"
import { ImageUrls } from "../../utils/ImageUrls";

const PageNotFound = (): React.ReactElement => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className={style.container}>
      <img className="h-[250px]" src={ImageUrls.pagenotfound} alt="" />
      <p className={style.message}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <button onClick={handleGoHome} className={style.button}>
        Go Back Home
      </button>
    </div>
  );
};

export default PageNotFound;
