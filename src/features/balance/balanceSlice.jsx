import { createSlice } from '@reduxjs/toolkit'
import dksoluciones from '../../api/config';
import getConfig from '../../utils/config';

const initialState = '0.00'

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    setNewBalance: (state, action) => {
      return action.payload
    }
  }
});

export const setBalanceThunk = (id) => async (dispatch) => {
  try {
    const res = await dksoluciones.get(`/user/getbalance/${id}`, getConfig());
    const { data } = res.data;
    dispatch(setNewBalance(data.balance));
  } catch (error) {
    console.log(error);
    if (error.response.data.message === 'Session expired') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.reload()
    }
  }
}

export const { setNewBalance } = balanceSlice.actions

export default balanceSlice.reducer


