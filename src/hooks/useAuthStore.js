import { useDispatch, useSelector } from 'react-redux';
import { calendarApi } from '../api';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store';

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();

    const startLogin = async ({ email, password }) => {
        dispatch( onChecking() );
        try {
            const { data } = await calendarApi.post('/auth', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            const { _id, name } = data.user;
            dispatch( onLogin({ _id, name, email, }) );
        } catch (error) {
            dispatch( onLogout('Error login') );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    };

    const startRegister = async ({ name, email, password }) => {
        dispatch( onChecking() );
        try {
            const { data } = await calendarApi.post('/auth/post', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            const { _id } = data.user;
            dispatch( onLogin({ _id, name, email, }) );
        } catch (error) {
            dispatch( onLogout(error.response.data?.msg || '--') );
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    };

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) return dispatch( onLogout() );
        try {
            const { data } = await calendarApi.get('/auth/get');
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());
            const { uid, name, email } = data.user;
            dispatch( onLogin({ uid, name, email, }) );
        } catch (error) {
            localStorage.clear();
            dispatch( onLogout() );
        }
    };

    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogout() );
    }

    return {
        status,
        user,
        errorMessage,
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout,
    }
};