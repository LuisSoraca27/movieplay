import { createSlice } from '@reduxjs/toolkit';
import { setError, setSuccess } from '../../features/error/errorSlice';
import dksoluciones from '../../api/config'
import getConfig from '../../utils/config';

const initialState = {
    adminAccount: [],
    supportAccount: [],
    dashboardStats: {
        expiringCount: 0,
        averageMargin: 0,
        topSupplier: null,
        supplierRanking: [],
    },
};

const inventoryManagerSlice = createSlice({
    name: 'inventoryManager',
    initialState,
    reducers: {
        setAdminAccount: (state, action) => {
            state.adminAccount = action.payload;
        },
        setSupportAccount: (state, action) => {
            state.supportAccount = action.payload;
        },
        setDashboardStats: (state, action) => {
            state.dashboardStats = action.payload;
        },
    },
});

// Thunks para cuentas administrativas
export const getAdminAccountsByCategoryId = (categoryId, date) => async (dispatch) => {
    try {
        const response = await dksoluciones.get(`/adminaccount/category?categoryId=${categoryId}&date=${date}`, getConfig());
        dispatch(setAdminAccount(response.data.data.adminAccounts));
    } catch (error) {
        console.error('Error getting admin accounts by category:', error);
        dispatch(setError(error.response?.data?.message || 'Error al obtener las cuentas'));
    }
};

export const createAdminAccount = (accountData, categoryId, date) => async (dispatch) => {
    try {
        const response = await dksoluciones.post('/adminaccount', accountData, getConfig());
        dispatch(getAdminAccountsByCategoryId(categoryId, date));
        dispatch(setSuccess(response.data.message));
    } catch (error) {
        console.error('Error creating admin account:', error);
        dispatch(setError(error.response?.data?.message || 'Error al crear la cuenta'));
    }
};

export const updateAdminAccount = (id, accountData, categoryId, date) => async (dispatch) => {
    try {
        const response = await dksoluciones.patch(`/adminaccount/${id}`, accountData, getConfig());
        dispatch(getAdminAccountsByCategoryId(categoryId, date));
        dispatch(setSuccess(response.data.message));
    } catch (error) {
        console.error('Error updating admin account:', error);
        dispatch(setError(error.response?.data?.message || 'Error al actualizar la cuenta'));
    }
};

export const deleteAdminAccount = (id, categoryId, date) => async (dispatch) => {
    try {
        await dksoluciones.delete(`/adminaccount/${id}`, getConfig());
        dispatch(getAdminAccountsByCategoryId(categoryId, date));
        dispatch(setSuccess('Cuenta eliminada exitosamente'));
    } catch (error) {
        console.error('Error deleting admin account:', error);
        dispatch(setError(error.response?.data?.message || 'Error al eliminar la cuenta'));
    }
};

export const importAdminAccountsFromExcel = (formData, categoryId, date) => async (dispatch) => {
    try {
        const response = await dksoluciones.post('/adminaccount/import-excel', formData, getConfig());
        dispatch(getAdminAccountsByCategoryId(categoryId, date));
        dispatch(setSuccess(response.data.message));
    } catch (error) {
        console.error('Error importing admin accounts from Excel:', error);
        dispatch(setError(error.response?.data?.message || 'Error al importar cuentas desde Excel'));
    }
};

export const sendAdminAccountToSupport = (id, categoryId, date) => async (dispatch) => {
    try {
        const response = await dksoluciones.post(`/adminaccount/send-to-support/${id}`, {}, getConfig());
        dispatch(getAdminAccountsByCategoryId(categoryId, date));
        dispatch(setSuccess(response.data.message));
    } catch (error) {
        console.error('Error sending admin account to support:', error);
        dispatch(setError(error.response?.data?.message || 'Error al enviar la cuenta a soporte'));
    }
};


// Thunks para cuentas de soporte
export const getSupportAccountsByCategoryId = (categoryId) => async (dispatch) => {
    try {
        const response = await dksoluciones.get(`/supportaccount/category/${categoryId}`, getConfig());
        dispatch(setSupportAccount(response.data.data.supportAccounts));
    } catch (error) {
        console.error('Error getting support accounts by category:', error);
        dispatch(setError(error.response?.data?.message || 'Error al obtener las cuentas de soporte'));
    }
};

export const createSupportAccount = (accountData, categoryId) => async (dispatch) => {
    try {
        const response = await dksoluciones.post('/supportaccount', accountData, getConfig());
        dispatch(getSupportAccountsByCategoryId(categoryId));
        dispatch(setSuccess(response.data.message));
    } catch (error) {
        console.error('Error creating support account:', error);
        dispatch(setError(error.response?.data?.message || 'Error al crear la cuenta de soporte'));
    }
};

export const updateSupportAccount = (id, accountData, categoryId) => async (dispatch) => {
    try {
        const response = await dksoluciones.patch(`/supportaccount/${id}`, accountData, getConfig());
        dispatch(getSupportAccountsByCategoryId(categoryId));
        dispatch(setSuccess(response.data.message));
    } catch (error) {
        console.error('Error updating support account:', error);
        dispatch(setError(error.response?.data?.message || 'Error al actualizar la cuenta de soporte'));
    }
};

export const deleteSupportAccount = (id, categoryId) => async (dispatch) => {
    try {
        await dksoluciones.delete(`/supportaccount/${id}`, getConfig());
        dispatch(getSupportAccountsByCategoryId(categoryId));
        dispatch(setSuccess('Cuenta de soporte eliminada exitosamente'));
    } catch (error) {
        console.error('Error deleting support account:', error);
        dispatch(setError(error.response?.data?.message || 'Error al eliminar la cuenta de soporte'));
    }
};

export const importSupportAccountsFromExcel = (formData, categoryId) => async (dispatch) => {
    try {
        const response = await dksoluciones.post('/supportaccount/import-excel', formData, getConfig());
        dispatch(getSupportAccountsByCategoryId(categoryId));
        dispatch(setSuccess(response.data.message));
    } catch (error) {
        console.error('Error importing support accounts from Excel:', error);
        dispatch(setError(error.response?.data?.message || 'Error al importar cuentas de soporte desde Excel'));
    }
};

export const { setAdminAccount, setSupportAccount, setDashboardStats } = inventoryManagerSlice.actions;

export const getDashboardStats = () => async (dispatch) => {
    try {
        const response = await dksoluciones.get('/adminaccount/dashboard-stats', getConfig());
        dispatch(setDashboardStats(response.data.data));
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
    }
};

export const convertToStock = (data) => async (dispatch) => {
    try {
        const response = await dksoluciones.post('/adminaccount/convert-to-stock', data, getConfig());
        dispatch(setSuccess(response.data.message));
        return response.data;
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Error al convertir a stock'));
        throw error;
    }
};

export const reportAccountIssue = (id, type) => async (dispatch) => {
    try {
        const response = await dksoluciones.post('/adminaccount/report-issue', { id, type }, getConfig());
        dispatch(setSuccess(response.data.message));
        return response.data;
    } catch (error) {
        dispatch(setError(error.response?.data?.message || 'Error al reportar incidencia'));
        throw error;
    }
};

export default inventoryManagerSlice.reducer;
