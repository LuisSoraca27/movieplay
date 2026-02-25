import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
// import "../style/navbar.css"; // Removed legacy
import logo from "../assets/logo.png";
import { useMediaQuery } from "react-responsive";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";
import { useDispatch, useSelector } from "react-redux";
import { setBalanceThunk } from "../features/balance/balanceSlice";
import { Button, User } from "@heroui/react";
import { Wallet, Menu, AlignRight } from "lucide-react";
import { CartIcon } from "./Cart";
import NotificationDropdown from "./Notifications/NotificationDropdown";

const NavBar = () => {
  const [activeItem, setActiveItem] = useState("profiles");
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.balance);
  const publicSettings = useSelector((state) => state.storeSettings.publicSettings);
  const isMobile = useMediaQuery({ maxWidth: 800 });
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [visibleRight, setVisibleRight] = useState(false);
  const location = useLocation();
  const storeLogo = publicSettings?.logo || logo;

  const onHideLeft = () => setVisibleLeft(false);
  const onHideRight = () => setVisibleRight(false);

  // Sync active item with URL for better UX
  useEffect(() => {
    const path = location.pathname;
    const item = menuItems.find(i => i.path === path);
    if (item) setActiveItem(item.label);
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item);
    dispatch(setBalanceThunk(user?.id));
  };

  const menuItems = [
    { label: "Perfiles", path: "/profiles" },
    { label: "Cuentas", path: "/accounts" },
    { label: "Combos", path: "/combos" },
    { label: "Otros Servicios", path: "/licenses" },
  ];

  useEffect(() => {
    if (user?.id) {
      dispatch(setBalanceThunk(user?.id));
    }
  }, [dispatch, user?.id]);

  return (
    <>
      <div
        className="w-full h-16 flex items-center justify-between px-6"
        style={{ backgroundColor: '#1C1D1F' }} // Matching the sidebar/layout background
      >
        <div className="flex items-center">
          {isMobile && (
            <div className="mr-4 cursor-pointer" onClick={() => setVisibleLeft(true)}>
              <img src={storeLogo} alt="Logo" className="h-8 w-auto" />
            </div>
          )}

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center gap-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => handleItemClick(item.label)}
                    className={`
                                px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200
                                ${isActive
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/5"}
                            `}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user?.role === "seller" && (
            <>
              <NotificationDropdown />
              <CartIcon />
              <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <Wallet size={16} />
                <span className="font-semibold text-sm">
                  ${new Intl.NumberFormat().format(balance)}
                </span>
              </div>
            </>
          )}

          {isMobile && (
            <Button
              isIconOnly
              variant="light"
              className="text-white"
              onPress={() => setVisibleRight(true)}
            >
              <AlignRight size={24} />
            </Button>
          )}
        </div>
      </div>

      <SidebarLeft visible={visibleLeft} onHide={onHideLeft} />
      <SidebarRight show={visibleRight} handleClose={onHideRight} />
    </>
  );
};

export default NavBar;
