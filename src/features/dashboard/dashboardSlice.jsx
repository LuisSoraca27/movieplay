import { createSlice } from "@reduxjs/toolkit";
import dksoluciones from "../../api/config";
import getConfig from "../../utils/config";

const initialState = {
    ventasExternas: {
        daily: 0,
        monthly: 0,
    },
    ventasInternas: {
        daily: 0,
        monthly: 0,
    },
    gastos: {
        daily: 0,
        monthly: 0,
    },
    ventasTotales: {
        daily: 0,
        monthly: 0,
    },
    ventasMonthly: [],
    VentasAnuales: [],
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setVentasExternas: (state, action) => {
            state.ventasExternas = action.payload;
        },
        setVentasInternas: (state, action) => {
            state.ventasInternas = action.payload;
        },
        setGastos: (state, action) => {
            state.gastos = action.payload;
        },
        setTotales: (state, action) => {            
            state.ventasTotales = action.payload;
        },
        setVentasMonthly: (state, action) => {
            state.ventasMonthly = action.payload;
        },
        setVentasAnuales: (state, action) => {
            state.VentasAnuales = action.payload;
        },
    },
});

export const getDashboard = () => async (dispatch) => {
    try {
        const { data} = await dksoluciones.get("dashboard/", getConfig());
        console.log(data.dashboardData);
        dispatch(setVentasExternas(data.dashboardData.ventasExternas));
        dispatch(setVentasInternas(data.dashboardData.ventasInternas));
        dispatch(setGastos(data.dashboardData.gastos));
        dispatch(setTotales(data.dashboardData.ventasTotales));
    } catch (error) {
        console.log(error);
    }
}

export const getSalesMonthly = () => async (dispatch) => {
    try {
        const { data} = await dksoluciones.get("dashboard/monthly-sales-trends", getConfig());
        dispatch(setVentasMonthly(data.data.datasets[0].data));
    } catch (error) {
        console.log(error);
    }
}

export const getSalesAnual = () => async (dispatch) => {
    try {
        const { data} = await dksoluciones.get("dashboard/annual-sales", getConfig());
        console.log(data);
        
      dispatch(setVentasAnuales(data.data.datasets[0].data));
    } catch (error) {
        console.log(error);
    }
}


export const { setVentasExternas, setVentasInternas, setGastos, setTotales, setVentasMonthly, setVentasAnuales } = dashboardSlice.actions

export default dashboardSlice.reducer;