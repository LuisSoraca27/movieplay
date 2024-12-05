import { createSlice } from "@reduxjs/toolkit";
import dksoluciones from "../../api/config";
import getConfig from "../../utils/config";
import { setError, setSuccess } from "../error/errorSlice";

const initialState = {
  products: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProductsById: (state, action) => {
      state.products = [action.payload];
    }
  },
});

export const createProductThunk = (product) => async (dispatch) => {
  try {
      await dksoluciones.post("combo/", product, getConfig());
      dispatch(setSuccess("Producto creado exitosamente"));
      dispatch(getProducts());
  } catch (error) {
    dispatch(setError(error.response.data.message));
    console.error(error);
  }
};

export const getProducts = () => async (dispatch) => {
    try {
      const response = await dksoluciones.get("combo/", getConfig());
      dispatch(setProducts(response.data.data));
    } catch (error) {
      console.error(error);
    }
  };

  export const getProductById = (name) => async (dispatch) => {
    try {
      const response = await dksoluciones.get(`combo/${name}`, getConfig());
      dispatch(setProducts(response.data.data));
    } catch (error) {
      console.error(error);
    }
  };

  export const updateProduct = (product) => async (dispatch) => {
    try {
      await dksoluciones.put(`combo/${product.id}`, product, getConfig());
      dispatch(setSuccess("Producto actualizado exitosamente"));
      dispatch(getProducts());
    } catch (error) {
      dispatch(setError(error.response.data.message));
      console.error(error);
    }
  };

  export const deleteProduct = (id) => async (dispatch) => {
    try {
      await dksoluciones.delete(`combo/${id}`, getConfig());
      dispatch(setSuccess("Producto eliminado exitosamente"));
      dispatch(getProducts());
    } catch (error) {
      dispatch(setError(error.response.data.message));
      console.error(error);
    }
  };

export const { setProducts, setProductsById } = productSlice.actions;
export default productSlice.reducer;
