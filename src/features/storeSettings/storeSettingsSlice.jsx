import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dksoluciones from '../../api/config';

// --- Async Thunks ---

/**
 * Obtener configuración pública de la tienda (sin autenticación)
 */
export const fetchPublicStoreSettings = createAsyncThunk(
    'storeSettings/fetchPublicStoreSettings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.get('store-settings/public');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener configuración de la tienda');
        }
    }
);

/**
 * Obtener configuración completa (solo admin)
 */
export const fetchStoreSettings = createAsyncThunk(
    'storeSettings/fetchStoreSettings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.get('store-settings');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener configuración');
        }
    }
);

/**
 * Actualizar configuración (solo admin)
 */
const getErrorMessage = (error, fallback) => {
    const msg = error.response?.data?.message;
    if (Array.isArray(msg)) return msg[0] || fallback;
    if (typeof msg === 'string') return msg;
    if (error.response?.data?.error?.message) return error.response.data.error.message;
    if (error.message) return error.message;
    return fallback;
};

export const updateStoreSettings = createAsyncThunk(
    'storeSettings/updateStoreSettings',
    async (settingsData, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.put('store-settings', settingsData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, 'Error al actualizar configuración'));
        }
    }
);

/**
 * Subir logo de la tienda
 */
export const uploadStoreLogo = createAsyncThunk(
    'storeSettings/uploadStoreLogo',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('logo', file);

            const response = await dksoluciones.post('store-settings/logo', formData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al subir logo');
        }
    }
);

/**
 * Eliminar logo
 */
export const deleteStoreLogo = createAsyncThunk(
    'storeSettings/deleteStoreLogo',
    async (_, { rejectWithValue }) => {
        try {
            await dksoluciones.delete('store-settings/logo');
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al eliminar logo');
        }
    }
);

/**
 * Subir favicon
 */
export const uploadStoreFavicon = createAsyncThunk(
    'storeSettings/uploadStoreFavicon',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('favicon', file);

            const response = await dksoluciones.post('store-settings/favicon', formData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al subir favicon');
        }
    }
);

// Helper: leer publicSettings cacheadas de localStorage
const getCachedPublicSettings = () => {
    try {
        const cached = localStorage.getItem('publicSettings');
        return cached ? JSON.parse(cached) : null;
    } catch {
        return null;
    }
};

const initialState = {
    // Configuración de la tienda
    settings: null,
    publicSettings: getCachedPublicSettings(),

    // UI State
    isLoading: false,
    isSaving: false,
    error: null,
    successMessage: null
};

const storeSettingsSlice = createSlice({
    name: 'storeSettings',
    initialState,
    reducers: {
        clearStoreSettingsErrors: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Public Settings
            .addCase(fetchPublicStoreSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPublicStoreSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.publicSettings = action.payload;
                // Cachear en localStorage para cargas instantáneas futuras
                try { localStorage.setItem('publicSettings', JSON.stringify(action.payload)); } catch { }
            })
            .addCase(fetchPublicStoreSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Fetch Settings (Admin)
            .addCase(fetchStoreSettings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchStoreSettings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.settings = action.payload;
            })
            .addCase(fetchStoreSettings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Update Settings
            .addCase(updateStoreSettings.pending, (state) => {
                state.isSaving = true;
                state.error = null;
            })
            .addCase(updateStoreSettings.fulfilled, (state, action) => {
                state.isSaving = false;
                state.settings = action.payload;
                state.successMessage = 'Configuración guardada correctamente';
                // Actualizar también publicSettings para que Soporte, Footer, etc. muestren los datos nuevos sin recargar
                const p = action.payload;
                const newPublic = {
                    storeName: p.storeName,
                    storeDescription: p.storeDescription,
                    logo: p.logoUrl ?? p.logo,
                    favicon: p.faviconUrl ?? p.favicon,
                    socialLinks: p.socialLinks,
                    contactEmail: p.contactEmail,
                    contactPhone: p.contactPhone,
                    businessHours: p.businessHours,
                    timezone: p.timezone,
                    welcomeMessage: p.welcomeMessage,
                    footerMessage: p.footerMessage,
                    maintenanceMode: p.maintenanceMode,
                    maintenanceMessage: p.maintenanceMessage,
                    showPromoBanner: p.showPromoBanner,
                    promoBannerText: p.promoBannerText,
                    promoBannerLink: p.promoBannerLink,
                    seoTitle: p.seoTitle,
                    seoDescription: p.seoDescription,
                    seoKeywords: p.seoKeywords,
                    termsAndConditions: p.termsAndConditions,
                    privacyPolicy: p.privacyPolicy,
                    paymentMethods: p.paymentMethods,
                };
                state.publicSettings = newPublic;
                // Actualizar caché
                try { localStorage.setItem('publicSettings', JSON.stringify(newPublic)); } catch { }
            })
            .addCase(updateStoreSettings.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload;
            })

            // Upload Logo
            .addCase(uploadStoreLogo.pending, (state) => {
                state.isSaving = true;
                state.error = null;
            })
            .addCase(uploadStoreLogo.fulfilled, (state, action) => {
                state.isSaving = false;
                if (state.settings) {
                    state.settings.logo = action.payload.logo;
                    state.settings.logoUrl = action.payload.logoUrl;
                }
                // Actualizar publicSettings para que la UI refleje el cambio inmediatamente
                if (state.publicSettings) {
                    state.publicSettings.logo = action.payload.logoUrl ?? action.payload.logo;
                }
                state.successMessage = 'Logo actualizado correctamente';
            })
            .addCase(uploadStoreLogo.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload;
            })

            // Delete Logo
            .addCase(deleteStoreLogo.pending, (state) => {
                state.isSaving = true;
                state.error = null;
            })
            .addCase(deleteStoreLogo.fulfilled, (state) => {
                state.isSaving = false;
                if (state.settings) {
                    state.settings.logo = null;
                    state.settings.logoUrl = null;
                }
                if (state.publicSettings) {
                    state.publicSettings.logo = null;
                }
                state.successMessage = 'Logo eliminado correctamente';
            })
            .addCase(deleteStoreLogo.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload;
            })

            // Upload Favicon
            .addCase(uploadStoreFavicon.pending, (state) => {
                state.isSaving = true;
                state.error = null;
            })
            .addCase(uploadStoreFavicon.fulfilled, (state, action) => {
                state.isSaving = false;
                if (state.settings) {
                    state.settings.favicon = action.payload.favicon;
                    state.settings.faviconUrl = action.payload.faviconUrl;
                }
                // Actualizar publicSettings para que el favicon se refleje inmediatamente
                if (state.publicSettings) {
                    state.publicSettings.favicon = action.payload.faviconUrl ?? action.payload.favicon;
                }
                state.successMessage = 'Favicon actualizado correctamente';
            })
            .addCase(uploadStoreFavicon.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload;
            });
    }
});

export const { clearStoreSettingsErrors, clearSuccessMessage } = storeSettingsSlice.actions;
export default storeSettingsSlice.reducer;
