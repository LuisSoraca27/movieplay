import { createSlice } from '@reduxjs/toolkit'
import dksoluciones from '../../api/config';
import getConfig from '../../utils/config';
import { setError, setSuccess } from '../error/errorSlice'

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


export const setAccountThunk = () => async (dispatch) => {
    try {
        const res = await dksoluciones.get('account/length', getConfig())
        const data = res.data
        dispatch(setLengthAccount(data))
    } catch (error) {
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
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
        if (error.response?.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}

export const createAccountThunk = (data) => async (dispatch) => {
    try {
        await dksoluciones.post('account', data, getConfig())
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

export const editAccountThunk = (id, data) => async (dispatch) => {
    try {
        await dksoluciones.put(`account/${id}`, data, getConfig())
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



export const deleteAccountThunk = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`account/${id}`, getConfig())
    } catch (error) {
        console.log(error)
        if (error.response?.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
}


export const purchaseAccountThunk = (id, email, subject) => async (dispatch) => {
    console.log(id)
    try {

        await dksoluciones.post(`order/account/${id}`, { email, subject }, getConfig())
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


export const { setLengthAccount, setAccounts } = accountSlice.actions

export default accountSlice.reducer