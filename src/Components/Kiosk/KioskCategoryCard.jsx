import React from 'react';
import { Spinner } from '@heroui/react';
import { ShoppingBag, Check } from 'lucide-react';
import '../../style/cardprofile.css';

const getBackgroundStyle = (item) => {
    const { backgroundType, backgroundColor, gradientColors, gradientDirection } = item;
    if (backgroundType === 'linear-gradient') {
        const colors = Array.isArray(gradientColors) ? gradientColors : ['#000000', '#333333'];
        return { background: `linear-gradient(${gradientDirection || 'to bottom'}, ${colors.join(', ')})` };
    }
    if (backgroundType === 'radial-gradient') {
        const colors = Array.isArray(gradientColors) ? gradientColors : ['#000000', '#333333'];
        return { background: `radial-gradient(circle, ${colors.join(', ')})` };
    }
    return { background: backgroundColor || '#000000' };
};

const getLogoSizeStyle = (logoSize) => {
    switch (logoSize) {
        case 'small': return { width: '50%', maxHeight: '80px' };
        case 'large': return { width: '90%', maxHeight: '180px' };
        case 'full': return { width: '100%', maxHeight: '100%' };
        default: return { width: '75%', maxHeight: '130px' };
    }
};

const KioskCategoryCard = ({ item, type, onCardClick, onAddToCart, isAdding }) => {
    const isAvailable = parseInt(item.total) > 0;
    const displayName = item.displayName || item.categoryName;
    const logoUrl = item.logoUrl;

    return (
        <div className="relative group kiosk-card-wrapper">
            <div
                className={`card-profile ${!isAvailable ? 'no-available' : ''}`}
                onClick={() => onCardClick(item, type)}
                style={{
                    ...getBackgroundStyle(item),
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    isolation: 'isolate'
                }}
            >
                {/* Top notch design */}
                <div className="container-eyelash">
                    <div className="eyelash-circle"></div>
                    <div className="eyelash"></div>
                </div>

                {/* Logo or fallback name */}
                {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt={displayName}
                        className="transition-transform duration-300 group-hover:scale-110"
                        style={{
                            ...getLogoSizeStyle(item.logoSize),
                            objectFit: 'contain',
                        }}
                    />
                ) : (
                    <span className="text-white font-bold text-lg text-center px-4 z-[2] drop-shadow-lg">
                        {displayName}
                    </span>
                )}

                {/* Bottom info overlay */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10">
                    <div className="flex flex-col items-center gap-1.5">
                        <div className="bg-white/95 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-lg">
                            <span className="text-sm md:text-lg font-bold text-gray-900">
                                ${item.finalPrice?.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center gap-1 md:gap-1.5 text-white/90 text-[10px] md:text-xs font-medium">
                            <Check size={10} className="text-green-400 md:w-3 md:h-3" />
                            <span>{item.total} disponibles</span>
                        </div>
                    </div>
                </div>

                {/* Quick add button on hover */}
                {isAvailable && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 z-20">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(e, item, type);
                            }}
                            disabled={isAdding}
                            className="w-9 h-9 rounded-full bg-white/95 shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200"
                        >
                            {isAdding ? (
                                <Spinner size="sm" color="primary" />
                            ) : (
                                <ShoppingBag size={16} />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KioskCategoryCard;
