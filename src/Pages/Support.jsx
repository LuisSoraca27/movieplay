import React from 'react';
import HeroSection from '../Components/Support/HeroSection';
import WhatsappSection from '../Components/Support/WhatsappSection';
import SocialSection from '../Components/Support/SocialSection';
import BusinessHoursSection from '../Components/Support/BusinessHoursSection';
import PaymentMethodsSection from '../Components/Support/PaymentMethodsSection';
import Footer from '../Components/Support/Footer';

const Support = () => {
    return (
        <div className="relative flex flex-col gap-8 md:gap-12 animate-fade-in -m-4 md:-m-6 p-6 md:p-8 lg:p-12 min-h-screen bg-[#1C1D1F] text-white overflow-hidden">
            {/* Original Animated Mesh Background */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col gap-8 md:gap-16 max-w-7xl mx-auto w-full">
                <HeroSection />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10">
                    <WhatsappSection />
                    <SocialSection />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 md:gap-10">
                    <BusinessHoursSection />
                    <PaymentMethodsSection />
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default Support;