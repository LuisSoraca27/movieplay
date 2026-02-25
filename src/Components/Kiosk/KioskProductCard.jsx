import React from 'react';
import { Spinner } from '@heroui/react';
import { Package, FileKey, ShoppingBag } from 'lucide-react';

const KioskProductCard = ({ item, type, onCardClick, onAddToCart, isAdding }) => {
    const isCombo = type === 'combo';
    const Icon = isCombo ? Package : FileKey;

    const hasImage = !!item.image && item.image.length > 0;


    const gradients = {
        combo: 'linear-gradient(135deg, #2D2E32 0%, #1C1D1F 50%, #000000 100%)',
        license: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #dc2626 100%)',
    };

    return (
        <div className="kiosk-product-wrapper group">
            <div
                onClick={() => onCardClick(item, type)}
                className="kiosk-product-card"
                style={{
                    background: hasImage ? 'transparent' : (gradients[type] || gradients.combo)
                }}
            >
                {/* Background image */}
                {hasImage && (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{
                            backgroundImage: `url(${item.image})`,
                            filter: 'brightness(0.85)'
                        }}
                    />
                )}

                {/* Gradient overlay for image - stronger at bottom for text readability */}
                {hasImage && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />
                )}

                {/* Decorative elements (only when no image) */}
                {!hasImage && (
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                        <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-black/10 rounded-full blur-xl" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />
                    </div>
                )}

                {/* Shimmer effect overlay */}
                <div className="shimmer-overlay" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col text-white">
                    {/* Icon (only when no image) */}
                    {!hasImage && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
                            <Icon size={100} />
                        </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-medium">
                        {isCombo ? <Package size={12} /> : <FileKey size={12} />}
                        <span>{isCombo ? 'Combo' : 'Más Servicios'}</span>
                    </div>

                    {/* Spacer to push content to bottom */}
                    <div className="flex-1" />

                    {/* Text content with background panel */}
                    <div className="p-4 space-y-3">
                        {/* Title with background */}
                        <div className="bg-black/60 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                            <h3 className="text-base font-bold text-center leading-tight line-clamp-2">
                                {item.name}
                            </h3>
                        </div>

                        {/* Description */}
                        {item.description && (
                            <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/10">
                                <p className="text-xs text-white/90 text-center line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex justify-center">
                            <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border-2 border-white">
                                <span className="font-bold text-xl text-gray-900">
                                    ${item.finalPrice?.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <style>{`
                .kiosk-product-wrapper {
                    margin: 15px;
                }
                
                .kiosk-product-card {
                    width: 240px;
                    height: 320px;
                    border-radius: 20px;
                    overflow: hidden;
                    cursor: pointer;
                    position: relative;
                    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.3);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .kiosk-product-card:hover {
                    transform: translateY(-12px) scale(1.02);
                    box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.4);
                }
                
                .kiosk-product-wrapper .shimmer-overlay {
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        45deg,
                        transparent 40%,
                        rgba(255, 255, 255, 0.15) 50%,
                        transparent 60%
                    );
                    transform: translateX(-100%) rotate(45deg);
                    transition: transform 0.6s ease;
                    pointer-events: none;
                    z-index: 5;
                }
                
                .kiosk-product-wrapper:hover .shimmer-overlay {
                    transform: translateX(100%) rotate(45deg);
                }
                
                @media (max-width: 640px) {
                    .kiosk-product-wrapper {
                        margin: 8px;
                    }
                    
                    .kiosk-product-card {
                        width: 160px;
                        height: 220px;
                        border-radius: 16px;
                    }
                    
                    .kiosk-product-card h3 {
                        font-size: 0.9rem;
                    }
                    
                    .kiosk-product-card .absolute.top-3.left-3 {
                        top: 8px;
                        left: 8px;
                        padding: 4px 8px;
                        font-size: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default KioskProductCard;
