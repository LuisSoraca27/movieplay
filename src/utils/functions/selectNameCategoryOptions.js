export const optionsCategory = [
  { name: "Prime Video", code: "1" },
  { name: "Netflix", code: "2" },
  { name: "Max", code: "3" },
  { name: "Disney+ Premium", code: "4" },
  { name: "Disney+ Estandar", code: "30" },
  { name: "Disney+ Basico", code: "29" },
  { name: "Paramount+", code: "6" },
  { name: "Vix+", code: "7" },
  { name: "Plex", code: "8" },
  { name: "Crunchyroll", code: "9" },
  { name: "El ProfeNet", code: "10" },
  { name: "Iptv Promoción", code: "11" },
  { name: "Youtube Premium", code: "12" },
  { name: "Tidal", code: "13" },
  { name: "Spotify", code: "14" },
  { name: "Deezer", code: "15" },
  { name: "Apple Music", code: "16" },
  { name: "Canva", code: "17" },
  { name: "Universal+", code: "18" },
  { name: "Apple TV", code: "19" },
  { name: "Pornhub", code: "20" },
  { name: "Duolingo", code: "21" },
  { name: "Rakuten Viki", code: "22" },
  { name: "Calm", code: "23" },
  { name: "Mubi", code: "24" },
  { name: "WASender", code: "25" },
  { name: "Napster", code: "27" },
  { name: "TvMia", code: "28" },
  { name: "Microsoft 365", code: "31" },
  { name: "Netflix Extra", code: "32" },
  { name: "Macfee", code: "33" },
  { name: "AtresPlayer", code: "34" },
  { name: "WaCrm", code: "35" },
  { name: "Crm", code: "36" },
  { name: "WaDefender", code: "37" },
  { name: "XXX", code: "38" },
  { name: "Iptv Basico", code: "39" },
  { name: "Iptv Mes", code: "40" },
  { name: "Regalo", code: "26" },
  { name: "Regalo 2", code: "41" },
  { name: "Disney+ Promoción", code: "42" },
  { name: "Netlix SemiOriginal", code: "43" },
  { name: "Directv GO", code: "44" },
  { name: "Next Movie", code: "45"},
  { name: "Picsart", code: "46"},
  { name: "Jellyfin", code: "47"},
  { name: "ChatGPT", code: "48"}

];

export const selectCategoriesCPs = (categories = []) => {
  const categoriesProfile = [];
  const categoriesAccount = [];

  categories.forEach((category) => {
    const option = optionsCategory.find(
      (option) => String(option.code) === String(category.id)
    );

    if (option) {
      if (category.ComboCategory.typeAccount === "profile") {
        categoriesProfile.push(option);
      } else if (category.ComboCategory.typeAccount === "account") {
        categoriesAccount.push(option);
      }
    }
  });

  return { categoriesProfile, categoriesAccount };
};


export const getCategoryColor = (categoryId) => {
  const categoryOption = optionsCategory.find(
    (option) => String(option.code) === String(categoryId)
  );
  return categoryOption;
};

// Nueva función para obtener el ID (code) por nombre
export const getCategoryIdByName = (categoryName) => {
  if (!categoryName) return null;
  const category = optionsCategory.find(
    option => option.name.toLowerCase() === categoryName.toLowerCase()
  );
  // Devolver el 'code' como número si se encuentra, sino null
  return category ? parseInt(category.code, 10) : null; 
};
