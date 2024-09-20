import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    error: null,
    success: null,
};

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state, action) => {
            state.error = action.payload;
        },
        removeError: (state) => {
            state.error = null;
        },
        setSuccess: (state, action) => {
            state.success = action.payload;
        },
        removeSuccess: (state) => {
            state.success = null;
        },
    },
});

export const { setError, removeError, setSuccess, removeSuccess } = errorSlice.actions;
export default errorSlice.reducer;
