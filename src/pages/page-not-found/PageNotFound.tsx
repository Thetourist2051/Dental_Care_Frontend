import React from "react";
import { useNavigate } from "react-router";
import style from "./PageNotFound.module.scss"

const PageNotFound = (): React.ReactElement => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className={style.container}>
      <h1 className={style.title}>404</h1>
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
