import { createSlice } from "@reduxjs/toolkit";
import dksoluciones from "../../api/config";
import getConfig from "../../utils/config";
import { setError, setSuccess } from "../error/errorSlice";

const initialState = {
    customers: [],
    customerByEmail: null,
};

const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        setCustomer: (state, action) => {
            state.customers = action.payload;
        },
        setCustomerByEmail: (state, action) => {
            state.customerByEmail = action.payload;
        },
    },
});

export const getCustomers = () => async (dispatch) => {
    try {
        const { data } = await dksoluciones.get('customer/', getConfig());
        dispatch(setCustomer(data.data));
    } catch (error) {
        console.error(error);
    }
};

export const createCustomer = (customer) => async (dispatch) => {
    try {
         await dksoluciones.post('customer/create', customer, getConfig());
        dispatch(getCustomers());
        dispatch(setSuccess('Cliente creado'));
    } catch (error) {
        dispatch(setError('Error al crear el cliente'));
        console.error(error);
    }
};

export const getCustomerByEmail = (email) => async (dispatch) => {
    try {
        const { data } = await dksoluciones.get(`customer/email/${email}`, getConfig());
        dispatch(setCustomerByEmail(data.data));
        dispatch(setSuccess('Cliente encontrado'));
    } catch (error) {
        dispatch(setError(error.response.data.message || 'Error al encontrar el cliente' ));
        dispatch(setCustomerByEmail(null));
        console.error(error);
    }
};


export const updateCustomer = (id, customer) => async (dispatch) => {
    try {
        await dksoluciones.patch(`customer/update/${id}`, customer, getConfig());
        dispatch(getCustomers());
        dispatch(setSuccess('Cliente actualizado'));
    } catch (error) {
        dispatch(setError('Error al actualizar el cliente'));
        console.error(error);
    }
};

export const deleteCustomer = (id) => async (dispatch) => {
    try {
        await dksoluciones.delete(`customer/delete/${id}`, getConfig());
        dispatch(getCustomers());
        dispatch(setSuccess('Cliente eliminado'));
    } catch (error) {
        dispatch(setError('Error al eliminar el cliente'));
        console.error(error);
    }
};

export const { setCustomer, setCustomerByEmail } = customerSlice.actions;

export default customerSlice.reducer;