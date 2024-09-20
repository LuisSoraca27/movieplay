import { createContext, useCallback, useContext, useMemo, useState } from "react";
import dksoluciones from "../api/config";
import { useDispatch } from "react-redux";
import { setError, setSuccess } from "../features/error/errorSlice";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {

    const dispatch = useDispatch();

    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('auth') ?? false);

    const [userAuth, setUserAuth] = useState(JSON.parse(localStorage.getItem('user')) ?? {});


    const login = useCallback(async ({ email, password }) => {
        try {
            const res = await dksoluciones.post('user/login', { email, password })
            const { user, token } = res.data.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('auth', true);
            setIsAuthenticated(true);
            setUserAuth(user);
        } catch (error) {
            console.log(error)
            dispatch(setError(error.response.data.message))
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('auth');
        setIsAuthenticated(false);
        setUserAuth({});
    }, []);

    const value = useMemo(() => ({
        isAuthenticated,
        userAuth,
        login,
        logout,
    }), [isAuthenticated, userAuth, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    return useContext(AuthContext);
}