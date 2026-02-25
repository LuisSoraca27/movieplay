import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dksoluciones from '../../api/config';

// --- Async Thunks ---

// Obtener todas las categorías
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.get('categoriescp');
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener categorías');
        }
    }
);

// Obtener una categoría por ID
export const fetchCategoryById = createAsyncThunk(
    'categories/fetchCategoryById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.get(`categoriescp/${id}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al obtener categoría');
        }
    }
);

// Crear una nueva categoría
export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.post('categoriescp/create', formData);
            return response.data.data;
        } catch (error) {
            console.error('Error al crear categoría:', error.response?.data);
            const errorMsg = error.response?.data?.message 
                || error.response?.data?.error?.message 
                || error.message 
                || 'Error al crear categoría';
            return rejectWithValue(errorMsg);
        }
    }
);

// Actualizar una categoría
export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const response = await dksoluciones.put(`categoriescp/update/${id}`, formData);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al actualizar categoría');
        }
    }
);

// Eliminar una categoría
export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            await dksoluciones.delete(`categoriescp/delete/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al eliminar categoría');
        }
    }
);

// Subir logo de categoría
export const uploadCategoryLogo = createAsyncThunk(
    'categories/uploadCategoryLogo',
    async ({ id, file }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('logo', file);
            
            const response = await dksoluciones.post(`categoriescp/${id}/logo`, formData);
            return { id, ...response.data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al subir logo');
        }
    }
);

// Eliminar logo de categoría
export const deleteCategoryLogo = createAsyncThunk(
    'categories/deleteCategoryLogo',
    async (id, { rejectWithValue }) => {
        try {
            await dksoluciones.delete(`categoriescp/${id}/logo`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error al eliminar logo');
        }
    }
);

const initialState = {
    categories: [],
    selectedCategory: null,
    isLoading: false,
    error: null,
    successMessage: null
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearCategoriesErrors: (state) => {
            state.error = null;
            state.successMessage = null;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        clearSelectedCategory: (state) => {
            state.selectedCategory = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Categories
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Fetch Category by ID
            .addCase(fetchCategoryById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedCategory = action.payload;
            })
            .addCase(fetchCategoryById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Create Category
            .addCase(createCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories.push(action.payload);
                state.successMessage = 'Categoría creada exitosamente';
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Update Category
            .addCase(updateCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.categories.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
                state.selectedCategory = action.payload;
                state.successMessage = 'Categoría actualizada exitosamente';
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Delete Category
            .addCase(deleteCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = state.categories.filter(c => c.id !== action.payload);
                state.successMessage = 'Categoría eliminada exitosamente';
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Upload Logo
            .addCase(uploadCategoryLogo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(uploadCategoryLogo.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.categories.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index].logoUrl = action.payload.logoUrl;
                    state.categories[index].logoPublicUrl = action.payload.logoPublicUrl;
                }
                if (state.selectedCategory?.id === action.payload.id) {
                    state.selectedCategory.logoUrl = action.payload.logoUrl;
                    state.selectedCategory.logoPublicUrl = action.payload.logoPublicUrl;
                }
                state.successMessage = 'Logo subido exitosamente';
            })
            .addCase(uploadCategoryLogo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Delete Logo
            .addCase(deleteCategoryLogo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteCategoryLogo.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.categories.findIndex(c => c.id === action.payload);
                if (index !== -1) {
                    state.categories[index].logoUrl = null;
                    state.categories[index].logoPublicUrl = null;
                }
                if (state.selectedCategory?.id === action.payload) {
                    state.selectedCategory.logoUrl = null;
                    state.selectedCategory.logoPublicUrl = null;
                }
                state.successMessage = 'Logo eliminado exitosamente';
            })
            .addCase(deleteCategoryLogo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // (migración de estilos/logos eliminada; lógica ya no se usa)
            ;
    }
});

export const { clearCategoriesErrors, setSelectedCategory, clearSelectedCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
