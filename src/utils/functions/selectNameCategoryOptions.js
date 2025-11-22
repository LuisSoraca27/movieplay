export const optionsCategory = [
  { name: "Netflix", code: "2" },
  { name: "Max Premium", code: "3" },
  { name: "Max Estándar", code: "17" },
  { name: "Disney+ Premium", code: "4" },
  { name: "Disney+ Estándar", code: "15" },
  { name: "Disney+ Basico", code: "16" },
  { name: "Amazon Prime Video", code: "1" },
  { name: "Paramount+", code: "5" },
  { name: "Vix+", code: "6" },
  { name: "Plex", code: "7" },
  { name: "Crunchyroll", code: "8" },
  { name: "Black Code", code: "9" },
  { name: "Iptv", code: "10" },
  { name: "Rakuten Viki", code: "13" },
  { name: "Flujo TV", code: "14" },
  { name: "Mubi", code: "19" },
  { name: "Universal+", code: "21" },
  { name: "ClaroVideo", code: "25" },
  { name: "DirectTv GO", code: "26" },
  { name: "Apple Tv", code: "27" },
  { name: "Netflix Extra", code: "28" },
  { name: "Wplay", code: "31" },
  { name: "CapCut", code: "33" },
  { name: "Amazon Music", code: "34" }
];

export const selectCategoriesCPs = (categories = []) => {
  const categoriesFilter = categories.map((category) => {
    const categoryOption = optionsCategory.find(
      (option) => String(option.code) === String(category.id)
    );
    return categoryOption || null; // Retorna null si no encuentra la categoría
  });

  return categoriesFilter;
};

export const getCategoryColor = (categoryId) => {
  const categoryOption = optionsCategory.find(
    (option) => String(option.code) === String(categoryId)
  );
  return categoryOption;
};
