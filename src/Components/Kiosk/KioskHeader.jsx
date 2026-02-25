import React from 'react';
import { Shield, Zap, Award, ChevronDown } from 'lucide-react';

const KioskHeader = ({ kiosk }) => {
    if (!kiosk) return null;

    const features = [
        { icon: Zap, text: 'Entrega Inmediata' },
        { icon: Shield, text: 'Pago Seguro' },
        { icon: Award, text: 'Garantía Total' },
    ];

    return (
        <div className="relative overflow-hidden group">
            {/* Main Banner */}
            <div
                className="w-full relative min-h-[400px] md:min-h-[500px] flex items-center justify-center transition-all duration-700 ease-in-out"
                style={{
                    background: kiosk.bannerImage
                        ? `url(${kiosk.bannerImage})`
                        : `linear-gradient(135deg, ${kiosk.primaryColor || '#6366f1'} 0%, ${kiosk.secondaryColor || '#1C1D1F'} 100%)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Advanced Overlay System */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#0f172a]/90" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

                {/* Ambient Light Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                        className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full blur-[120px] opacity-20 animate-pulse-slow"
                        style={{ backgroundColor: kiosk.primaryColor || '#6366f1' }}
                    />
                    <div
                        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full blur-[150px] opacity-10 animate-pulse-slow"
                        style={{ backgroundColor: kiosk.secondaryColor || '#3b82f6', animationDelay: '2s' }}
                    />
                </div>

                {/* Content Container */}
                <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">

                    {/* Logo Section */}
                    {kiosk.logo && (
                        <div className="mb-10 relative">
                            <div className="absolute inset-0 blur-2xl opacity-40 animate-pulse" style={{ backgroundColor: kiosk.primaryColor || '#6366f1' }} />
                            <img
                                src={kiosk.logo}
                                alt={kiosk.name}
                                className="relative h-20 md:h-28 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    )}

                    {/* Headline Section */}
                    <div className="max-w-4xl space-y-6">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-[1.1] tracking-tight break-words">
                            {kiosk.description ? (
                                <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                                    {kiosk.description}
                                </span>
                            ) : (
                                <>
                                    <span className="text-white/60 font-light block text-2xl md:text-3xl mb-2 tracking-[0.2em] uppercase">Bienvenido a</span>
                                    <span className="block italic" style={{ color: kiosk.primaryColor || '#6366f1' }}>{kiosk.name}</span>
                                </>
                            )}
                        </h1>

                        {!kiosk.description && (
                            <p className="text-lg md:text-xl text-white/50 font-medium tracking-wide max-w-2xl mx-auto">
                                Descubre una experiencia digital <span className="text-white">superior</span> con los mejores productos premium del mercado.
                            </p>
                        )}
                    </div>

                    {/* Feature Bar: Minimalist Quality Seals */}
                    <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 mt-12 px-8 py-3 bg-white/[0.05] border border-white/10 backdrop-blur-md rounded-full shadow-2xl">
                        {features.map((feature, index) => (
                            <React.Fragment key={index}>
                                <div className="flex items-center gap-2.5">
                                    <feature.icon size={16} className="text-white/80 drop-shadow-[0_0_10px_rgba(0,0,0,0.3)]" />
                                    <span className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-[0.15em]">
                                        {feature.text}
                                    </span>
                                </div>
                                {index < features.length - 1 && (
                                    <div className="hidden sm:block w-px h-4 bg-white/10" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Bottom Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
                    <ChevronDown size={24} className="text-white" />
                </div>
            </div>

            {/* Subtle Gradient Transition to content */}
            <div className="h-24 -mt-24 relative z-20 bg-gradient-to-t from-[#f8fafc] dark:from-[#0f172a] to-transparent" />
        </div>
    );
};

export default KioskHeader;
