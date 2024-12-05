import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "../src/app/store/store.js";
import { Provider } from "react-redux";
import { PrimeReactProvider } from "primereact/api";
import { AuthContextProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from 'virtual:pwa-register'

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
      <PrimeReactProvider>
        <AuthContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthContextProvider>
      </PrimeReactProvider>
    </Provider>
  </React.StrictMode>
);
