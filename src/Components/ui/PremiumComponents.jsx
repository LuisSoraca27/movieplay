import React from 'react';
import { Card, CardBody } from "@heroui/react";

export const BackgroundBlobs = () => (
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 -left-24 w-[500px] h-[500px] bg-indigo-100/5 rounded-full blur-[120px]" />
    </div>
);

export const PageContainer = ({ children, className = "" }) => (
    <div className={`animate-fade-in relative overflow-hidden pt-8 pb-12 min-h-screen ${className}`}>
        <BackgroundBlobs />
        <div className="relative z-10 max-w-[95%] mx-auto space-y-8 px-6">
            {children}
        </div>
    </div>
);

export const PremiumHeader = ({ title, description, icon: Icon, action }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="bg-white p-3 rounded-2xl shadow-lg shadow-slate-200/50">
                        <Icon size={32} className="text-slate-900" />
                    </div>
                )}
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {title}
                </h1>
            </div>
            {description && (
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider pl-1">
                    {description}
                </p>
            )}
        </div>
        {action}
    </div>
);

export const PremiumCard = ({ children, className = "" }) => (
    <div className={`bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm relative overflow-hidden ${className}`}>
        {children}
    </div>
);

export const DashboardCard = ({ title, subtitle, children, className = "" }) => (
    <div className={`bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative overflow-hidden flex flex-col ${className}`}>
        {subtitle && (
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">
                {subtitle}
            </p>
        )}
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight mb-4">
            {title}
        </h2>
        <div className="flex-1 min-h-0">
            {children}
        </div>
    </div>
);
