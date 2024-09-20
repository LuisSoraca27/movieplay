import { createSlice } from '@reduxjs/toolkit';
import getConfig from '../../utils/config';
import dksoluciones from '../../api/config';
import { setError, setSuccess } from '../error/errorSlice'


const initialState = []

export const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setCourses: (state, action) => {
            return action.payload
        }
    },
});


export const setCourseThunk = () => async (dispatch) => {
    try {
        const res = await dksoluciones.get('course/', getConfig())
        const { data } = res.data
        dispatch(setCourses(data))
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}

export const createCourseThunk = (form) => async (dispatch) => {
    try {
        const res = await dksoluciones.post('course/', form, getConfig())
        dispatch(setSuccess(true))
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

export const editCourseThunk = (id, { name, description, price, linkCourse }) => async (dispatch) => {
    try {
        const res = await dksoluciones.put(`course/${id}`, { name, description, price, linkCourse }, getConfig())
        dispatch(setSuccess(true))
    } catch (error) {
        console.log(error)
        dispatch(setError(error.response.data.message))
    }
}


export const deleteCourseThunk = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`course/${id}`, getConfig())
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}



export const { setCourses } = courseSlice.actions;

export default courseSlice.reducer;