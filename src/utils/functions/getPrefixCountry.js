

export default function getPrefixCountry(country) {

    if(!country) return '--' 

    const countryReplace = country.replace(/\s+/g, '')
    const countryCodes = {
        Afganistán: '93',
        Alemania: '49',
        ArabiaSaudita: '966',
        Argentina: '54',
        Australia: '61',
        Bélgica: '32',
        Bolivia: '591',
        Brasil: '55',
        Canadá: '1',
        Chile: '56',
        China: '86',
        Colombia: '57',
        CoreaDelSur: '82',
        CostaRica: '506',
        Cuba: '53',
        Dinamarca: '45',
        Ecuador: '593',
        Egipto: '20',
        ElSalvador: '503',
        España: '34',
        EstadosUnidos: '1',
        Francia: '33',
        Grecia: '30',
        Guatemala: '502',
        Honduras: '504',
        India: '91',
        Indonesia: '62',
        Irán: '98',
        Irlanda: '353',
        Israel: '972',
        Italia: '39',
        Japón: '81',
        México: '52',
        Nicaragua: '505',
        Noruega: '47',
        Panamá: '507',
        Paraguay: '595',
        Perú: '51',
        Portugal: '351',
        ReinoUnido: '44',
        Rusia: '7',
        Suecia: '46',
        Suiza: '41',
        Uruguay: '598',
        Venezuela: '58',
        Otro: '--' 
    };
    
    return "+" + countryCodes[countryReplace] || '--';
}