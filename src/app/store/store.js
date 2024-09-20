import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../../features/user/userSlice'
import profileSlice from '../../features/user/profileSlice'
import comboSlice from '../../features/user/comboSlice'
import courseSlice from '../../features/course/courseSlice'
import licenseSlice from '../../features/license/licenseSlice'
import accountSlice from '../../features/account/accountSlice'
import isLoadingSlice from '../../features/isLoading/isLoadingSlice'
import errorSlice from '../../features/error/errorSlice'
import balanceSlice from '../../features/balance/balanceSlice'
import OrdersSlice from '../../features/orders/OrdersSlice'
import notificationSlice from '../../features/notifications/notificationSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        profiles: profileSlice,
        combos: comboSlice,
        courses: courseSlice,
        licenses: licenseSlice,
        accounts: accountSlice,
        isLoading: isLoadingSlice,
        error: errorSlice,
        balance: balanceSlice,
        orders: OrdersSlice,
        notification: notificationSlice,
    },
    devTools: true
})