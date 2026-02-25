import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationLogic from "./Components/NotificationLogic";
import RoutesComponents from "./Components/RoutesComponents";
import MainLayout from "./Layouts/MainLayout";
import { fetchPublicStoreSettings } from "./features/storeSettings/storeSettingsSlice";
import { getUserSession } from "./features/user/userSlice";
// import "../src/style/app.css"; // Legacy styles removed
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";

function App() {
  const dispatch = useDispatch();
  const publicSettings = useSelector((state) => state.storeSettings.publicSettings);

  // Cargar configuración pública de la tienda (logo, redes, horarios, etc.) para usarla en Footer, Soporte, etc.
  useEffect(() => {
    dispatch(fetchPublicStoreSettings());
    dispatch(getUserSession());
  }, [dispatch]);

  // SEO: Actualizar título y meta tags dinámicamente
  useEffect(() => {
    // Título: prioridad seoTitle > storeName
    const title = publicSettings?.seoTitle || publicSettings?.storeName;
    if (title) document.title = title;

    // Meta description
    if (publicSettings?.seoDescription) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
      meta.content = publicSettings.seoDescription;
    }

    // Meta keywords
    if (publicSettings?.seoKeywords) {
      let meta = document.querySelector('meta[name="keywords"]');
      if (!meta) { meta = document.createElement('meta'); meta.name = 'keywords'; document.head.appendChild(meta); }
      meta.content = publicSettings.seoKeywords;
    }
  }, [publicSettings?.seoTitle, publicSettings?.storeName, publicSettings?.seoDescription, publicSettings?.seoKeywords]);

  // Actualizar el favicon dinámicamente
  useEffect(() => {
    if (publicSettings?.favicon) {
      const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
      link.rel = 'icon';
      link.href = publicSettings.favicon;
      document.head.appendChild(link);

      // También actualizar apple-touch-icon
      const appleLink = document.querySelector("link[rel='apple-touch-icon']");
      if (appleLink) appleLink.href = publicSettings.favicon;
    }
  }, [publicSettings?.favicon]);

  return (
    <div className="App">
      <NotificationLogic />
      <MainLayout>
        <RoutesComponents />
      </MainLayout>
    </div>
  );
}

export default App;
