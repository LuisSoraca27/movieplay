import { createSlice } from '@reduxjs/toolkit'
import getConfig from '../../utils/config';
import dksoluciones from '../../api/config';
import { setError, setSuccess } from '../error/errorSlice';

const initialState = {
    notifications: [],
    notificationImg: [],
    ViewNotification: false
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotification: (state, action) => {
            state.notifications = action.payload
        },
        setNotificationImg: (state, action) => {
            state.notificationImg = action.payload
        },
        setViewNotification: (state, action) => {
            state.ViewNotification = action.payload
        }

    },

});


export const getNotificationThunk = () => async (dispatch) => {
    try {
        const res = await dksoluciones.get('notification/', getConfig())
        const { data } = res.data
        dispatch(setNotification(data))
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}

export const deleteNotificationThunk = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`notification/${id}`, getConfig())
        dispatch(getNotificationThunk())
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}

export const getNotificationImgThunk = () => async (dispatch) => {
    try {
        const res = await dksoluciones.get('notification/img', getConfig())
        const { data } = res.data
        dispatch(setNotificationImg(data))
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
        dispatch(setError(error.response.data.message))
    }
}

export const uploadImgPopup = (form) => async (dispatch) => {
    try {
     const res =  await dksoluciones.post('notification/uploadimg', form, getConfig())
        dispatch(setSuccess(true))
        dispatch(getNotificationImgThunk())
        console.log(res.data);
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response.data.message))
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    }
}

export const UpdateImgPopup = (img, id) => async (dispatch) => {
    try {
        await dksoluciones.post(`notification/img/${id}`, img, getConfig())
        dispatch(setSuccess(true))
        dispatch(getNotificationImgThunk())
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
        dispatch(setError(error.response.data.message))
    }
}

export const deleteImgPopup = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`notification/img/${id}`, getConfig())
        dispatch(getNotificationImgThunk())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
        dispatch(setError(error.response.data.message))
    }
}



export const { setNotification, setNotificationImg, setViewNotification } = notificationSlice.actions

export default notificationSlice.reducer