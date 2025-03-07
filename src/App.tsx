import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./App.css";
import "./assets/FormStyle.scss";
import ErrorBoundary from "./components/error-boundary/ErrorBoundary";
import RouterConfig from "./pages/router-config/RouterConfig";
import Toaster from "./components/toaster/Toaster";

function App() {
  return (
    <>
      <div className="init_div">
        <ErrorBoundary>
          <RouterConfig></RouterConfig>
          <Toaster />
        </ErrorBoundary>
      </div>
    </>
  );
}

export default App;
