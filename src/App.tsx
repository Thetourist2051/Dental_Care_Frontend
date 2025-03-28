import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import "./assets/FormStyle.scss";
import "./assets/StyledButton.scss";
import "./assets/Animation.scss";
import ErrorBoundary from "./components/error-boundary/ErrorBoundary";
import RouterConfig from "./pages/router-config/RouterConfig";
import Toaster from "./components/toaster/Toaster";
import { Provider } from "react-redux";
import { store } from "./utils/redux-store/appstore";

function App() {
  return (
    <>
      <div className="init_div">
        <ErrorBoundary>
          <Provider store={store}>
            <Toaster></Toaster>
            <RouterConfig></RouterConfig>
          </Provider>
        </ErrorBoundary>
      </div>
    </>
  );
}

export default App;
