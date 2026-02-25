import { Drawer, DrawerContent, DrawerHeader, DrawerBody } from "@heroui/react";
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Monitor, Package, Layers, ChevronRight } from 'lucide-react';

const SidebarRight = ({ show, handleClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navigateTo = (path) => {
        handleClose();
        navigate(path);
    };

    const menuItems = [
        { label: 'Perfiles', path: '/profiles', icon: User, desc: 'Individuales' },
        { label: 'Cuentas', path: '/accounts', icon: Monitor, desc: 'Completas' },
        { label: 'Combos', path: '/combos', icon: Package, desc: 'Paquetes' },
        { label: 'Otros Servicios', path: '/licenses', icon: Layers, desc: 'Licencias y más' },
    ];

    return (
        <Drawer
            isOpen={show}
            onClose={handleClose}
            placement="right"
            size="xs"
            classNames={{
                base: "bg-[#1C1D1F]",
                header: "border-b border-white/[0.06]",
                body: "p-0",
                closeButton: "text-white/40 hover:text-white hover:bg-white/10 rounded-xl",
            }}
        >
            <DrawerContent>
                <DrawerHeader className="justify-center py-7">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-lg font-black text-white tracking-tight">Catálogo</span>
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Explora productos</p>
                    </div>
                </DrawerHeader>
                <DrawerBody>
                    <div className="flex flex-col px-3 py-4 space-y-2">
                        {menuItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={index}
                                    className={`
                                        w-full flex items-center gap-3.5 px-3.5 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer group text-left
                                        ${isActive
                                            ? "bg-white/[0.08] text-white"
                                            : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                                        }
                                    `}
                                    onClick={() => navigateTo(item.path)}
                                >
                                    <div className={`
                                        p-2.5 rounded-xl transition-all duration-300
                                        ${isActive
                                            ? "bg-white/10 shadow-lg shadow-white/[0.03]"
                                            : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                                        }
                                    `}>
                                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[13px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
                                            {item.label}
                                        </span>
                                        <span className="text-[10px] font-medium text-white/20 tracking-wide">
                                            {item.desc}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <ChevronRight size={14} className="ml-auto text-white/30" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};

export default SidebarRight;
