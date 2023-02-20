import "App.css";
import { AppProvider } from "context/globalContext";
import AppMain from "layout/AppMain";
import { errorFallback } from "pages/ErrorFallback/errorFallback";
import { ErrorBoundary } from "react-error-boundary";
function App() {
  const errorHandler = (error, errorInfo) =>
    console.log("Logging ", error, errorInfo);
  return (
    <ErrorBoundary FallbackComponent={errorFallback} onError={errorHandler}>
      <AppProvider>
        <AppMain />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
