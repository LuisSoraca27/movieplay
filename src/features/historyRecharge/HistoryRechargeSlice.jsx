import { createSlice } from '@reduxjs/toolkit';
import dksoluciones from '../../api/config';
import getConfig from '../../utils/config';


const initialState = {
    historyRecharge: [],
    loading: false,
};

const historyRechargeSlice = createSlice({
    name: 'historyRecharge',
    initialState,
    reducers: {
        setHistoryRecharge: (state, action) => {
            state.historyRecharge = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});


export const getHistoryRechargeByDate = (date) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await dksoluciones.get(`/historyrecharge/historyRechargeByDate`, { params: { date }, ...getConfig() });
        dispatch(setHistoryRecharge(data.data));
    } catch (error) {
        console.error("Error fetching history recharge data:", error);
    } finally {
        dispatch(setLoading(false));
    }
}

export const getHistoryRechargeByEmail = (email) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await dksoluciones.get(`/historyrecharge/historyRechargeByUser`, { params: { email }, ...getConfig() });
        dispatch(setHistoryRecharge(data.data));
    } catch (error) {
        console.error("Error fetching history recharge data:", error);
    } finally {
        dispatch(setLoading(false));
    }
}

export const getHistoryRechargeById = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const { data } = await dksoluciones.get(`/historyrecharge/historyRechargeById/${id}`, getConfig());
        dispatch(setHistoryRecharge([data.data]));
    } catch (error) {
        console.error("Error fetching history recharge data:", error);
    } finally {
        dispatch(setLoading(false));
    }
}

export const { setHistoryRecharge, setLoading } = historyRechargeSlice.actions;

export default historyRechargeSlice.reducer;