
import { createSlice } from "@reduxjs/toolkit";
import dksoluciones from '../../api/config'
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
        const { data } = await dksoluciones.get(`/outlay/getoutlayforday/`, { params: { date } });
        dispatch(setOutlayForDay(data.data));
    } catch (error) {
        console.log("Error fetching outlay data:", error);
    }
};

export const createOutlay = (outlay, searchDate) => async (dispatch) => {
    try {
        const { data } = await dksoluciones.post(`/outlay/create/`, outlay);
        dispatch(setSuccess(data.message));
        dispatch(getOutlayForDay(searchDate));
        return { success: true };
    } catch (error) {
        console.error("Error creating outlay:", error);
        const message = error.response?.data?.message || 'Error al crear el gasto';
        dispatch(setError(message));
        return { success: false, message };
    }
};

export const updateOutlay = (outlay, searchDate) => async (dispatch) => {  
    try {
        await dksoluciones.patch(`/outlay/update/${outlay.id}`, outlay);
        dispatch(setSuccess('Gasto actualizado correctamente'));
        dispatch(getOutlayForDay(searchDate));
        return { success: true };
    } catch (error) {
        console.error("Error updating outlay:", error);
        const message = error.response?.data?.message || 'Error al actualizar el gasto';
        dispatch(setError(message));
        return { success: false, message };
    }
};

export const deleteOutlay = (id, searchDate) => async (dispatch) => {
    try {
        await dksoluciones.delete(`/outlay/delete/${id}`);
        dispatch(setSuccess("Gasto eliminado con éxito!"));
        dispatch(getOutlayForDay(searchDate));
        return { success: true };
    } catch (error) {
        console.error("Error deleting outlay:", error);
        const message = error.response?.data?.message || 'Error al eliminar el gasto';
        dispatch(setError(message));
        return { success: false, message };
    }
};


export const { setOutlayForDay } = OutlaySlice.actions;
export default OutlaySlice.reducer;

