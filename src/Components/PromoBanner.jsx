import { useState } from 'react';
import { useSelector } from 'react-redux';
import { X, Sparkles } from 'lucide-react';

export default function PromoBanner() {
    const [dismissed, setDismissed] = useState(false);
    const publicSettings = useSelector((state) => state.storeSettings.publicSettings);

    const show = publicSettings?.showPromoBanner && publicSettings?.promoBannerText;

    if (!show || dismissed) return null;

    const text = publicSettings.promoBannerText;
    const link = publicSettings?.promoBannerLink;

    // Repetir el texto varias veces para el efecto infinito
    const repeatedContent = Array.from({ length: 8 }, (_, i) => (
        <span key={i} className="flex items-center gap-3 shrink-0 px-8">
            <Sparkles size={12} className="text-slate-400 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-300 whitespace-nowrap">
                {text}
            </span>
        </span>
    ));

    const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDismissed(true);
    };

    return (
        <div className="w-full bg-slate-900 border-b border-slate-800/60 relative overflow-hidden shrink-0">
            {/* Subtle depth glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-4 left-1/4 w-[300px] h-[40px] bg-blue-500/[0.06] rounded-full blur-[30px]" />
                <div className="absolute -top-4 right-1/4 w-[200px] h-[40px] bg-indigo-500/[0.04] rounded-full blur-[25px]" />
            </div>

            {/* Marquee content - clickable only if link exists */}
            {link ? (
                <a href={link} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="relative flex items-center h-8 overflow-hidden">
                        <div className="flex animate-marquee">
                            {repeatedContent}
                        </div>
                        <div className="flex animate-marquee2" aria-hidden>
                            {repeatedContent}
                        </div>
                    </div>
                </a>
            ) : (
                <div className="relative flex items-center h-8 overflow-hidden">
                    <div className="flex animate-marquee">
                        {repeatedContent}
                    </div>
                    <div className="flex animate-marquee2" aria-hidden>
                        {repeatedContent}
                    </div>
                </div>
            )}

            {/* Fade edges */}
            <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-8 top-0 h-full w-12 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

            {/* Close button - OUTSIDE of the <a> tag to prevent navigation */}
            <button
                onClick={handleClose}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1 rounded-full hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-300"
                aria-label="Cerrar banner"
            >
                <X size={14} />
            </button>
        </div>
    );
}
