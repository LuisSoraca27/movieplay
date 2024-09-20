import { createSlice } from '@reduxjs/toolkit'
import dksoluciones from '../../api/config';
import getConfig from '../../utils/config';
import { setError, setSuccess } from '../error/errorSlice'

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    userSession: null,
    usersAdmin: [],
    usersSeller: [],
    historyRecharge: []
}


export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUsersAdmin: (state, action) => {
            state.usersAdmin = action.payload;
        },
        setUsersSeller: (state, action) => {
            state.usersSeller = action.payload;
        },
        setUserSession: (state, action) => {
            state.userSession = action.payload;
        },
        setHistoryRecharge: (state, action) => {
            state.historyRecharge = action.payload;
        }
    },
});

export const getHistoryRecharge = (id) => async (dispatch) => {
   try {
    const { data } = await dksoluciones.get(`user/getrechargeuser/${id}`, getConfig());
    dispatch(setHistoryRecharge(data.data));
   } catch (error) {
    console.log(error);
   } 
}


export const getUserSession = () => async (dispatch) => {
    const usersession = JSON.parse(localStorage.getItem('user'));
    if (!usersession) {
        return;
    }
    try {
        const res = await dksoluciones.get(`/user/usersession/${usersession.id}`, getConfig());
        const user = res.data;
        dispatch(setUserSession(user.data));
    } catch (error) {
        console.log(error);
    }
}

export const setUsersAdminThunk = () => async (dispatch) => {
    try {
        const res = await dksoluciones.get('user/getuseradmin', getConfig());
        const { users } = res.data.data;
        dispatch(setUsersAdmin(users));
    } catch (error) {
        console.log(error);
    }
};

export const setUsersSellerThunk = () => async (dispatch) => {
    try {
        const res = await dksoluciones.get('user/getuserseller', getConfig());
        const { users } = res.data.data;
        dispatch(setUsersSeller(users));
    } catch (error) {
        console.log(error);
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
        dispatch(setError(error.response.data.message))
    }
};

export const createUserThunk = (dataForm) => async (dispatch) => {
    try {
     const {data} = await dksoluciones.post('user/createuser', dataForm, getConfig());
        dispatch(setUsersAdminThunk());
        dispatch(setUsersSellerThunk());
        dispatch(setSuccess(data.message))
    } catch (error) {
        console.log(error);
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
        dispatch(setError(error.response.data.message))
    }
};

export const createUserSellerThunk = (dataform) => async (dispatch) => {
    try {
      const {data} = await dksoluciones.post('user/createuserseller', dataform, getConfig())
        dispatch(setSuccess(data.message))
    } catch (error) {
        console.log(error);
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
        dispatch(setError(error.response.data.message))
    }
};

export const rechargeUserThunk = (data, id) => async (dispatch) => {
    try {
        await dksoluciones.patch(`user/agreebalance/${id}`, data, getConfig());
        dispatch(setUsersSellerThunk());
    } catch (error) {
        console.log(error);
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
};

export const editUserThunk = (data, id) => async (dispatch) => {
    try {
        const { username, email, phone } = data
        const res = await dksoluciones.patch(`user/updateuser/${id}`, { username, email, phone }, getConfig());
        console.log(res.data)
        user?.role === 'admin' && dispatch(setUsersSellerThunk());
        dispatch(setSuccess(res.data.message))
    } catch (error) {
        dispatch(setError(true))
        console.log(error)
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
        }
    }
};


export const deleteUserThunk = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`user/deleteuser/${id}`, getConfig());
        dispatch(setUsersAdminThunk());
    } catch (error) {
        console.log(error);
        if (error.response.data.message === 'Session expired') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.reload()
        }
    }
};




export const { setUsersAdmin, setUsersSeller, setUserSession, setHistoryRecharge } = userSlice.actions;

export default userSlice.reducer;