import { useState, useRef } from 'react';
import EditEase from './pages/EditEase';
import Login from './pages/Login';

export default function Main() {

    const [user, setUser] = useState(undefined);
    const [theme, setTheme] = useState('dark');
    const themeRef = useRef(null);

    return (
        <div id={theme} ref={themeRef}>
            {
                user !== undefined ? (
                    <EditEase user={user} updateColorTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} logoutAction={() => setUser(undefined)} ref={themeRef}/>
                ) : (
                    <Login user={user} updateColorTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} setUser={setUser} ref={themeRef}/>
                )
            }
        </div>
    )

}
