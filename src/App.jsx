import { useLocation } from "react-router-dom";
import NavBar from "./Components/NavBar";
import NotificationLogic from "./Components/NotificationLogic";
import RoutesComponents from "./Components/RoutesComponents";
import { useMediaQuery } from "react-responsive";
import MenuLeft from "./Components/MenuLeft";
import "../src/style/app.css";
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";

function App() {
  return (
    <div className="App">
      <NotificationLogic />
      <div className="app-container">
        <SideMenuWrapper />
        <div className="content-container">
          <NavBarWrapper />
          <RoutesComponents />
        </div>
      </div>
    </div>
  );
}

export default App;

function NavBarWrapper() {
  const location = useLocation();

  if (
    location.pathname === "/login" ||
    location.pathname === "/register-sellers"
  ) {
    return null;
  }

  return <NavBar />;
}
function SideMenuWrapper() {
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 800 });

  if (
    location.pathname === "/login" ||
    location.pathname === "/register-sellers" ||
    isMobile
  ) {
    return null;
  }

  return <MenuLeft />;
}
