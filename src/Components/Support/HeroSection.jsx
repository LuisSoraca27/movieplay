import React from 'react';
import { useSelector } from 'react-redux';
import { Headset, Info } from 'lucide-react';

const HeroSection = () => {
  const publicSettings = useSelector((state) => state.storeSettings.publicSettings);
  const storeName = publicSettings?.storeName || 'Streaming Solution';
  const welcomeMessage = publicSettings?.welcomeMessage;

  return (
    <section className="relative py-12 md:py-20 flex flex-col items-center text-center">
      {/* Visual Accent */}
      <div className="mb-8 inline-flex items-center gap-3 px-5 py-2.5 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-md animate-bounce-slow">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Centro de Ayuda</span>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 z-10">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[0.9]">
          ¿Cómo podemos <br />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent italic">ayudarte hoy?</span>
        </h1>

        <p className="text-lg md:text-xl text-white/50 font-medium leading-relaxed max-w-2xl mx-auto">
          {welcomeMessage ? welcomeMessage : (
            <>
              Gracias por elegir <span className="text-white font-black">{storeName}</span>. Estamos aquí para resolver tus dudas y asegurar que tu experiencia sea excepcional.
            </>
          )}
        </p>

        {/* Decorative Floating Icons */}
        <div className="absolute top-0 right-0 -z-10 opacity-10 blur-sm pointer-events-none">
          <Headset size={200} className="text-blue-500 translate-x-1/3 -translate-y-1/4" />
        </div>
      </div>

      {/* Bottom Divider */}
      <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mt-12 opacity-20" />
    </section>
  );
};

export default HeroSection; 