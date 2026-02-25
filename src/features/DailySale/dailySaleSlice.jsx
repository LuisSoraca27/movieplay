import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setError, setSuccess } from "../error/errorSlice";
import dksoluciones from "../../api/config";
import getConfig from "../../utils/config";
import { useSelector } from "react-redux";
import axios from "axios";

const initialState = {
    dailySales: [],
    receipt: null,
    searchTerm: '',
    status: 'idle',
    error: null,
};

const dailySaleSlice = createSlice({
    name: 'dailySale',
    initialState,
    reducers: {
        setDailySale: (state, action) => {
            state.dailySales = action.payload;
        },
        setReceipt: (state, action) => {
            state.receipt = action.payload;
        },
    },
});

export const getDailySales = (date) => async (dispatch) => {
    try {
        const response = await dksoluciones.get(`/dailysale?date=${date}`, getConfig());
        dispatch(setDailySale(response.data.dailySales));
    } catch (error) {
        console.error('Error getting daily sales:', error);
        dispatch(setError(error.response?.data?.message));
    }
};

export const getReceipt = (idDailySale) => async (dispatch) => {
    try {
        const response = await dksoluciones.get(`/dailysale/receipt?dailySaleId=${idDailySale}`, getConfig());
        dispatch(setReceipt(response.data.receiptImg));
    } catch (error) {
        console.error('Error getting receipt:', error);
        dispatch(setError(error.response?.data?.message));
    }
};

export const createDailySale = (sale, searchTerm) => async (dispatch) => {
    try {
        const response = await dksoluciones.post('/dailysale', sale, getConfig());
        dispatch(getDailySales(searchTerm));
        dispatch(setSuccess(response.data.message));
    } catch (error) {
        console.error('Error creating daily sale:', error);
        dispatch(setError(error.response?.data?.message));
    }
};

export const deleteDailySale = (id, searchTerm) => async (dispatch) => {
    try {
        const response = await dksoluciones.delete(`/dailysale/${id}`, getConfig());
        console.log(response);
        dispatch(getDailySales(searchTerm));
        dispatch(setSuccess('Borrado con exito'));
    } catch (error) {
        console.error('Error deleting daily sale:', error);
        dispatch(setError(error.response?.data?.message));
    }
}

export const uploadDailySalesFromExcel = (formData, searchTerm) => async (dispatch) => {
    try {
        const response = await dksoluciones.post('/dailysale/upload-excel', formData, getConfig());
        dispatch(getDailySales(searchTerm));
        dispatch(setSuccess(response.data.message));

    } catch (error) {
        console.error('Error uploading Excel file:', error);
        const errorMessage = error.response?.data?.message || error.message || 'No se pudo subir el archivo Excel.';
        dispatch(setError(errorMessage));
    }
};

export const updateVerificationStatus = (idDailySale, isVerified, searchTerm) => async (dispatch) => {
    try {
        const response = await dksoluciones.put(`/dailysale/${idDailySale}/verify`, 
            { isVerified },
            getConfig()
        );
        dispatch(getDailySales(searchTerm));
        dispatch(setSuccess('Estado de verificación actualizado correctamente'));
    } catch (error) {
        console.error('Error updating verification status:', error);
        dispatch(setError(error.response?.data?.message || 'Error al actualizar el estado de verificación'));
    }
};

export const updateDailySale = ({ id, formData, searchDate }) => async (dispatch) => {
    try {
        const response = await dksoluciones.patch(`/dailysale/${id}`, formData);
        dispatch(getDailySales(searchDate));
        dispatch(setSuccess(response.data.message || 'Venta actualizada correctamente'));
    } catch (error) {
        console.error('Error updating daily sale:', error);
        dispatch(setError(error.response?.data?.message || 'Error al actualizar la venta'));
    }
};

export const { setDailySale, setReceipt } = dailySaleSlice.actions;

export default dailySaleSlice.reducer;


