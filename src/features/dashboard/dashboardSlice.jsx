import { createSlice } from "@reduxjs/toolkit";
import dksoluciones from "../../api/config";
import getConfig from "../../utils/config";

const initialState = {
    ventasExternas: { daily: 0, monthly: 0 },
    ventasInternas: { daily: 0, monthly: 0 },
    gastos: { daily: 0, monthly: 0 },
    ventasTotales: { daily: 0, monthly: 0 },
    ventasMonthly: [],
    VentasAnuales: [],
    topSellers: [],
    bestSellingCategories: [],
    availableInventory: [],
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setVentasExternas: (state, action) => { state.ventasExternas = action.payload; },
        setVentasInternas: (state, action) => { state.ventasInternas = action.payload; },
        setGastos: (state, action) => { state.gastos = action.payload; },
        setTotales: (state, action) => { state.ventasTotales = action.payload; },
        setVentasMonthly: (state, action) => { state.ventasMonthly = action.payload; },
        setVentasAnuales: (state, action) => { state.VentasAnuales = action.payload; },
        setTopSellers: (state, action) => { state.topSellers = action.payload; },
        setBestSellingCategories: (state, action) => { state.bestSellingCategories = action.payload; },
        setAvailableInventory: (state, action) => { state.availableInventory = action.payload; },
    },
});

export const getDashboard = () => async (dispatch) => {
    try {
        const { data } = await dksoluciones.get("dashboard/", getConfig());
        dispatch(setVentasExternas(data.dashboardData.ventasExternas));
        dispatch(setVentasInternas(data.dashboardData.ventasInternas));
        dispatch(setGastos(data.dashboardData.gastos));
        dispatch(setTotales(data.dashboardData.ventasTotales));
    } catch (error) { console.log(error); }
}

export const getSalesMonthly = () => async (dispatch) => {
    try {
        const { data } = await dksoluciones.get("dashboard/monthly-sales-trends", getConfig());
        dispatch(setVentasMonthly(data.data.datasets[0].data));
    } catch (error) { console.log(error); }
}

export const getSalesAnual = () => async (dispatch) => {
    try {
        const { data } = await dksoluciones.get("dashboard/annual-sales", getConfig());
        dispatch(setVentasAnuales(data.data.datasets[0].data));
    } catch (error) { console.log(error); }
}

export const getTopSellers = () => async (dispatch) => {
    try {
        const { data } = await dksoluciones.get("dashboard/top-sellers", getConfig());
        dispatch(setTopSellers(data.data));
    } catch (error) { console.log(error); }
}

export const getBestSellingCategories = () => async (dispatch) => {
    try {
        const { data } = await dksoluciones.get("dashboard/best-selling-categories", getConfig());
        dispatch(setBestSellingCategories(data.data));
    } catch (error) { console.log(error); }
}

export const getAvailableInventory = () => async (dispatch) => {
    try {
        const { data } = await dksoluciones.get("dashboard/available-inventory", getConfig());
        dispatch(setAvailableInventory(data.data));
    } catch (error) { console.log(error); }
}

export const {
    setVentasExternas,
    setVentasInternas,
    setGastos,
    setTotales,
    setVentasMonthly,
    setVentasAnuales,
    setTopSellers,
    setBestSellingCategories,
    setAvailableInventory,
} = dashboardSlice.actions

export default dashboardSlice.reducer;