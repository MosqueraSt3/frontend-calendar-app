import { Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage } from '../auth';
import { CalendarPage } from '../calendar';
import { getEnvVariables } from '../helpers';

export const AppRouter = () => {

    const authStates = 'not-authenticated';

    return (
        <Routes>
            {
                ( authStates === 'not-authenticated' )
                ? <Route path='/auth/*' element={ <LoginPage /> } />
                : <Route path='/*' element={ <CalendarPage /> } />
            }
            
            <Route path='/*' element={ <Navigate to='/auth/login' /> } />
        </Routes>
    )
}
