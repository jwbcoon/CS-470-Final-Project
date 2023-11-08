import {useState} from 'react';
import EditEase from './pages/EditEase.js';
import Login from './pages/Login.js';

export default function App() {

    const [user, setUser] = useState(undefined);
    const [theme, setTheme] = useState('dark');

    return (
        <div id={theme}>
            {
                user !== undefined ? (
                    <EditEase user={user} updateColorTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} logout={() => setUser(undefined)}/>
                ) : (
                    <Login user={user} updateColorTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} setUser={setUser}/>
                )
            }
        </div>
    )

}
