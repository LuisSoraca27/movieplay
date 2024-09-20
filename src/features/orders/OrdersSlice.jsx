import { createSlice } from '@reduxjs/toolkit'
import dksoluciones from '../../api/config';
import getConfig from '../../utils/config';
import { setError, setSuccess } from '../error/errorSlice';

const initialState = {
    ordersDay: [],
    ordersById: [],
    ordersMonth: [],
}

const OrdersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrdersDay(state, action) {
            state.ordersDay = action.payload
        },
        setOrdersMonth(state, action) {
            state.ordersMonth = action.payload
        },
        setOrdersById(state, action) {
            state.ordersById = action.payload
        }
    }
});

export const getOrdersDay = () => async (dispatch) => {
    try {
        const { data } = await dksoluciones.get('order/day/', getConfig());
        dispatch(setOrdersDay(data.data));
    } catch (error) {
        console.log(error);
    }
}


export const getOrdersDayById = (id) => async (dispatch) => {
    try {
        const { data } = await dksoluciones.get('order/day/user/' + id + '/', getConfig());
        dispatch(setOrdersById(data.data));
    } catch (error) {
        console.log(error);
    }
}

export const getOrdersMonth = () => async (dispatch) => {
    try {
        const { data } = await dksoluciones.get('order/month/', getConfig());
        dispatch(setOrdersMonth(data.data));
    } catch (error) {
        console.log(error);
    }
}

export const downloadSales = (date) => async (dispatch) => {
    try {
        const response = await dksoluciones.post('order/getdaily/', { date }, {
            responseType: "blob",
            ...getConfig()
        });

        // Extraer el nombre del archivo del encabezado 'content-disposition'
        const contentDisposition = response.headers['content-disposition'];
        const match = contentDisposition && contentDisposition.match(/filename="(.+)"$/);
        const fileName = match ? match[1] : 'sales.xlsx';

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        dispatch(setSuccess(true));
        console.log(response);
    } catch (error) {
        console.log(error);
        dispatch(setError(error.response.data.message));
    }
}


export const { setOrdersDay, setOrdersMonth, setOrdersById } = OrdersSlice.actions

export default OrdersSlice.reducer