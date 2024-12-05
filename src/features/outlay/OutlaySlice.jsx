
import { createSlice } from "@reduxjs/toolkit";
import dksoluciones from '../../api/config'
import getConfig from "../../utils/config";
import { setError, setSuccess } from '../error/errorSlice'

const initialState = {
  outlayForDay: [],
};


const OutlaySlice = createSlice({
    name: "outlay",
    initialState,
    reducers: {
        setOutlayForDay: (state, action) => {
            state.outlayForDay = action.payload;
        },
    },
});

export const getOutlayForDay = (date) => async (dispatch) => {
    try {
        const { data } = await dksoluciones.get(`/outlay/getoutlayforday/`, { params: { date },...getConfig() });
        dispatch(setOutlayForDay(data.data));
    } catch (error) {
        console.log("Error fetching outlay data:", error);
    }
};

export const createOutlay = (outlay, searchDate) => async (dispatch) => {
    try {
        const { data } = await dksoluciones.post(`/outlay/create/`, outlay , getConfig());
        dispatch(setSuccess(data.message));
        dispatch(getOutlayForDay(searchDate));
    } catch (error) {
        console.error("Error creating outlay:", error);
        dispatch(setError(error.response.data.message));
    }
};

export const updateOutlay = (outlay, searchDate) => async (dispatch) => {  
    try {
        const { data } = await dksoluciones.patch(`/outlay/update/${outlay.id}`, outlay, getConfig());
        dispatch(setSuccess(data.message));
        dispatch(getOutlayForDay(searchDate));
    } catch (error) {
        console.error("Error updating outlay:", error);
        dispatch(setError(error.response.data.message));
    }
};

export const deleteOutlay = (id, searchDate) => async (dispatch) => {
    try {
        await dksoluciones.delete(`/outlay/delete/${id}`, getConfig());
        dispatch(setSuccess("Gasto eliminado con éxito!"));
        dispatch(getOutlayForDay(searchDate));
    } catch (error) {
        console.error("Error deleting outlay:", error);
        dispatch(setError(error.response.data.message));
    }
};


export const { setOutlayForDay } = OutlaySlice.actions;
export default OutlaySlice.reducer;

