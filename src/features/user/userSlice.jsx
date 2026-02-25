import { createSlice } from '@reduxjs/toolkit'
import dksoluciones from '../../api/config';
import getConfig from '../../utils/config';
import { setError, setSuccess } from '../error/errorSlice'

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    userSession: null,
    usersAdmin: [],
    usersSeller: [],
    historyRecharge: [],
    isLoadingUsers: false,
};


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
        },
        setUsersLoading: (state, action) => {
            state.isLoadingUsers = action.payload;
        },
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
        dispatch(setError(error.response?.data?.message))
    }
};

export const createUserThunk = (dataForm) => async (dispatch) => {
    try {
        const { data } = await dksoluciones.post('user/createuser', dataForm, getConfig());
        dispatch(setUsersAdminThunk());
        dispatch(setUsersSellerThunk());
        return { success: true, message: data.message };
    } catch (error) {
        console.log(error);
        const message = error.response?.data?.message || 'Error al crear usuario';
        return { success: false, message };
    }
};

export const createUserSellerThunk = (dataform) => async (dispatch) => {
    try {
        const { data } = await dksoluciones.post('user/createuserseller', dataform, getConfig())
        dispatch(setSuccess(data.message))
        return { success: true, message: data.message };
    } catch (error) {
        console.log(error);
        const message = error.response?.data?.message === 'Validation error'
            ? 'El usuario ya existe'
            : (error.response?.data?.message || 'Error al crear usuario');
        dispatch(setError(message))
        return { success: false, message };
    }
};

export const rechargeUserThunk = (data, id) => async (dispatch) => {
    try {
        const res = await dksoluciones.patch(`user/agreebalance/${id}`, data, getConfig());
        dispatch(setUsersSellerThunk());
        return res.data;
    } catch (error) {
        console.log(error);
        dispatch(setError(error.response?.data?.message))
        throw error;
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
        dispatch(setError(error.response?.data?.message))
        console.log(error)
    }
};


export const deleteUserThunk = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`user/deleteuser/${id}`, getConfig());
        dispatch(setUsersAdminThunk());
    } catch (error) {
        console.log(error);
    }
};




export const { setUsersAdmin, setUsersSeller, setUserSession, setHistoryRecharge, setUsersLoading } = userSlice.actions;

export default userSlice.reducer;