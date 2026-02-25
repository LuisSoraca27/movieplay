import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button } from '@heroui/react';

const PrivacyPolicy = () => {
    const publicSettings = useSelector((state) => state.storeSettings.publicSettings);
    const storeName = publicSettings?.storeName || 'Nuestra Tienda';
    const content = publicSettings?.privacyPolicy;

    return (
        <div className="min-h-screen bg-[#141517] flex flex-col">
            {/* Header */}
            <header className="border-b border-white/[0.06] px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white/[0.06]">
                            <Shield size={20} className="text-white/60" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg tracking-tight">Política de Privacidad</h1>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">{storeName}</p>
                        </div>
                    </div>
                    <Link to="/login">
                        <Button
                            variant="flat"
                            size="sm"
                            startContent={<ArrowLeft size={16} />}
                            className="bg-white/[0.06] text-white/60 hover:text-white border border-white/[0.06] font-bold text-[11px] uppercase tracking-wider"
                        >
                            Volver
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    {content ? (
                        <div className="rounded-2xl border border-white/[0.06] bg-[#1C1D1F]/60 backdrop-blur-xl p-8 md:p-12">
                            <div className="prose prose-invert max-w-none">
                                {content.split('\n').map((line, i) => (
                                    <p key={i} className="text-white/70 text-sm leading-relaxed font-medium mb-4 last:mb-0">
                                        {line || <br />}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-6">
                                <Shield size={28} className="text-white/20" />
                            </div>
                            <p className="text-white/30 text-sm font-medium">No hay política de privacidad configurada aún.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] px-6 py-4 text-center">
                <p className="text-white/20 text-xs font-medium">
                    © {new Date().getFullYear()} {storeName}
                </p>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
