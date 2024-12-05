import { createSlice } from '@reduxjs/toolkit'
import dksoluciones from '../../api/config';
import getConfig from '../../utils/config';
import { setError, setSuccess } from '../error/errorSlice';

const initialState = {
    ordersByDateForUser: [],
    ordersByDateUser: [],
    ordersMonth: [],
    ordersByDate: [],
    ordersById: [],
  };
  

const OrdersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrdersDay(state, action) {
          state.ordersDay = action.payload;
        },
        setOrdersMonth(state, action) {
          state.ordersMonth = action.payload;
        },
        setOrdersByDateUser(state, action) {
          state.ordersByDate = action.payload;
        },
        setOrdersByDate(state, action) {
          state.ordersByDate = action.payload;
        },
        setOrdersById(state, action) {
          state.ordersById = action.payload;
        },
      },
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

export const searchOrdersByDate = (date) => async (dispatch) => {
    try {
      const { data } = await dksoluciones.get("order/searchbydate/", {
        params: { date },
        ...getConfig(),
      });

      dispatch(setOrdersByDate(data.data.orders));
    } catch (error) {
      console.log(error.response.data);
    }
  };
  
  export const getOrdersById = (id) => async (dispatch) => {
    try {
      const { data } = await dksoluciones.get(`order/searchbyid/${id}`, getConfig());
      dispatch(setOrdersById([data.data]));
      console.log(data);
      
    } catch (error) {
      console.log(error);
    }
  };
  
  export const getOrdersByIdUser = (id, userId) => async (dispatch) => {
    try {
      const { data } = await dksoluciones.get(`order/searchbyiduser`, { params: { id, userId },...getConfig()  });
      dispatch(setOrdersByDateUser(data.data));
    } catch (error) {
      console.log(error);
    }
  };

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


export const { setOrdersDay, setOrdersMonth, setOrdersById, setOrdersByDate, setOrdersByDateUser } = OrdersSlice.actions

export default OrdersSlice.reducer