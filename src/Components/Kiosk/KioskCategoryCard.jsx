import React from 'react';
import { Spinner } from '@heroui/react';
import { ShoppingBag, Check } from 'lucide-react';
import { getCategoryImage, getCategoryBackground } from '../../utils/categoryImages';
import '../../style/cardprofile.css';

const KioskCategoryCard = ({ item, type, onCardClick, onAddToCart, isAdding }) => {
    const [img, displayName] = getCategoryImage(item.categoryName);
    const isAvailable = parseInt(item.total) > 0;
    const backgroundClass = getCategoryBackground(item.categoryName);

    return (
        <div className="relative group kiosk-card-wrapper">
            <div
                className={`card-profile ${backgroundClass} ${!isAvailable ? 'no-available' : ''}`}
                onClick={() => onCardClick(item, type)}
                style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
            >
                {/* Top notch design - original */}
                <div className="container-eyelash">
                    <div className="eyelash-circle"></div>
                    <div className="eyelash"></div>
                </div>

                {/* Logo - original position */}
                {img && (
                    <img
                        src={img}
                        alt={displayName}
                        className="transition-transform duration-300 group-hover:scale-110"
                        style={{
                            width: item.logoSize === 'small' ? '50%' : item.logoSize === 'large' ? '90%' : item.logoSize === 'full' ? '100%' : '75%',
                            maxHeight: item.logoSize === 'small' ? '80px' : item.logoSize === 'large' ? '180px' : item.logoSize === 'full' ? '100%' : '130px',
                            objectFit: 'contain',
                        }}
                    />
                )}

                {/* Bottom info overlay - nuevo diseño */}
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10">
                    <div className="flex flex-col items-center gap-1.5">
                        {/* Price tag */}
                        <div className="bg-white/95 backdrop-blur-md px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-lg">
                            <span className="text-sm md:text-lg font-bold text-gray-900">
                                ${item.finalPrice?.toLocaleString()}
                            </span>
                        </div>
                        {/* Stock info */}
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
