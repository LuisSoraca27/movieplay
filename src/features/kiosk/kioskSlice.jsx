import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dksoluciones from '../../api/config';

// --- Async Thunks ---

// PUBLIC ACTIONS

export const fetchPublicKiosk = createAsyncThunk(
    'kiosk/fetchPublicKiosk',
    async (slug, { rejectWithValue }) => {
        try {
            if (!slug) {
                return rejectWithValue('Slug del kiosco es requerido');
            }
            const response = await dksoluciones.get(`kiosk/${slug}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener el kiosco');
        }
    }
);

export const fetchKioskProducts = createAsyncThunk(
    'kiosk/fetchKioskProducts',
    async ({ slug, categoryId, type }, { rejectWithValue }) => {
        try {
            let query = '';
            if (categoryId) query += `?categoryId=${categoryId}`;
            if (type) query += `${query ? '&' : '?'}type=${type}`;

            const response = await dksoluciones.get(`kiosk/${slug}/products${query}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener productos');
        }
    }
);

export const fetchKioskCategories = createAsyncThunk(
    'kiosk/fetchKioskCategories',
    async (slug, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.get(`kiosk/${slug}/categories`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener categorías');
        }
    }
);

// VENDOR ACTIONS (Protected)

export const fetchMyKiosk = createAsyncThunk(
    'kiosk/fetchMyKiosk',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.get('kiosk/my/info');
            return response.data.data;
        } catch (error) {
            // Check if error is 404 (User doesn't have a kiosk yet) - handle gracefully
            if (error.response?.status === 404) {
                // Return null or specific string to indicate "No Kiosk Created"
                // We'll treat this not as a fatal error but as empty state
                return rejectWithValue('Kiosco no encontrado');
            }
            return rejectWithValue(error.response?.data?.message || 'Error al obtener mi kiosco');
        }
    }
);

export const createKiosk = createAsyncThunk(
    'kiosk/createKiosk',
    async (kioskData, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.post('kiosk', kioskData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al crear kiosco');
        }
    }
);

export const updateKiosk = createAsyncThunk(
    'kiosk/updateKiosk',
    async (kioskData, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.put('kiosk/my/info', kioskData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar kiosco');
        }
    }
);

export const uploadKioskLogo = createAsyncThunk(
    'kiosk/uploadKioskLogo',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('logo', file);
            const response = await dksoluciones.post('kiosk/my/logo', formData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al subir el logo');
        }
    }
);

export const getMarkupConfiguration = createAsyncThunk(
    'kiosk/getMarkupConfiguration',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.get('kiosk/my/markup');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error obtener configuración de precios');
        }
    }
);

export const fetchAllCategoriesForMarkup = createAsyncThunk(
    'kiosk/fetchAllCategoriesForMarkup',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.get('kiosk/my/categories');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener categorías');
        }
    }
);

export const updateCategoryMarkup = createAsyncThunk(
    'kiosk/updateCategoryMarkup',
    async (markupData, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.put('kiosk/my/markup', markupData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar precios');
        }
    }
);

// Fetch products preview (for vendor to see how products will appear)
export const fetchProductsPreview = createAsyncThunk(
    'kiosk/fetchProductsPreview',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.get('kiosk/my/products-preview');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener vista previa');
        }
    }
);

const initialState = {
    // Public View State
    publicKiosk: null,
    products: { profiles: [], accounts: [], combos: [], licenses: [] },
    categories: [],

    // Vendor Management State
    myKiosk: null,
    markupConfig: [],
    profileCategories: [],
    accountCategories: [],
    combosList: [],      // System combos
    licensesList: [],    // System licenses
    productsPreview: [],
    previewSummary: null,

    // UI State
    isLoading: false,
    error: null,
    successMessage: null
};

const kioskSlice = createSlice({
    name: 'kiosk',
    initialState,
    reducers: {
        clearKioskErrors: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        resetPublicKiosk: (state) => {
            state.publicKiosk = null;
            state.products = { profiles: [], accounts: [], combos: [], licenses: [] };
            state.categories = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Public Kiosk
            .addCase(fetchPublicKiosk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPublicKiosk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.publicKiosk = action.payload;
            })
            .addCase(fetchPublicKiosk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Products
            .addCase(fetchKioskProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchKioskProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                // New format: { profiles: [], accounts: [] }
                state.products = action.payload;
            })
            .addCase(fetchKioskProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.products = { profiles: [], accounts: [], combos: [], licenses: [] };
            })

            // Categories
            .addCase(fetchKioskCategories.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchKioskCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            .addCase(fetchKioskCategories.rejected, (state, action) => {
                state.error = action.payload;
                state.categories = [];
            })

            // Vendor Kiosk (My Kiosk)
            .addCase(fetchMyKiosk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMyKiosk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myKiosk = action.payload;
            })
            .addCase(fetchMyKiosk.rejected, (state, action) => {
                state.isLoading = false;
                state.myKiosk = null; // Reset to null when not found
                // Don't set global error if just not found (user hasn't created one yet)
                if (action.payload !== 'Kiosco no encontrado') {
                    state.error = action.payload;
                }
            })

            // Create/Update
            .addCase(createKiosk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createKiosk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myKiosk = action.payload;
                state.successMessage = 'Kiosco creado exitosamente';
            })
            .addCase(createKiosk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(updateKiosk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateKiosk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.myKiosk = action.payload;
                state.successMessage = 'Kiosco actualizado exitosamente';
            })
            .addCase(updateKiosk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Upload Logo
            .addCase(uploadKioskLogo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(uploadKioskLogo.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.myKiosk) {
                    state.myKiosk.logoUrl = action.payload.logoUrl;
                    state.myKiosk.logo = action.payload.logo;
                }
                state.successMessage = 'Logo actualizado correctamente';
            })
            .addCase(uploadKioskLogo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Markup
            .addCase(getMarkupConfiguration.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMarkupConfiguration.fulfilled, (state, action) => {
                state.isLoading = false;
                state.markupConfig = action.payload;
            })
            .addCase(getMarkupConfiguration.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.markupConfig = [];
            })
            .addCase(fetchAllCategoriesForMarkup.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllCategoriesForMarkup.fulfilled, (state, action) => {
                state.isLoading = false;
                // New format: { profiles, accounts, combos, licenses }
                state.profileCategories = action.payload.profiles || [];
                state.accountCategories = action.payload.accounts || [];
                state.combosList = action.payload.combos || [];
                state.licensesList = action.payload.licenses || [];
            })
            .addCase(fetchAllCategoriesForMarkup.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.profileCategories = [];
                state.accountCategories = [];
                state.combosList = [];
                state.licensesList = [];
            })
            .addCase(updateCategoryMarkup.fulfilled, (state, action) => {
                // Update local state - now includes productType
                const updatedMarkup = action.payload;
                const index = state.markupConfig.findIndex(
                    m => m.categoryId === updatedMarkup.categoryId && m.productType === updatedMarkup.productType
                );
                if (index !== -1) {
                    state.markupConfig[index] = updatedMarkup;
                } else {
                    state.markupConfig.push(updatedMarkup);
                }
            })
            .addCase(updateCategoryMarkup.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Products Preview
            .addCase(fetchProductsPreview.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProductsPreview.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productsPreview = action.payload.products || [];
                state.previewSummary = action.payload.summary || null;
            })
            .addCase(fetchProductsPreview.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.productsPreview = [];
                state.previewSummary = null;
            });
    }
});

export const { clearKioskErrors, resetPublicKiosk } = kioskSlice.actions;
export default kioskSlice.reducer;
