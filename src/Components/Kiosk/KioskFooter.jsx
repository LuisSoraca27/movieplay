import React from 'react';
import { Clock } from 'lucide-react';

const WhatsAppIcon = ({ size = 20, className = '' }) => (
    <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const KioskFooter = ({ kiosk }) => {
    if (!kiosk) return null;

    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-16 overflow-hidden">
            {/* Design Element: Colored bar at the top */}
            <div className="h-1.5 w-full flex">
                <div style={{ backgroundColor: kiosk.primaryColor || '#6366f1' }} className="flex-1" />
                <div style={{ backgroundColor: kiosk.secondaryColor || '#0f172a' }} className="flex-1" />
            </div>

            <div
                className="text-white pb-10 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.5)]"
                style={{ backgroundColor: '#1C1D1F' }}
            >
                <div className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
                        {/* Brand Column */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="flex items-center gap-4">
                                {kiosk.logo ? (
                                    <img src={kiosk.logo} alt={kiosk.name} className="h-12 object-contain" />
                                ) : (
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg ring-4 ring-gray-100 dark:ring-zinc-800"
                                        style={{ background: `linear-gradient(135deg, ${kiosk.primaryColor || '#6366f1'}, ${kiosk.secondaryColor || '#0f172a'})` }}
                                    >
                                        {kiosk.name?.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-black text-2xl tracking-tight leading-none mb-1 text-white">{kiosk.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: kiosk.primaryColor || '#6366f1' }} />
                                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Tienda Oficial</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-white/60 text-base leading-relaxed max-w-md break-words font-medium">
                                {kiosk.description || 'Tu tienda de confianza para productos digitales premium. Entregas inmediatas y garantizadas con soporte 24/7.'}
                            </p>
                        </div>

                        {/* Navigation Columns */}
                        <div className="lg:col-span-3 space-y-6">
                            <h4 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Contacto Directo</h4>
                            <div className="space-y-4">
                                {kiosk.whatsappNumber && (
                                    <a
                                        href={`https://wa.me/${kiosk.whatsappNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
                                        className="flex items-center gap-3 p-4 rounded-2xl group transition-all duration-300 hover:bg-white/5 hover:scale-[1.02]"
                                    >
                                        <div className="bg-green-500 text-white p-2 rounded-xl shadow-lg shadow-green-500/20">
                                            <WhatsAppIcon size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">WhatsApp</span>
                                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Escríbenos ahora</span>
                                        </div>
                                    </a>
                                )}
                                <div className="flex items-center gap-3 text-white/50 px-4">
                                    <Clock size={16} className="text-white/30" />
                                    <span className="text-sm font-medium">Disponible 24 horas, 7 días</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 space-y-6">
                            <h4 className="text-xs font-black text-white/30 uppercase tracking-[0.2em]">Compromiso de Calidad</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    'Productos Originales',
                                    'Garantía Total',
                                    'Soporte Humano',
                                    'Pago Seguro'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm font-bold text-white/70">
                                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: kiosk.primaryColor || '#6366f1' }} />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4">
                    <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                        <p className="text-sm font-bold text-white/30 tracking-tight">
                            © {currentYear} <span className="text-white/80">{kiosk.name}</span>. Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">Digital Store Solution</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default KioskFooter;
