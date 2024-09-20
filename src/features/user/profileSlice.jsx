import { createSlice } from '@reduxjs/toolkit'
import dksoluciones from '../../api/config'
import getConfig from '../../utils/config';
import { setError, setSuccess } from '../error/errorSlice';


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


export const setProfileThunk = () => async (dispatch) => {
    try {
        const res = await dksoluciones.get('profile/length', getConfig())
        const data = res.data
        dispatch(setLengthProfile(data))
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
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
        if (error.response?.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}

export const createProfileThunk = (data) => async (dispatch) => {
    try {
        await dksoluciones.post('profile', data, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        if (error.response?.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
        dispatch(setError(error.response?.data.message))
    }
}


export const editProfileThunk = (id, data) => async (dispatch) => {
    try {
        await dksoluciones.put(`profile/${id}`, data, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        if (error.response?.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
        dispatch(setError(error.response?.data.message))
    }
}

export const deleteProfileThunk = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`profile/${id}`, getConfig())
    } catch (error) {
        console.log(error)
        if (error.response?.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}


export const purchaseProfileThunk = (id, email, subject) => async (dispatch) => {
    console.log(id)
    try {

     const res =  await dksoluciones.post(`order/profile/${id}`, { email, subject }, getConfig())
        console.log(res.data)
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        if (error.response?.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
        dispatch(setError(error.response?.data.message))
    }
}


export const { setLengthProfile, setProfiles } = profileSlice.actions;

export default profileSlice.reducer;