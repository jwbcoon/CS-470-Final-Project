import React, {useState} from 'react';
import EditEase from './pages/EditEase.js';
import Login from './pages/Login.js';
import { useUserData } from './util/DataContexts.js';

export default function App() {

    const user = useUserData();
    const [theme, setTheme] = useState('light');

    return (
        <div id={theme}>
            {
                user !== undefined
                ? (
                <EditEase updateColorTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}/>
                )
                : (
                <Login theme={theme} updateColorTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}/>
                )
            }
        </div>
    )
}
