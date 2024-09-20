import { HashRouter,useLocation, BrowserRouter } from 'react-router-dom';
import NavBar from './Components/NavBar';
import NotificationLogic from './Components/NotificationLogic';
import { AuthContextProvider } from './context/AuthContext';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { PrimeReactProvider } from 'primereact/api';
import RoutesComponents from './Components/RoutesComponents';
import SideMenu from './Components/SideMenu';
import { useMediaQuery } from 'react-responsive';



function App() {


  return (
    <div className="App">
      <PrimeReactProvider>
        <AuthContextProvider>
          <HashRouter>
            <NotificationLogic />
            <div style={{ display: 'flex' }}>
              <SideMenuWrapper />
              <div style={{ background: '#eff3f8', flex: '1 1 auto' }}>
                <NavBarWrapper />
                <RoutesComponents />
              </div>
            </div>
          </HashRouter>
        </AuthContextProvider>
      </PrimeReactProvider>
    </div >
  );
}


export default App;

function NavBarWrapper() {
  const location = useLocation();

  // Verificar si la ubicación actual es '/login' o el usuario no ha iniciado sesión
  if (location.pathname === '/login') {
    return null; // No renderizar la barra de navegación
  } else if (location.pathname === '/register-sellers') {
    return null; // No renderizar la barra de navegación
  }

  return <NavBar />;
}

function SideMenuWrapper() {
  const location = useLocation();

  const isMobile = useMediaQuery({ maxWidth: 800 });

  // Verificar si la ubicación actual es '/login' o el usuario no ha iniciado sesión
  if (location.pathname === '/login') {
    return null; // No renderizar la barra de navegación
  } else if (location.pathname === '/register-sellers') {
    return null; // No renderizar la barra de navegación
  } else if (isMobile) {
    return null; // No renderizar la barra de navegación
  }

  return <SideMenu />;
}