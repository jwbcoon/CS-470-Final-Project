import {useState} from 'react';
import EditEase from './pages/EditEase.js';
import Login from './pages/Login.js';
import MasterDataProvider from './util/DataContexts.js';

export default function App() {

    const [user, setUser] = useState(undefined);
    const [theme, setTheme] = useState('dark');

    return (
        <div id={theme}>
            {
                user !== undefined ? (
                    <MasterDataProvider>
                        <EditEase user={user} updateColorTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                                  logout={() => setUser(undefined)}/>
                    </MasterDataProvider>
                ) : (
                    <Login user={user} updateColorTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} setUser={setUser}/>
                )
            }
        </div>
    )

}
