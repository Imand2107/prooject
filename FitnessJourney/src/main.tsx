import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

const renderApp = () => {
  ReactDOM.createRoot(document.getElementById("app")!).render(
    <React.StrictMode>
      <HashRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HashRouter>
    </React.StrictMode>
  );
};

// Check if we're running in Cordova
if (/cordova/.test(navigator.userAgent)) {
  // Wait for the deviceready event in Cordova environment
  document.addEventListener("deviceready", renderApp, false);
} else {
  // Render immediately in browser environment
  renderApp();
}
