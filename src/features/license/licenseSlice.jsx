import { createSlice } from '@reduxjs/toolkit';
import getConfig from '../../utils/config';
import dksoluciones from '../../api/config';
import { setError, setSuccess } from '../error/errorSlice'


const initialState = []

export const licenseSlice = createSlice({
    name: 'licenses',
    initialState,
    reducers: {
        setLicenses: (state, action) => {
            return action.payload
        }
    },
});


export const setLicenseThunk = () => async (dispatch) => {
    try {
        const res = await dksoluciones.get('license/', getConfig())
        const { data } = res.data
        dispatch(setLicenses(data))
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}

export const createLicenseThunk = (data) => async (dispatch) => {
    try {
        await dksoluciones.post('license/', data, getConfig())
        dispatch(setLicenseThunk())
        dispatch(setSuccess('Licencia creada'))
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response.data.message))
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}

export const editLicenseThunk = (id, { name, description, price }) => async (dispatch) => {
    try {
        const res = await dksoluciones.put(`license/${id}`, { name, description, price }, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response.data.message))
    }
}

export const deleteLicenseThunk = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`license/${id}`, getConfig())
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}



export const { setLicenses } = licenseSlice.actions;

export default licenseSlice.reducer;