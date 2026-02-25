import React, { useEffect } from 'react';
import './LandingPage.css';
import '../../style/cardprofile.css';

import logo from '../../assets/logo.png';
import netflixLogo from '../../assets/img/netflix.png';
import amazonLogo from '../../assets/img/amazon_prime.png';
import maxLogo from '../../assets/img/hbo_max.png';
import spotifyLogo from '../../assets/img/spotify.webp';

const LandingPage = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <div className="landing-page bg-bg-base text-slate-900 overflow-x-hidden font-display">
            {/* ═══════════════════════════════════════ */}
            {/* NAVBAR                                  */}
            {/* ═══════════════════════════════════════ */}
            <nav className="fixed top-0 w-full z-50 px-4 py-3 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="glass rounded-full px-6 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
                            <span className="font-black text-white text-lg tracking-tight hidden sm:block">Streaming<span className="text-blue-400"> solution</span></span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#problemas" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Problemas</a>
                            <a href="#funciones" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Funciones</a>
                            <a href="#planes" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Planes</a>
                        </div>
                        <a href="https://wa.me/573024570425" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-blue-600/20 uppercase tracking-wider hover:scale-[1.02]">
                            Solicita tu Demo
                        </a>
                    </div>
                </div>
            </nav>

            {/* ═══════════════════════════════════════ */}
            {/* SECTION 1: HERO                        */}
            {/* ═══════════════════════════════════════ */}
            <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden bg-bg-dark">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[55%] bg-blue-600/15 blur-[150px] rounded-full"></div>
                    <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-blue-700/10 blur-[120px] rounded-full"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left: Copy */}
                        <div className="flex flex-col gap-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit">
                                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                <span className="text-[10px] font-bold text-blue-400 tracking-[0.3em] uppercase">Plataforma de Gestión para Streaming</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black italic uppercase leading-[0.9] tracking-tighter text-white">
                                Controla tu<br />
                                <span className="text-blue-500">negocio</span> de<br />
                                streaming.
                            </h1>
                            <p className="text-xl font-bold text-slate-300 tracking-tight">Desde un solo lugar.</p>
                            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                                La herramienta que usan los proveedores de cuentas más organizados de Latinoamérica. Gestiona inventario, vendedores, clientes y ventas — todo automatizado.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                <a href="https://wa.me/573024570425" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 rounded-2xl text-base font-bold transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2 uppercase tracking-wider hover:scale-[1.02]">
                                    Solicita tu Demo
                                    <span className="material-symbols-outlined">arrow_forward</span>
                                </a>
                                <a href="#funciones" className="text-slate-500 hover:text-white h-14 px-6 rounded-2xl text-base font-medium transition-all flex items-center justify-center gap-2">
                                    Ver funcionalidades ↓
                                </a>
                            </div>
                        </div>

                        {/* Right: Dashboard Mockup */}
                        <div className="relative reveal">
                            <div className="bg-bg-base rounded-2xl p-5 shadow-2xl border border-white/10 overflow-hidden">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-slate-900 font-extrabold text-xl tracking-tight">Dashboard de Ventas</h3>
                                    <div className="bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">calendar_today</span> Vista Mensual
                                    </div>
                                </div>
                                {/* KPI Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3.5 rounded-[1.2rem] text-white shadow-lg shadow-blue-500/20">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">Ventas Ext.</span>
                                            <div className="bg-white/20 p-1 rounded-lg"><span className="material-symbols-outlined text-[13px]">shopping_cart</span></div>
                                        </div>
                                        <p className="text-lg font-bold">$422.000</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3.5 rounded-[1.2rem] text-white shadow-lg shadow-blue-500/20">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">Ventas Int.</span>
                                            <div className="bg-white/20 p-1 rounded-lg"><span className="material-symbols-outlined text-[13px]">home</span></div>
                                        </div>
                                        <p className="text-lg font-bold">$91.000</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-3.5 rounded-[1.2rem] text-white shadow-lg shadow-rose-500/20">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">Gastos</span>
                                            <div className="bg-white/20 p-1 rounded-lg"><span className="material-symbols-outlined text-[13px]">payments</span></div>
                                        </div>
                                        <p className="text-lg font-bold">$0</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-3.5 rounded-[1.2rem] text-white shadow-lg shadow-amber-500/20">
                                        <div className="flex justify-between items-start mb-1.5">
                                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">Total</span>
                                            <div className="bg-white/20 p-1 rounded-lg"><span className="material-symbols-outlined text-[13px]">attach_money</span></div>
                                        </div>
                                        <p className="text-lg font-bold">$513.000</p>
                                    </div>
                                </div>
                                {/* Mini Tables */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Ranking General</p>
                                        <h4 className="text-sm font-extrabold text-slate-900 mb-3">Vendedores Top</h4>
                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-amber-400 text-base">emoji_events</span><span className="text-xs font-semibold text-slate-700">Will Duncan</span></div>
                                                <span className="text-xs font-bold text-slate-900">$272.000</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-slate-300 text-base">military_tech</span><span className="text-xs font-semibold text-slate-700">Lesly12128</span></div>
                                                <span className="text-xs font-bold text-slate-900">$268.000</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2"><span className="material-symbols-outlined text-amber-700 text-base">military_tech</span><span className="text-xs font-semibold text-slate-700">Yesica Alejandra</span></div>
                                                <span className="text-xs font-bold text-slate-900">$248.000</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">Ranking General</p>
                                        <h4 className="text-sm font-extrabold text-slate-900 mb-3">Categorías Top</h4>
                                        <div className="space-y-2.5">
                                            <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-600">Netflix Original</span><span className="text-xs font-bold text-slate-900">$1.764.000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-600">Disney Premium</span><span className="text-xs font-bold text-slate-900">$276.000</span></div>
                                            <div className="flex items-center justify-between"><span className="text-xs font-medium text-slate-600">YouTube Premium</span><span className="text-xs font-bold text-slate-900">$200.000</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════ */}
            {/* SECTION 2: PROBLEMAS                   */}
            {/* ═══════════════════════════════════════ */}
            <section id="problemas" className="py-24 bg-bg-base relative">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100/20 rounded-full blur-[150px]"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 reveal">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-3">El Problema</p>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">¿Te suena familiar?</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="reveal bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-rose-500 text-[28px]">inventory_2</span>
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-900 mb-2 tracking-tight">"No sé cuántas cuentas tengo"</h3>
                            <p className="text-slate-600 font-medium leading-relaxed text-sm">Revisas Excel, WhatsApp y notas a mano para saber tu stock. Siempre estás un paso atrás.</p>
                        </div>
                        <div className="reveal bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-rose-500 text-[28px]">visibility_off</span>
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-900 mb-2 tracking-tight">"Mis vendedores venden sin que yo me entere"</h3>
                            <p className="text-slate-600 font-medium leading-relaxed text-sm">No tienes visibilidad en tiempo real de quién vende qué, cuánto y a quién.</p>
                        </div>
                        <div className="reveal bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-rose-500 text-[28px]">error</span>
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-900 mb-2 tracking-tight">"Pierdo dinero por cuentas caídas"</h3>
                            <p className="text-slate-600 font-medium leading-relaxed text-sm">Cuando una cuenta se cae, tardas horas en detectarla. El cliente se queja, el vendedor no sabe qué hacer.</p>
                        </div>
                        <div className="reveal bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-rose-500 text-[28px]">event_busy</span>
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-900 mb-2 tracking-tight">"No controlo las renovaciones"</h3>
                            <p className="text-slate-600 font-medium leading-relaxed text-sm">No sabes qué clientes están por vencer y pierdes renovaciones todos los días.</p>
                        </div>
                        <div className="reveal bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-rose-500 text-[28px]">trending_down</span>
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-900 mb-2 tracking-tight">"No puedo escalar"</h3>
                            <p className="text-slate-600 font-medium leading-relaxed text-sm">Quieres agregar más vendedores pero el caos crece igual. Más gente = más desorden.</p>
                        </div>
                        <div className="reveal bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 group">
                            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-rose-500 text-[28px]">storefront</span>
                            </div>
                            <h3 className="text-lg font-extrabold text-slate-900 mb-2 tracking-tight">"Cada vendedor necesita su tienda"</h3>
                            <p className="text-slate-600 font-medium leading-relaxed text-sm">Tus vendedores necesitan mostrar productos a sus clientes pero no tienen una herramienta profesional.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════ */}
            {/* SECTION 3: SOLUCIÓN (Transición)        */}
            {/* ═══════════════════════════════════════ */}
            <section className="py-20 bg-bg-base">
                <div className="max-w-4xl mx-auto px-4 text-center reveal">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">Streaming Solution</p>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic mb-6">Una plataforma.<br />Todo el control.</h2>
                    <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Creamos la herramienta que todo proveedor de streaming necesita. No importa si tienes 5 o 50 vendedores — tu operación funciona en piloto automático.</p>
                </div>
            </section>

            {/* ═══════════════════════════════════════ */}
            {/* SECTION 4: FUNCIONALIDADES              */}
            {/* ═══════════════════════════════════════ */}
            <div id="funciones">

                {/* Feature 1: Dashboard (Dark) */}
                <section className="py-24 bg-bg-dark overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="reveal">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6"><span className="material-symbols-outlined text-blue-400 text-[28px]">bar_chart</span></div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Métricas y Rendimiento</p>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">Dashboard Inteligente</h2>
                                <p className="text-slate-400 leading-relaxed mb-8">Visualiza tus ventas externas, internas, gastos y balance total en un solo vistazo. Conoce a tus vendedores estrella y toma decisiones basadas en datos reales.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-300 text-sm"><span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>KPIs de ventas en tiempo real (diario y mensual)</li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm"><span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>Ranking automático de vendedores top</li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm"><span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>Categorías más vendidas con gráfico donut</li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm"><span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>Gráficos de tendencia mensual y comparativa anual</li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm"><span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>Inventario disponible por categoría</li>
                                </ul>
                            </div>
                            <div className="reveal">
                                <div className="bg-bg-base rounded-2xl p-5 shadow-2xl">
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-[1.5rem] text-white shadow-lg shadow-blue-500/20">
                                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 block mb-1">Ventas Externas</span>
                                            <p className="text-xl font-bold">$422.000</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-[1.5rem] text-white shadow-lg shadow-blue-500/20">
                                            <span className="text-[9px] font-bold uppercase tracking-wider opacity-80 block mb-1">Ventas Internas</span>
                                            <p className="text-xl font-bold">$91.000</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1">Tendencia Mensual</p>
                                        <div className="flex items-end gap-1 h-24">
                                            <div className="flex-1 bg-blue-100 rounded-t" style={{ height: '40%' }}></div>
                                            <div className="flex-1 bg-blue-200 rounded-t" style={{ height: '55%' }}></div>
                                            <div className="flex-1 bg-blue-300 rounded-t" style={{ height: '45%' }}></div>
                                            <div className="flex-1 bg-blue-400 rounded-t" style={{ height: '70%' }}></div>
                                            <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '85%' }}></div>
                                            <div className="flex-1 bg-blue-400 rounded-t" style={{ height: '60%' }}></div>
                                            <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '90%' }}></div>
                                            <div className="flex-1 bg-blue-600 rounded-t" style={{ height: '100%' }}></div>
                                            <div className="flex-1 bg-blue-400 rounded-t" style={{ height: '75%' }}></div>
                                            <div className="flex-1 bg-blue-300 rounded-t" style={{ height: '50%' }}></div>
                                            <div className="flex-1 bg-blue-200 rounded-t" style={{ height: '35%' }}></div>
                                            <div className="flex-1 bg-blue-100 rounded-t" style={{ height: '25%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 2: Inventario (Light) */}
                <section className="py-24 bg-bg-base overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 reveal">
                                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
                                    <div className="grid grid-cols-3 gap-3 mb-5">
                                        <div className="bg-white border border-slate-200 rounded-[1.5rem] p-4 shadow-sm">
                                            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 w-fit mb-2"><span className="material-symbols-outlined text-[22px]">trending_up</span></div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Margen Prom.</p>
                                            <p className="text-xl font-extrabold text-blue-900">$4.200</p>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-[1.5rem] p-4 shadow-sm">
                                            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 w-fit mb-2"><span className="material-symbols-outlined text-[22px]">schedule</span></div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Vencen 3 días</p>
                                            <p className="text-xl font-extrabold text-amber-900">12</p>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-[1.5rem] p-4 shadow-sm">
                                            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 w-fit mb-2"><span className="material-symbols-outlined text-[22px]">star</span></div>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Top Proveedor</p>
                                            <p className="text-sm font-extrabold text-slate-900">Carlos (98%)</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mb-4">
                                        <div className="bg-slate-900 text-white text-[10px] px-4 py-2 rounded-xl font-bold uppercase tracking-wider">Inventario Ventas</div>
                                        <div className="bg-slate-100 text-slate-500 text-[10px] px-4 py-2 rounded-xl font-bold uppercase tracking-wider">Inventario Soporte</div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 text-xs"><span className="font-bold text-slate-800">Netflix Premium</span><span className="text-slate-500">user@mail.com</span><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Activa</span></div>
                                        <div className="flex items-center justify-between p-2 rounded-lg text-xs"><span className="font-bold text-slate-800">Disney+ Estándar</span><span className="text-slate-500">disney@mail.com</span><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold">3 días</span></div>
                                        <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50/50 text-xs"><span className="font-bold text-slate-800">HBO Max</span><span className="text-slate-500">hbo@mail.com</span><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">Activa</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 reveal">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6"><span className="material-symbols-outlined text-blue-600 text-[28px]">inventory_2</span></div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Control Total de Cuentas</p>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">Gestión de Inventario</h2>
                                <p className="text-slate-600 leading-relaxed mb-8">Administra todas tus cuentas de streaming en un solo lugar. Separa inventario de ventas y soporte. Importa masivamente desde Excel.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-700 text-sm"><span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Inventario dividido: Ventas + Soporte</li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm"><span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Importación masiva por Excel</li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm"><span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Alerta de cuentas próximas a vencer</li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm"><span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Reporte de cuentas caídas con un clic</li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm"><span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Proveedor top con % de estabilidad</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 3: Catálogo Visual (Dark) */}
                <section className="py-24 bg-bg-dark overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="reveal">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6"><span className="material-symbols-outlined text-blue-400 text-[28px]">grid_view</span></div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Vista Premium de Productos</p>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">Catálogo de Cuentas y Perfiles</h2>
                                <p className="text-slate-400 leading-relaxed mb-8">Tus vendedores ven el inventario disponible en cards visuales con el logo de cada plataforma, disponibilidad en tiempo real y compra con un clic.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-300 text-sm"><span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>Cards con logo y fondo personalizable</li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm"><span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>Disponibilidad en tiempo real</li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm"><span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>Perfiles individuales, Cuentas completas y Combos</li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm"><span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>+30 plataformas: Netflix, Disney+, HBO Max, Spotify, YouTube Premium, y más</li>
                                </ul>
                            </div>
                            <div className="reveal">
                                <div className="cards-showcase">
                                    {/* Netflix */}
                                    <div className="card-profile background-netflix">
                                        <div className="container-eyelash">
                                            <div className="eyelash-circle"></div>
                                            <div className="eyelash"></div>
                                        </div>
                                        <img src={netflixLogo} alt="Netflix" />
                                        <strong>42 Disponibles</strong>
                                        <span className="available"></span>
                                    </div>
                                    {/* Amazon Prime */}
                                    <div className="card-profile background-amazon_prime">
                                        <div className="container-eyelash">
                                            <div className="eyelash-circle"></div>
                                            <div className="eyelash"></div>
                                        </div>
                                        <img src={amazonLogo} alt="Amazon Prime" />
                                        <strong>18 Disponibles</strong>
                                        <span className="available"></span>
                                    </div>
                                    {/* MAX (HBO) */}
                                    <div className="card-profile background-hbo_max">
                                        <div className="container-eyelash">
                                            <div className="eyelash-circle"></div>
                                            <div className="eyelash"></div>
                                        </div>
                                        <img src={maxLogo} alt="MAX" />
                                        <strong>27 Disponibles</strong>
                                        <span className="available"></span>
                                    </div>
                                    {/* Spotify */}
                                    <div className="card-profile background-spotify">
                                        <div className="container-eyelash">
                                            <div className="eyelash-circle"></div>
                                            <div className="eyelash"></div>
                                        </div>
                                        <img src={spotifyLogo} alt="Spotify" />
                                        <strong>12 Disponibles</strong>
                                        <span className="available"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* Feature 4: Vendedores (Light) */}
                <section className="py-24 bg-bg-base overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 reveal">
                                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
                                    <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
                                        <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">Gestión de Usuarios</h3>
                                        <div className="bg-slate-900 text-white text-[10px] px-3 py-2 rounded-xl font-bold uppercase tracking-wider flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">add</span> Crear
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">E</div>
                                                <div>
                                                    <p className="text-sm font-extrabold text-slate-900">Elias12016</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">elamof@gmail.com</p>
                                                </div>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm font-black text-slate-900">$83.000</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-1 rounded-full uppercase">Activo</span>
                                                <div className="flex gap-1">
                                                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                                                    </div>
                                                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                        <span className="material-symbols-outlined text-[14px]">chat</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">B</div>
                                                <div>
                                                    <p className="text-sm font-extrabold text-slate-900">Brayan12077</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">brayan@gmail.com</p>
                                                </div>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm font-black text-slate-900">$0</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-1 rounded-full uppercase">Activo</span>
                                                <div className="flex gap-1">
                                                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                                                    </div>
                                                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                        <span className="material-symbols-outlined text-[14px]">chat</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">C</div>
                                                <div>
                                                    <p className="text-sm font-extrabold text-slate-900">Cristian12125</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">cristian@gmail.com</p>
                                                </div>
                                            </div>
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm font-black text-slate-900">$45.000</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-2 py-1 rounded-full uppercase">Inactivo</span>
                                                <div className="flex gap-1">
                                                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                        <span className="material-symbols-outlined text-[14px]">refresh</span>
                                                    </div>
                                                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                                                        <span className="material-symbols-outlined text-[14px]">chat</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 reveal">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-blue-600 text-[28px]">group</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Administra tu Red de Ventas</p>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">Equipo de Vendedores</h2>
                                <p className="text-slate-600 leading-relaxed mb-8">Crea vendedores ilimitados, recarga su saldo, controla sus permisos y comunícate por WhatsApp directo.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        Roles y permisos granulares
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        Sistema de saldo recargable
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        WhatsApp integrado
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        Exportación a Excel
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        Permisos personalizables por usuario
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 5: Kiosco (Dark) */}
                <section className="py-24 bg-bg-dark overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="reveal">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-amber-400 text-[28px]">storefront</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Kiosco Digital Personalizado</p>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">Tu Propia Tienda Online</h2>
                                <p className="text-slate-400 leading-relaxed mb-8">Cada proveedor puede crear su tienda pública con subdominio propio, logo, colores de marca y catálogo automático. Tus clientes hacen pedidos directo por WhatsApp o carrito de compras.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                                        Subdominio: tu-tienda.tudominio.com
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                                        Logo y colores de marca personalizados
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                                        Catálogo auto-sincronizado con inventario
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                                        Markup de precios por categoría
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                                        Carrito de compras + pedidos WhatsApp
                                    </li>
                                </ul>
                            </div>
                            <div className="reveal">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                                    <div className="h-28 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center relative">
                                        <div className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center absolute -bottom-8 border-4 border-white">
                                            <span className="material-symbols-outlined text-blue-600 text-[28px]">store</span>
                                        </div>
                                    </div>
                                    <div className="pt-12 px-5 pb-5 text-center">
                                        <h4 className="font-extrabold text-slate-900 text-lg tracking-tight">Mi Streaming Shop</h4>
                                        <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">mi-tienda.digitalstream.com</p>
                                        <div className="flex gap-2 justify-center mt-4 mb-4">
                                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full">Perfiles</span>
                                            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full">Cuentas</span>
                                            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full">Combos</span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="bg-gradient-to-b from-[#e50914] to-[#831010] rounded-xl p-3 text-center">
                                                <span className="text-white font-bold text-xs">Netflix</span>
                                                <p className="text-[9px] text-white/70 mt-1">$12.000</p>
                                            </div>
                                            <div className="bg-gradient-to-b from-[#0c3b7c] to-[#02163f] rounded-xl p-3 text-center">
                                                <span className="text-white font-bold text-xs">Disney+</span>
                                                <p className="text-[9px] text-white/70 mt-1">$9.000</p>
                                            </div>
                                            <div className="bg-gradient-to-b from-[#1DB954] to-[#0d5c2a] rounded-xl p-3 text-center">
                                                <span className="text-white font-bold text-xs">Spotify</span>
                                                <p className="text-[9px] text-white/70 mt-1">$7.000</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 6: CRM Clientes (Light) */}
                <section className="py-24 bg-bg-base overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 reveal">
                                <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
                                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                        <h3 className="font-extrabold text-lg text-slate-900">Clientes</h3>
                                        <div className="bg-slate-900 text-white text-[10px] px-3 py-2 rounded-xl font-bold uppercase tracking-wider">Nuevo Cliente</div>
                                    </div>
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100">
                                                <th className="text-left py-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nombre</th>
                                                <th className="text-center py-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Estado</th>
                                                <th className="text-right py-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Servicio</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-slate-50">
                                                <td className="py-3 font-extrabold text-slate-900">María López</td>
                                                <td className="text-center"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[9px] font-bold">Activo</span></td>
                                                <td className="text-right"><span className="text-blue-600 font-bold">18 días</span></td>
                                            </tr>
                                            <tr className="border-b border-slate-50">
                                                <td className="py-3 font-extrabold text-slate-900">Carlos Martínez</td>
                                                <td className="text-center"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[9px] font-bold">Vence hoy</span></td>
                                                <td className="text-right"><span className="text-amber-600 font-bold">0 días</span></td>
                                            </tr>
                                            <tr className="border-b border-slate-50">
                                                <td className="py-3 font-extrabold text-slate-900">Ana Rodríguez</td>
                                                <td className="text-center"><span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[9px] font-bold">Vencido</span></td>
                                                <td className="text-right"><span className="text-rose-600 font-bold">-3 días</span></td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 font-extrabold text-slate-900">Diego Sánchez</td>
                                                <td className="text-center"><span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[9px] font-bold">Activo</span></td>
                                                <td className="text-right"><span className="text-blue-600 font-bold">25 días</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 reveal">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-blue-600 text-[28px]">people</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Seguimiento Inteligente</p>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">Gestión de Clientes</h2>
                                <p className="text-slate-600 leading-relaxed mb-8">Lleva el control de todos tus clientes finales. Sabe exactamente quién está activo, cuándo vence y contacta por WhatsApp cuando sea momento de renovar.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        Cálculo automático de días restantes
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        Alerta visual de vencimientos
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        Importación y exportación Excel/PDF
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        Contacto directo por WhatsApp
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 7: Ventas y Finanzas (Dark) */}
                <section className="py-24 bg-bg-dark overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="reveal">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-blue-400 text-[28px]">monitoring</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Visibilidad Total del Dinero</p>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6">Ventas y Finanzas</h2>
                                <p className="text-slate-400 leading-relaxed mb-8">Registra cada venta automáticamente. Visualiza ventas diarias vs gastos en un balance claro. Descarga reportes en Excel.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                                        Ventas diarias: Ingresos vs Gastos
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                                        Búsqueda de órdenes por ID o fecha
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                                        Descarga de reportes en Excel
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm">
                                        <span className="material-symbols-outlined text-blue-400 text-lg">check_circle</span>
                                        Historial de recargas a vendedores
                                    </li>
                                </ul>
                            </div>
                            <div className="reveal">
                                <div className="bg-bg-base rounded-2xl p-5 shadow-2xl">
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="bg-white border border-slate-200 rounded-[1.2rem] p-4 text-center">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ventas</p>
                                            <p className="text-lg font-black text-blue-600">$513.000</p>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-[1.2rem] p-4 text-center">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Gastos</p>
                                            <p className="text-lg font-black text-rose-600">$87.000</p>
                                        </div>
                                        <div className="bg-white border border-slate-200 rounded-[1.2rem] p-4 text-center">
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Balance</p>
                                            <p className="text-lg font-black text-blue-600">$426.000</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl p-4 border border-slate-100">
                                        <div className="flex gap-2 mb-3">
                                            <span className="bg-white text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm ring-1 ring-black/5">Ventas</span>
                                            <span className="text-slate-400 text-[10px] font-bold px-3 py-1.5">Gastos</span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-slate-800">Netflix Premium</span>
                                                <span className="text-slate-400">Will Duncan</span>
                                                <span className="font-bold text-blue-600">$15.000</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs border-t border-slate-50 pt-2">
                                                <span className="font-bold text-slate-800">Spotify Individual</span>
                                                <span className="text-slate-400">Lesly12128</span>
                                                <span className="font-bold text-blue-600">$7.000</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs border-t border-slate-50 pt-2">
                                                <span className="font-bold text-slate-800">Disney+ Combo</span>
                                                <span className="text-slate-400">Yesica A.</span>
                                                <span className="font-bold text-blue-600">$22.000</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature 8: Combos (Light) */}
                <section className="py-24 bg-bg-base overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 reveal">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow hover:-translate-y-1 duration-300">
                                        <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-32 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-400 text-[48px]">package_2</span>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-slate-900 text-sm mb-1">Combo Familiar</h4>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xs text-slate-400 line-through">$45.000</span>
                                                <span className="text-xl font-extrabold text-blue-600">$35.000</span>
                                            </div>
                                            <div className="flex gap-1 mt-2">
                                                <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-full">Disponible</span>
                                            </div>
                                            <button className="w-full mt-3 bg-blue-600 text-white text-[10px] font-bold py-2 rounded-xl uppercase tracking-wider shadow-lg shadow-blue-600/20">Comprar</button>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow hover:-translate-y-1 duration-300">
                                        <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-32 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-slate-400 text-[48px]">package_2</span>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="font-bold text-slate-900 text-sm mb-1">Combo Premium</h4>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-xs text-slate-400 line-through">$80.000</span>
                                                <span className="text-xl font-extrabold text-blue-600">$65.000</span>
                                            </div>
                                            <div className="flex gap-1 mt-2">
                                                <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-2 py-0.5 rounded-full">Disponible</span>
                                            </div>
                                            <button className="w-full mt-3 bg-blue-600 text-white text-[10px] font-bold py-2 rounded-xl uppercase tracking-wider shadow-lg shadow-blue-600/20">Comprar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 reveal">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-blue-600 text-[28px]">package_2</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Vende Más con Bundles</p>
                                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-6">Combos y Paquetes</h2>
                                <p className="text-slate-600 leading-relaxed mb-8">Crea paquetes combinando perfiles y cuentas de múltiples plataformas. Agrega precios de oferta y aumenta el ticket promedio.</p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        Combina perfiles y cuentas de múltiples plataformas
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        Precios regulares y de oferta
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        Disponibilidad automática basada en stock
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-700 text-sm">
                                        <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>
                                        Carrito de compras integrado
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* ═══════════════════════════════════════ */}
            {/* SECTION 5: PLANES (Sin precios)         */}
            {/* ═══════════════════════════════════════ */}
            <section id="planes" className="py-24 bg-bg-base">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 reveal">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-3">Planes</p>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Elige tu plan</h2>
                        <p className="text-lg text-slate-500 font-medium mt-4">Escala tu operación con el plan que se adapte a tu negocio.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
                        {/* Plan Básico */}
                        <div className="reveal bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm flex flex-col">
                            <div className="mb-8">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Para empezar</p>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Plan Básico</h3>
                            </div>
                            <ul className="space-y-4 flex-1">
                                <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Dashboard de ventas con KPIs
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Gestión de inventario (ventas y soporte)
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Catálogo de perfiles, cuentas y combos
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Gestión de vendedores con saldo
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Gestión de clientes con vencimientos
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Ventas diarias (ingresos vs gastos)
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Historial de recargas
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Ventas externas e internas
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Kiosco digital con subdominio
                                </li>
                                <li className="flex items-center gap-3 text-slate-700 text-sm font-medium">
                                    <span className="material-symbols-outlined text-blue-600 text-lg">check_circle</span>Soporte por WhatsApp
                                </li>
                            </ul>
                            <a href="https://wa.me/573024570425" target="_blank" rel="noopener noreferrer" className="mt-8 w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-center uppercase tracking-wider text-sm shadow-xl shadow-slate-900/10 hover:scale-[1.02] transition-all block">
                                Solicita tu Demo
                            </a>
                        </div>
                        {/* Plan Pro */}
                        <div className="reveal bg-slate-900 rounded-[3rem] p-10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px] -mr-36 -mt-20 pointer-events-none"></div>
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="mb-8">
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.3em] mb-2">Diseñado para la Escala</p>
                                    <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Plan Pro</h3>
                                </div>
                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-8">
                                    <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest mb-1">Especialistas en SaaS</p>
                                    <p className="text-white text-xs font-bold leading-relaxed">Desarrollo a la medida y 100% personalizado para tus necesidades específicas.</p>
                                </div>
                                <ul className="space-y-4 flex-1">
                                    <li className="flex items-center gap-3 text-white text-sm font-medium">
                                        <div className="bg-blue-500/20 p-1 rounded-full border border-blue-500/30">
                                            <span className="material-symbols-outlined text-blue-400 text-sm">check</span>
                                        </div>
                                        Todo lo del Plan Básico
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                                        <div className="bg-blue-500/20 p-1 rounded-full border border-blue-500/30">
                                            <span className="material-symbols-outlined text-blue-400 text-sm">check</span>
                                        </div>
                                        Bot de Telegram
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                                        <div className="bg-blue-500/20 p-1 rounded-full border border-blue-500/30">
                                            <span className="material-symbols-outlined text-blue-400 text-sm">check</span>
                                        </div>
                                        Página de códigos de vinculación
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                                        <div className="bg-blue-500/20 p-1 rounded-full border border-blue-500/30">
                                            <span className="material-symbols-outlined text-blue-400 text-sm">check</span>
                                        </div>
                                        Backups diarios
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                                        <div className="bg-blue-500/20 p-1 rounded-full border border-blue-500/30">
                                            <span className="material-symbols-outlined text-blue-400 text-sm">check</span>
                                        </div>
                                        Atención prioritaria
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                                        <div className="bg-blue-500/20 p-1 rounded-full border border-blue-500/30">
                                            <span className="material-symbols-outlined text-blue-400 text-sm">check</span>
                                        </div>
                                        Métricas avanzadas
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                                        <div className="bg-blue-500/20 p-1 rounded-full border border-blue-500/30">
                                            <span className="material-symbols-outlined text-blue-400 text-sm">check</span>
                                        </div>
                                        Automatizaciones de flujo
                                    </li>
                                    <li className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                                        <div className="bg-blue-500/20 p-1 rounded-full border border-blue-500/30">
                                            <span className="material-symbols-outlined text-blue-400 text-sm">check</span>
                                        </div>
                                        Y mucho más...
                                    </li>
                                </ul>
                                <a href="https://wa.me/573024570425" target="_blank" rel="noopener noreferrer" className="mt-8 w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-center uppercase tracking-wider text-sm shadow-xl shadow-blue-600/20 hover:scale-[1.02] transition-all block">
                                    Solicita Información
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════ */}
            {/* SECTION 6: CÓMO FUNCIONA                */}
            {/* ═══════════════════════════════════════ */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 reveal">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-3">Proceso Simple</p>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Empieza en minutos</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 reveal">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                                <span className="text-white font-black text-2xl">1</span>
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-3">Solicita tu Demo</h3>
                            <p className="text-slate-500 font-medium text-sm">Agenda una demostración personalizada de 15 minutos por WhatsApp.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                                <span className="text-white font-black text-2xl">2</span>
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-3">Configura tu tienda</h3>
                            <p className="text-slate-500 font-medium text-sm">Sube tu inventario, crea tus vendedores y personaliza tu kiosco.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/20">
                                <span className="text-white font-black text-2xl">3</span>
                            </div>
                            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-3">Empieza a vender</h3>
                            <p className="text-slate-500 font-medium text-sm">Tus vendedores operan desde su panel. Tú solo monitoreas el dashboard.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════ */}
            {/* SECTION 7: CTA FINAL                    */}
            {/* ═══════════════════════════════════════ */}
            <section className="py-24 bg-bg-dark relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[30%] w-[50%] h-[50%] bg-blue-600/15 blur-[150px] rounded-full"></div>
                    <div className="absolute bottom-[-20%] right-[10%] w-[40%] h-[40%] bg-blue-700/10 blur-[120px] rounded-full"></div>
                </div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10 reveal">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic mb-6">
                        Tu negocio merece una<br />plataforma <span className="text-blue-500">profesional</span>
                    </h2>
                    <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto mb-10">
                        Deja de gestionar tu negocio de streaming con hojas de cálculo y chats. Automatiza, controla y escala.
                    </p>
                    <a href="https://wa.me/573024570425" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white h-16 px-12 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-blue-600/25 uppercase tracking-wider hover:scale-[1.02]">
                        Solicita tu Demo Gratis
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </a>
                    <p className="text-slate-500 text-sm font-medium mt-6">Sin compromiso. Te mostramos la plataforma en 15 minutos.</p>
                </div>
            </section>

            {/* ═══════════════════════════════════════ */}
            {/* SECTION 8: FOOTER                       */}
            {/* ═══════════════════════════════════════ */}
            <footer className="bg-bg-dark border-t border-white/5 pt-16 pb-10 relative overflow-hidden">
                {/* Subtle background glow */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid md:grid-cols-3 gap-10 items-start">
                        {/* Brand */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
                                <span className="font-black text-white text-xl tracking-tight">Streaming<span className="text-blue-400"> solution</span></span>
                            </div>
                            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                                La plataforma que usan los proveedores de streaming más organizados de Latinoamérica.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Navegación</p>
                            <a href="#problemas" className="text-sm text-slate-500 hover:text-white transition-colors font-medium">Problemas</a>
                            <a href="#funciones" className="text-sm text-slate-500 hover:text-white transition-colors font-medium">Funcionalidades</a>
                            <a href="#planes" className="text-sm text-slate-500 hover:text-white transition-colors font-medium">Planes</a>
                        </div>

                        {/* Contact */}
                        <div className="flex flex-col gap-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Contáctanos</p>
                            <a href="https://wa.me/573024570425" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">chat</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">WhatsApp</p>
                                    <p className="text-[11px] text-slate-500">Escríbenos directo</p>
                                </div>
                            </a>
                            <a href="mailto:contacto@digitalstream.com" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Email</p>
                                    <p className="text-[11px] text-slate-500">contacto@digitalstream.com</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div className="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-slate-600 text-xs">© 2026 Streaming Solution. Todos los derechos reservados.</p>
                        <p className="text-slate-700 text-[10px] font-bold uppercase tracking-widest">Hecho con 💙 en Colombia</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
