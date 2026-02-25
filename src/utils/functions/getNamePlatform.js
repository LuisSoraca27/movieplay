
export default function getNamePlatform(name) {
    switch (name) {
        case 'amazon_prime':
            return 'Prime Video';
        case 'netflix':
            return 'Netflix';
        case 'hbo_max':
            return 'Max';
        case 'star_plus':
            return 'Disney+ Premium'
        case 'paramount_plus':
            return 'Paramount+';
        case 'vix':
            return 'Vix+';
        case 'plex':
            return 'Plex';
        case 'crunchyroll':
            return 'Crunchyroll';
        case 'iptv':
            return 'IPTV';
        case 'apple_tv':
            return 'Apple TV';
        case 'youtube':
            return 'YouTube Premium';
        case 'deezer':
            return 'Deezer';
        case 'canva':
            return 'Canva';
        case 'wasender':
            return 'WASender';
        case 'rakuten':
            return 'Rakuten Viki';
        case 'spotify':
            return 'Spotify';
        case 'tidal':
            return 'Tidal';
        case 'apple_music':
            return 'Apple Music';
        case 'pornhub':
            return 'Pornhub';
        case 'calm':
            return 'Calm';
        case 'duolingo':
            return 'Duolingo';
        case 'universal':
            return 'Universal+';
        case 'napster':
            return 'Napster';
        case 'tvmia':
            return 'TVMia';
        case 'combo_plus':
            return 'Combo+';
        case 'Dbasico':
            return 'Disney+ Basico';
        case 'Destandar':
            return 'Disney+ Estándar';
        case 'Dpremium':
            return 'Disney+ Premium';
        case 'profenet':
            return 'El profenet';
        case 'regalo':
            return 'Regalo';
        case 'mubi':
            return 'Mubi';
        case 'microsoft365':
            return 'Microsoft 365';
        default:
            return 'Unknown';
    }
}