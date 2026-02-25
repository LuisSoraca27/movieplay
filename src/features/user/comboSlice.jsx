import { createSlice } from '@reduxjs/toolkit';
import getConfig from '../../utils/config';
import dksoluciones from '../../api/config';
import { setError, setSuccess } from '../error/errorSlice';
import { setIsLoading } from '../isLoading/isLoadingSlice';
import { setTotalItems } from '../combo/totalItemsSlice';


const initialState = []

export const comboSlice = createSlice({
    name: 'combos',
    initialState,
    reducers: {
        setCombos: (state, action) => {
            return action.payload
        },
        setComboById: (state, action) => {
            return [...state, action.payload]
        },
        clearCombos(state) {
            state.items = [];
        },
    },
});


export const setComboThunk = ({ page = 1, categoryId = null } = {}) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        let url = `combo/?page=${page}`;
        if (categoryId) {
            url += `&categoryId=${categoryId}`;
        }
        const res = await dksoluciones.get(url, getConfig());
        const { data, pagination } = res.data;
        dispatch(setCombos(data));
        dispatch(setTotalItems(pagination.totalItems));
    } catch (error) {
        console.log(error);
    } finally {
        dispatch(setIsLoading(false));
    }
};


export const fetchCombosByNameThunk = ({ name, page = 1 }) => async (dispatch) => {
    dispatch(setIsLoading(true));
    try {
        const res = await dksoluciones.get(`combo?name=${encodeURIComponent(name)}&page=${page}`, getConfig());
        const { data, pagination } = res.data;
        dispatch(setCombos(data));
        dispatch(setTotalItems(pagination.totalItems));
    } catch (error) {
        console.log(error);
        dispatch(setError(error.response?.data?.message || "Error al buscar combos"));
    } finally {
        dispatch(setIsLoading(false));
    }
};


export const fetchComboByIdThunk = (id) => async (dispatch) => {
    dispatch(setCombos([]));
    dispatch(setIsLoading(true));
    try {
        const res = await dksoluciones.get(`combo/id/${id}`, getConfig());
        const { data } = res.data;
        dispatch(setComboById(data));
    } catch (error) {
        console.log(error);
        dispatch(setError(error.response?.data?.message || "Error al buscar el combo"));
    } finally {
        dispatch(setIsLoading(false));
    }
};


export const createComboThunk = (form) => async (dispatch) => {
    try {
        const res = await dksoluciones.post('combo/', form, getConfig())
        console.log(res);

        dispatch(setSuccess('Combo creado con éxito!'))
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response?.data?.message))
    }
}

export const updateComboThunk = (id, data) => async (dispatch) => {
    try {
        const res = await dksoluciones.put(`combo/${id}`, data, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response?.data?.message))
    }
}

export const deleteComboThunk = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`combo/${id}`, getConfig())
    } catch (error) {
        console.log(error)
    }
}

export const buyComboThunk = (data) => async (dispatch) => {
    try {
        const res = await dksoluciones.post("order/combo", data, getConfig())
        console.log(res.data);
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error);
        dispatch(setError(error.response?.data?.message))
    }
}


export const buyProductThunk = (id, type, email, subject) => async (dispatch) => {

    try {
        const res = await dksoluciones.post(`order/${type}/${id}`, { email, subject }, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response?.data?.message))
    }
}



export const { setCombos, setComboById, clearCombos } = comboSlice.actions;

export default comboSlice.reducer;
