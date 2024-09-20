import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setToken, setUser } from '../features/token/tokenSlice';

function VerifySession() {
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token) {
            dispatch(setToken(token));
            dispatch(setUser(user));
        }
    }, [dispatch]);

    return !!localStorage.getItem('token'); // Devolvemos true si el token existe, de lo contrario, devuelve false.
}

export default VerifySession;
