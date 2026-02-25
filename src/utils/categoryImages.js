// Mapeo de categorías a imágenes y nombres
import netflix from "../assets/img/netflix.png";
import amazon_prime from "../assets/img/amazon_prime.png";
import hbo from "../assets/img/hbo_max.png";
import crunchyroll from "../assets/img/crunchyroll.webp";
import paramount_plus from "../assets/img/paramount-plus.png";
import plex from "../assets/img/plex.png";
import vix from "../assets/img/vix.png";
import iptv from "../assets/img/iptv.png";
import iptvmes from "../assets/img/iptvmes.png";
import iptvbasico from "../assets/img/iptvbasico.png";
import universal from "../assets/img/universal_plus.png";
import pornhub from "../assets/img/pornhub.png";
import apple_tv from "../assets/img/apple_tv.png";
import mubi from "../assets/img/mubi.png";
import rakuten from "../assets/img/rakuten.png";
import profenet from "../assets/img/profenet.png";
import tvmia from "../assets/img/tvmia.png";
import netflix_extra from "../assets/img/netflix_extra.png";
import Dbasico from "../assets/img/Dbasico.png";
import Destandar from "../assets/img/Destandar.png";
import Dpremium from "../assets/img/Dpremium.png";
import microsoft365 from "../assets/img/microsoft365.png";
import wasender from "../assets/img/wasender.png";
import crmwa from "../assets/img/crmwa.png";
import wadefender from "../assets/img/wadefender.png";
import mcafee from "../assets/img/mcafee.png";
import wacrm from "../assets/img/wacrm.png";
import netflix_semi from "../assets/img/netflix_semi.png";
import xxx from "../assets/img/xxx.png";
import atresplayer from "../assets/img/atresplayer.png";
import Dpromocion from "../assets/img/Dpromocion.png";
import spotify from "../assets/img/spotify.webp";
import directvgo from "../assets/img/directvgo.png";
import regalo from "../assets/img/regalo.png";
import nextmovie from "../assets/img/nextmovie.png";
import picsart from "../assets/img/picsart.png";
import jellyfin from "../assets/img/jellyfin.png";
import chatgpt from "../assets/img/chatgpt.png";
// Additional for accounts
import tidal from "../assets/img/tidal.png";
import youtube from "../assets/img/youtube.png";
import deezer from "../assets/img/deezer.webp";
import canva from "../assets/img/canva.png";
import apple_music from "../assets/img/apple_music.png";
import calm from "../assets/img/calm.png";
import duolingo from "../assets/img/duolingo.png";
import napster from "../assets/img/napster.png";

// Mapeo: categoryName => [imagen, nombreDisplay]
export const categoryImageMap = {
    netflix: [netflix, "Netflix Original"],
    amazon_prime: [amazon_prime, "Amazon Prime Video"],
    hbo_max: [hbo, "MAX"],
    crunchyroll: [crunchyroll, "Crunchyroll"],
    profenet: [profenet, "El profenet"],
    paramount_plus: [paramount_plus, "Paramount+"],
    vix: [vix, "Vix+"],
    plex: [plex, "Next Movie"],
    iptv: [iptv, "IPTV Promoción"],
    iptvbasico: [iptvbasico, "IPTV Básico"],
    iptvmes: [iptvmes, "IPTV"],
    apple_tv: [apple_tv, "Apple TV"],
    pornhub: [pornhub, "Pornhub"],
    rakuten: [rakuten, "Rakuten Viki"],
    mubi: [mubi, "Mubi"],
    universal: [universal, "Universal+"],
    Dbasico: [Dbasico, "Disney+ Basico"],
    Destandar: [Destandar, "Disney+ Estándar"],
    Dpremium: [Dpremium, "Disney+ Premium"],
    tvmia: [tvmia, "TVMia"],
    microsoft365: [microsoft365, "Microsoft 365"],
    wasender: [wasender, "WASender"],
    netflix_extra: [netflix_extra, "Netflix Extra Internacional"],
    crm: [crmwa, "CRM"],
    wadefender: [wadefender, "WACRM"],
    mcafee: [mcafee, "McAfee"],
    wacrm: [wacrm, "WACRM"],
    atresplayer: [atresplayer, "AtrePlayer"],
    xxx: [xxx, "XXX"],
    Dpromocion: [Dpromocion, "Disney+ Promoción"],
    spotify: [spotify, "Spotify"],
    netflix_semi: [netflix_semi, "Netflix SemiOriginal"],
    directvgo: [directvgo, "DIRECTV GO"],
    regalo: [regalo, "Regalo"],
    nextmovie: [nextmovie, "Next Movie"],
    picsart: [picsart, "Picsart"],
    jellyfin: [jellyfin, "Jellyfin"],
    chatgpt: [chatgpt, "ChatGPT"],
    // Additional categories for accounts
    tidal: [tidal, "Tidal"],
    youtube: [youtube, "Youtube"],
    dezzer: [deezer, "Deezer"],
    canva: [canva, "Canva"],
    apple_music: [apple_music, "Apple Music"],
    calm: [calm, "Calm"],
    duolingo: [duolingo, "Duolingo"],
    napster: [napster, "Napster"],
};

// Helper para obtener imagen y nombre
export const getCategoryImage = (categoryName) => {
    return categoryImageMap[categoryName] || [null, categoryName];
};

// Helper para obtener el nombre del background CSS
export const getCategoryBackground = (categoryName) => {
    return `background-${categoryName}`;
};
