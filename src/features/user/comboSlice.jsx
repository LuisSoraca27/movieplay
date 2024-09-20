import { createSlice } from '@reduxjs/toolkit';
import getConfig from '../../utils/config';
import dksoluciones from '../../api/config';
import { setError, setSuccess } from '../error/errorSlice';


const initialState = []

export const comboSlice = createSlice({
    name: 'combos',
    initialState,
    reducers: {
        setCombos: (state, action) => {
            return action.payload
        }
    },
});


export const setComboThunk = () => async (dispatch) => {
    try {
        const res = await dksoluciones.get('combo/', getConfig())
        const { data } = res.data
        console.log(res)
        dispatch(setCombos(data))
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}

export const createComboThunk = (form) => async (dispatch) => {
    try {
        const res = await dksoluciones.post('combo/', form, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
        dispatch(setError(error.response.data.message))
    }
}

export const editComboThunk = (id, { name, description, price, profiles }) => async (dispatch) => {
    try {
        const res = await dksoluciones.put(`combo/${id}`, { name, description, price, profiles }, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
        dispatch(setError(error.response.data.message))
    }
}

export const deleteComboThunk = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`combo/${id}`, getConfig())
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}


// Este Thunk se usa para realizar la compra de combos, cursos y licencias
//Se recibe el tipo de producto que se va a comprar

export const buyProductThunk = (id, type, email, subject) => async (dispatch) => {

    try {
        const res = await dksoluciones.post(`order/${type}/${id}`, { email, subject }, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
        dispatch(setError(error.response.data.message))
    }
}



export const { setCombos } = comboSlice.actions;

export default comboSlice.reducer;