import { useEffect, useState } from "react";
import {
  setComboThunk,
  fetchCombosByNameThunk,
} from "../features/user/comboSlice";
import { useDispatch, useSelector } from "react-redux";
import CardCombo from "../Components/CardCombo";
import IsLoading from "../Components/IsLoading";
import ViewNotificationImg from "../Components/Notifications/ViewNotificationImg";
import { Input, Pagination, Select, SelectItem } from "@heroui/react";
import { Search, Filter } from "lucide-react";
import dksoluciones from "../api/config";
import getConfig from "../utils/config";

const ROWS_PER_PAGE = 10;
const DEBOUNCE_DELAY = 400;

// Mapeo de nombres de DB a nombres amigables
const CATEGORY_NAMES = {
  amazon_prime: "Amazon Prime Video",
  Netflix: "Netflix",
  hbo_max: "HBO Max",
  Dpremium: "Disney+ Premium",
  Dbasico: "Disney+ Básico",
  Destandar: "Disney+ Estándar",
  Dpromocion: "Disney+ Promoción",
  star_plus: "Star+",
  Paramount_plus: "Paramount+",
  vix: "ViX",
  plex: "Plex",
  crunchyroll: "Crunchyroll",
  profenet: "Profenet",
  iptv: "IPTV Premium",
  iptvbasico: "IPTV Básico",
  iptvmes: "IPTV Mensual",
  YouTube: "YouTube Premium",
  tidal: "Tidal",
  spotify: "Spotify",
  dezzer: "Deezer",
  apple_music: "Apple Music",
  apple_tv: "Apple TV+",
  canva: "Canva Pro",
  universal: "Universal+",
  pornhub: "Pornhub Premium",
  Duolingo: "Duolingo Plus",
  rakuten: "Rakuten Viki",
  calm: "Calm",
  mubi: "MUBI",
  wasender: "WaSender",
  regalo: "Regalo",
  regalo2: "Regalo Extra",
  napster: "Napster",
  tvmia: "TV Mía",
  Microsoft: "Microsoft 365",
  netflix_extra: "Netflix Extra",
  netflix_semi: "Netflix Semi",
  McAfee: "McAfee",
  atresplayer: "Atresplayer",
  wacrm: "WA CRM",
  crm: "CRM",
  wadefender: "WA Defender",
  xxx: "Contenido Adulto",
  directvgo: "DirecTV Go",
};

// Función para obtener nombre amigable
const getFriendlyName = (dbName) => {
  return CATEGORY_NAMES[dbName] || dbName;
};

const Combos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();
  const combos = useSelector((state) => state.combos);
  const isLoadingState = useSelector((state) => state.isLoading);
  const totalCombos = useSelector((state) => state.totalItems);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await dksoluciones.get("categoriesCP/", getConfig());
        setCategories(res.data.data || []);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Debounce del término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Resetear página cuando cambia el término de búsqueda o categoría
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm, selectedCategory]);

  // Fetch de datos cuando cambia el término debounced, categoría o página
  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      dispatch(fetchCombosByNameThunk({ name: debouncedSearchTerm, page }));
    } else {
      dispatch(setComboThunk({ page, categoryId: selectedCategory }));
    }
  }, [debouncedSearchTerm, selectedCategory, dispatch, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryChange = (keys) => {
    const selectedKey = Array.from(keys)[0];
    if (selectedKey === "all" || !selectedKey) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(parseInt(selectedKey));
      setSearchTerm(""); // Limpiar búsqueda al filtrar por categoría
    }
  };

  const totalPages = Math.ceil(totalCombos / ROWS_PER_PAGE) || 1;

  return (
    <>
      <ViewNotificationImg />
      {isLoadingState ? (
        <IsLoading />
      ) : (
        <div className="min-h-screen py-4 md:py-6">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                Catálogo de Combos
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Descubre nuestras cuentas premium · Calidad garantizada
              </p>
            </div>

            {/* Filtros: Búsqueda y Select de categoría */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10 max-w-3xl mx-auto">
              {/* Búsqueda */}
              <div className="w-full sm:flex-1">
                <Input
                  isClearable
                  placeholder="Buscar combos..."
                  startContent={<Search className="text-gray-400" size={20} />}
                  value={searchTerm}
                  onClear={() => setSearchTerm("")}
                  onValueChange={(value) => {
                    setSearchTerm(value);
                    if (value.trim()) {
                      setSelectedCategory(null);
                    }
                  }}
                  size="lg"
                  variant="flat"
                  classNames={{
                    inputWrapper: "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors",
                    input: "text-slate-900 dark:text-white font-medium",
                  }}
                />
              </div>

              {/* Select de categoría */}
              {categories.length > 0 && (
                <div className="w-full sm:w-64">
                  <Select
                    placeholder="Filtrar por plataforma"
                    startContent={<Filter className="text-gray-400" size={18} />}
                    size="lg"
                    variant="flat"
                    selectedKeys={selectedCategory ? [String(selectedCategory)] : ["all"]}
                    onSelectionChange={handleCategoryChange}
                    classNames={{
                      trigger: "bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors",
                      value: "text-slate-900 dark:text-white font-medium",
                    }}
                  >
                    <SelectItem key="all" value="all">
                      Todas las plataformas
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={String(category.id)} value={String(category.id)}>
                        {getFriendlyName(category.name)}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              )}
            </div>

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {combos.length > 0 ? (
                combos.map((combo) => (
                  <CardCombo
                    key={combo.id}
                    combo={combo}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-24">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                      <Search className="text-gray-400" size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      No se encontraron combos
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {selectedCategory
                        ? "No hay combos en esta categoría"
                        : "Intenta con otros términos de búsqueda"}
                    </p>
                    {selectedCategory && (
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Ver todos los combos
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-16">
                <Pagination
                  showControls
                  total={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  variant="flat"
                  size="lg"
                  classNames={{
                    cursor: "bg-blue-600 text-white font-bold shadow-lg",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Combos;
