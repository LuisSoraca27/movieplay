import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody } from "@heroui/react";
import { Share2 } from 'lucide-react';

const SocialCard = ({ platform, url, icon, color }) => {
  if (!url) return null;
  const href = url.startsWith('http') ? url : (platform === 'Facebook' ? 'https://facebook.com/' + url : 'https://instagram.com/' + url.replace('@', ''));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="flex items-center gap-5 p-5 bg-white/[0.03] border border-white/10 rounded-[2rem] transition-all duration-300 group-hover:bg-white/[0.06] group-hover:border-white/20 backdrop-blur-md shadow-2xl">
        <div
          className="relative w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 text-white overflow-hidden shadow-lg"
          style={{ backgroundColor: color }}
        >
          {icon === 'facebook' ? (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
              <path
                d="M17 2H14C12.6739 2 11.4021 2.52678 10.4645 3.46447C9.52678 4.40215 9 5.67392 9 7V10H6V14H9V22H13V14H16L17 10H13V7C13 6.73478 13.1054 6.48043 13.2929 6.29289C13.4804 6.10536 13.7348 6 14 6H17V2Z"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : icon === 'instagram' ? (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
              <rect
                x="2"
                y="2"
                width="20"
                height="20"
                rx="5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="18" cy="6" r="1.5" fill="currentColor" />
            </svg>
          ) : icon === 'tiktok' ? (
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.79a4.84 4.84 0 0 1-1-.1z" />
            </svg>
          ) : (
            <Share2 size={28} strokeWidth={2.5} className="text-white" />
          )}
          {/* Subtle light effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-1 group-hover:text-white/60 transition-colors">
            {platform}
          </h3>
          <p className="text-lg font-black text-white tracking-tight truncate">
            {url?.replace(/^https?:\/\//, '').replace('www.', '').split('/')[0] || platform}
          </p>
        </div>
      </div>
    </a>
  );
};

const SOCIAL_CONFIG = [
  { key: 'instagram', platform: 'Instagram', icon: 'instagram', color: '#E4405F' },
  { key: 'facebook', platform: 'Facebook', icon: 'facebook', color: '#1877F2' },
  { key: 'twitter', platform: 'Twitter / X', icon: 'twitter', color: '#1DA1F2' },
  { key: 'tiktok', platform: 'TikTok', icon: 'tiktok', color: '#000000' },
  { key: 'youtube', platform: 'YouTube', icon: 'youtube', color: '#FF0000' },
  { key: 'telegram', platform: 'Telegram', icon: 'telegram', color: '#0088cc' },
];

const SocialSection = () => {
  const publicSettings = useSelector((state) => state.storeSettings.publicSettings);
  const socialLinks = publicSettings?.socialLinks || {};

  const cards = SOCIAL_CONFIG
    .map((item) => ({
      ...item,
      url: socialLinks[item.key]
    }))
    .filter((item) => item.url);

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-10 w-1.5 bg-blue-500 rounded-full" />
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Redes Sociales</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.length > 0 ? (
          cards.map((item) => (
            <SocialCard
              key={item.key}
              platform={item.platform}
              url={item.url}
              icon={item.icon}
              color={item.color}
            />
          ))
        ) : (
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-4">No hay redes sociales configuradas.</p>
        )}
      </div>
    </div>
  );
};

export default SocialSection;