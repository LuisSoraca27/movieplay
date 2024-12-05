import { createSlice } from '@reduxjs/toolkit';
import getConfig from '../../utils/config';
import dksoluciones from '../../api/config';
import { setError, setSuccess } from '../error/errorSlice';

export const totalItemsSlice = createSlice({
    name: 'totalItems',
    initialState: 0,
    reducers: {
        setTotalItems: (state, action) => {
            return action.payload
        },
    },
})

export const { setTotalItems } = totalItemsSlice.actions;
export default totalItemsSlice.reducer;