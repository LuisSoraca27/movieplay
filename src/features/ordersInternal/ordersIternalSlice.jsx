import { createSlice } from "@reduxjs/toolkit";
import dksoluciones from "../../api/config";
import getConfig from "../../utils/config";
import { setError, setSuccess } from "../error/errorSlice";
import { setProfileThunk } from "../user/profileSlice";

const initialState = {
  ordersByDateForUser: [],
  ordersByDateUser: [],
  ordersMonth: [],
  ordersByDate: [],
  ordersById: [],
  orderStatusError: false,
  orderStatusSuccess: false,
};

const ordersInternalSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrdersByDateForUser(state, action) {
      state.ordersByDateForUser = action.payload;
    },
    setOrdersMonth(state, action) {
      state.ordersMonth = action.payload;
    },
    setOrdersByDateUser(state, action) {
      state.ordersByDateUser = action.payload;
    },
    setOrdersByDate(state, action) {
      state.ordersByDate = action.payload;
    },
    setOrdersById(state, action) {
      state.ordersById = action.payload;
    },
    setOrderStatusError(state, action) {
      state.orderStatusError = action.payload;
    },
    setOrderStatusSuccess(state, action) {
      state.orderStatusSuccess = action.payload;
    },
  },
});

export const createOrderInternal = (data) => async (dispatch) => {
  try {
    const res = await dksoluciones.post("orderInternal/", data, getConfig());

    dispatch(setSuccess("Pedido creado exitosamente"));
  } catch (error) {
    console.log(error);
    dispatch(setError(error.response.data.message));
  }
};

export const createOrderInternalProfile = (data) => async (dispatch) => {
  try {
    const res = await dksoluciones.post(
      "orderInternal/profile",
      data,
      getConfig()
    );
    dispatch(setOrderStatusSuccess("Pedido creado exitosamente"));
    dispatch(setProfileThunk());
  } catch (error) {
    console.log(error);
    dispatch(setOrderStatusError(error.response.data.message));
  }
};

export const createOrderInternalProduct = (data) => async (dispatch) => {
  try {
    await dksoluciones.post("orderInternal/product", data, getConfig());
    dispatch(setSuccess("Pedido creado exitosamente"));
  } catch (error) {
    console.log(error);
    dispatch(setError(error.response.data.message));
  }
};

export const searchOrdersInternalByDate = (date) => async (dispatch) => {
  try {
    const { data } = await dksoluciones.get("orderinternal/searchbydate/", {
      params: { date },
      ...getConfig(),
    });
    console.log(data);
    
    dispatch(setOrdersByDate(data.data));
  } catch (error) {
    console.log(error.response.data);
  }
};

export const getOrdersInternalById = (id) => async (dispatch) => {
  try {
    const { data } = await dksoluciones.get(`orderinternal/searchbyid/${id}`, getConfig());
    dispatch(setOrdersById([data.data]));
    console.log(data);
    
  } catch (error) {
    console.log(error);
  }
};

export const downloadSalesInternal = (date) => async (dispatch) => {
  try {
      const response = await dksoluciones.post('orderinternal/getdailyinternal/', { date }, {
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


export default ordersInternalSlice.reducer;

export const {
  setOrdersByDateForUser,
  setOrdersMonth,
  setOrdersByDateUser,
  setOrdersByDate,
  setOrdersById,
  setOrderStatusError,
  setOrderStatusSuccess,
} = ordersInternalSlice.actions;
