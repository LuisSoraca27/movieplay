import { useState } from 'react';
import { Tabs, Tab } from "@heroui/react";
import { User, CreditCard, Box, Grip } from "lucide-react";
import LicenseProduct from '../Components/Inventory/LicenseProduct';
import ProfileProduct from '../Components/Inventory/ProfileProduct';
import AccountProduct from '../Components/Inventory/AccountProduct';
import ComboProduct from '../Components/Inventory/ComboProduct';
import { PageContainer, PremiumHeader } from "../Components/ui/PremiumComponents";

const InventoryStock = () => {
    const [selected, setSelected] = useState("perfiles");

    return (
        <PageContainer>
            {/* Header */}
            <PremiumHeader
                title="Inventario Stock"
                description="GESTIONA TUS PERFILES, CUENTAS, COMBOS Y OTROS SERVICIOS"
                icon={Box}
            />

            <div className="flex w-full flex-col">
                <Tabs
                    aria-label="Opciones de inventario"
                    selectedKey={selected}
                    onSelectionChange={setSelected}
                    color="primary"
                    variant="light"
                    radius="full"
                    classNames={{
                        tabList: "gap-4 p-1.5 bg-slate-200/40 backdrop-blur-md rounded-2xl w-fit mx-auto border border-slate-200/60 shadow-inner-sm mb-8",
                        cursor: "bg-slate-900 shadow-xl border border-slate-800",
                        tab: "h-10 px-8",
                        tabContent: "font-bold uppercase text-[11px] tracking-[0.15em] group-data-[selected=true]:text-white text-slate-500"
                    }}
                >
                    <Tab
                        key="perfiles"
                        title={
                            <div className="flex items-center space-x-2">
                                <User size={16} />
                                <span>Perfiles</span>
                            </div>
                        }
                    >
                        <div className="pt-2">
                            <ProfileProduct />
                        </div>
                    </Tab>
                    <Tab
                        key="cuentas"
                        title={
                            <div className="flex items-center space-x-2">
                                <CreditCard size={16} />
                                <span>Cuentas</span>
                            </div>
                        }
                    >
                        <div className="pt-2">
                            <AccountProduct />
                        </div>
                    </Tab>
                    <Tab
                        key="combos"
                        title={
                            <div className="flex items-center space-x-2">
                                <Grip size={16} />
                                <span>Combos</span>
                            </div>
                        }
                    >
                        <div className="pt-2">
                            <ComboProduct />
                        </div>
                    </Tab>
                    <Tab
                        key="licencias"
                        title={
                            <div className="flex items-center space-x-2">
                                <Box size={16} />
                                <span>Otros Servicios</span>
                            </div>
                        }
                    >
                        <div className="pt-2">
                            <LicenseProduct />
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </PageContainer>
    );
};

export default InventoryStock;