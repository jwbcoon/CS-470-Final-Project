import React, { useState, Fragment } from 'react';
import EditEase from './pages/EditEase';
import Login from './pages/Login';

export default function Main() {

    const [user, setUser] = useState(undefined);

    return (
        <Fragment>
            {
                user !== undefined ? (
                    <EditEase user={user} logoutAction={() => setUser(undefined)} />
                ) : (
                    <Login user={user} setUser={setUser} />
                )
            }
        </Fragment>
    )

}
