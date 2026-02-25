import { createSlice } from '@reduxjs/toolkit'
import dksoluciones from '../../api/config';
import getConfig from '../../utils/config';
import { setError, setSuccess } from '../error/errorSlice'

// ============================================
// CONFIGURACIÓN DE CACHÉ
// ============================================
const CACHE_KEY = 'accounts_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos en ms

/**
 * Obtiene datos del caché si están vigentes
 */
const getCachedAccounts = () => {
    try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();
        
        // Si el caché expiró, eliminarlo
        if ((now - timestamp) >= CACHE_TTL) {
            sessionStorage.removeItem(CACHE_KEY);
            return null;
        }
        
        return data;
    } catch {
        return null;
    }
};

/**
 * Guarda datos en el caché
 */
const setCachedAccounts = (data) => {
    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    } catch (e) {
        console.warn('Error guardando caché:', e);
    }
};

/**
 * Invalida el caché (llamar después de compras/cambios)
 */
export const invalidateAccountsCache = () => {
    sessionStorage.removeItem(CACHE_KEY);
};

const initialState = {
    length: [],
    accounts: []
}

const accountSlice = createSlice({
    name: 'accounts',
    initialState,
    reducers: {
        setLengthAccount: (state, action) => {
            state.length = action.payload
        },
        setAccounts: (state, action) => {
            state.accounts = action.payload
        }
    }
});


export const setAccountThunk = (forceRefresh = false) => async (dispatch) => {
    try {
        if (!forceRefresh) {
            const cached = getCachedAccounts();
            if (cached) {
                dispatch(setLengthAccount(cached));
                return;
            }
        }
        
        const res = await dksoluciones.get('account/length', getConfig())
        const data = res.data
        
        setCachedAccounts(data);
        
        dispatch(setLengthAccount(data))
    } catch (error) {
        console.log(error)
    }
}


export const setAccountsThunk = (categoryName) => async (dispatch) => {
    try {
        const nameCategory = categoryName
        const res = await dksoluciones.post('account/filter', { nameCategory }, getConfig())
        const { data } = res.data
        dispatch(setAccounts(data))
    } catch (error) {
        console.log(error)
    }
}

export const createAccountThunk = (data) => async (dispatch) => {
    try {
        await dksoluciones.post('account', data, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response?.data?.message))
    }
}

export const editAccountThunk = (id, data) => async (dispatch) => {
    try {
        await dksoluciones.put(`account/${id}`, data, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response?.data?.message))
    }
}



export const deleteAccountThunk = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`account/${id}`, getConfig())
    } catch (error) {
        console.log(error)
    }
}


export const purchaseAccountThunk = (id, email, subject) => async (dispatch) => {
    console.log(id)
    try {

        await dksoluciones.post(`order/account/${id}`, { email, subject }, getConfig())
        dispatch(setSuccess(true))
        invalidateAccountsCache();
        dispatch(setAccountThunk(true))
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response?.data?.message))
    }
}


export const { setLengthAccount, setAccounts } = accountSlice.actions

export default accountSlice.reducer