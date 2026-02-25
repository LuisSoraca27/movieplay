import { createSlice } from '@reduxjs/toolkit'
import dksoluciones from '../../api/config'
import getConfig from '../../utils/config';
import { setError, setSuccess } from '../error/errorSlice';

// ============================================
// CONFIGURACIÓN DE CACHÉ
// ============================================
const CACHE_KEY = 'profiles_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos en ms

/**
 * Obtiene datos del caché si están vigentes
 */
const getCachedProfiles = () => {
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
const setCachedProfiles = (data) => {
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
export const invalidateProfilesCache = () => {
    sessionStorage.removeItem(CACHE_KEY);
};

const initialState = {
    length: [],
    profiles: []
}

export const profileSlice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {
        setLengthProfile: (state, action) => {
            state.length = action.payload
        },
        setProfiles: (state, action) => {
            state.profiles = action.payload
        }
    },
});


export const setProfileThunk = (forceRefresh = false) => async (dispatch) => {
    try {
        if (!forceRefresh) {
            const cached = getCachedProfiles();
            if (cached) {
                dispatch(setLengthProfile(cached));
                return;
            }
        }
        
        const res = await dksoluciones.get('profile/length', getConfig())
        const data = res.data
        
        setCachedProfiles(data);
        
        dispatch(setLengthProfile(data))
    } catch (error) {
        console.log(error)
    }
}

export const setProfilesThunk = (categoryName) => async (dispatch) => {
    try {
        const nameCategory = categoryName
        const res = await dksoluciones.post('profile/filter', { nameCategory }, getConfig())
        const { data } = res.data
        dispatch(setProfiles(data))
    } catch (error) {
        console.log(error)
    }
}

export const createProfileThunk = (data) => async (dispatch) => {
    try {
        await dksoluciones.post('profile', data, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response?.data?.message))
    }
}


export const editProfileThunk = (id, data) => async (dispatch) => {
    try {
        await dksoluciones.put(`profile/${id}`, data, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response?.data?.message))
    }
}

export const deleteProfileThunk = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`profile/${id}`, getConfig())
    } catch (error) {
        console.log(error)
    }
}


export const purchaseProfileThunk = (id, email, subject) => async (dispatch) => {
    console.log(id)
    try {

     const res =  await dksoluciones.post(`order/profile/${id}`, { email, subject }, getConfig())
        console.log(res.data)
        dispatch(setSuccess(true))
        invalidateProfilesCache();
        dispatch(setProfileThunk(true))
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response?.data?.message))
    }
}


export const { setLengthProfile, setProfiles } = profileSlice.actions;

export default profileSlice.reducer;