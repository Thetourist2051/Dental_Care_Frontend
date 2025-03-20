// import React from "react";
import ReactDOM from "react-dom/client";
// import { PrimeReactProvider } from "primereact/api";
import App from "./App";
import "./index.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { ToasterProvider } from "./context/toaster-context/ToasterContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <ToasterProvider>
      <App />
    </ToasterProvider>
    {/* <PrimeReactProvider>
    </PrimeReactProvider> */}
    {/* <React.StrictMode>
    </React.StrictMode> */}
  </>
);
