import React, { useState, Fragment } from 'react';
import EditEase from './pages/EditEase';
import Login from './pages/Login';
import './App.css'

const logout = (setUser) => {
    return () => {
        setUser(undefined);
    }
};


export default function Main() {

    const [user, setUser] = useState(undefined);

    return (
        <Fragment>
            {
                user !== undefined ? (
                    <EditEase user={user} logoutAction={logout(setUser)} />
                ) : (
                    <Login user={user} setUser={setUser} />
                )
            }
        </Fragment>
    )

}
