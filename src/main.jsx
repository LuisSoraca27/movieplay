import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "../src/app/store/store.js";
import { Provider } from "react-redux";
import { HeroUIProvider } from "@heroui/react";
import { ToastProvider } from "@heroui/toast";
import { AuthContextProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from 'virtual:pwa-register';
import { setEnvironmentVariables } from "./utils/env";

// Initialize environment variables
setEnvironmentVariables();

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nueva versión disponible. ¿Actualizar?')) {
      updateSW()
    }
  },
  onOfflineReady() {
    console.log('La aplicación está lista para uso sin conexión')
  },
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <HeroUIProvider>
        <ToastProvider placement="top-right" />
        <AuthContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthContextProvider>
      </HeroUIProvider>
    </Provider>
  </React.StrictMode>
);
