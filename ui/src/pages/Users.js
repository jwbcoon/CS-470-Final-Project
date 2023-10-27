import React, {useState, useEffect, Fragment} from 'react';
import Typography from '@mui/material/Typography';
import API from '../API_Interface/API_Interface';


import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const usersTableAttributes = [
    {
        title: 'User ID',
        attributeDBName: 'userID',
        align: 'left'
    },
    {
        title: 'User Name',
        attributeDBName: 'username',
        align: 'left'
    },
    {
        title: 'Date Created',
        attributeDBName: 'dateCreated',
        align: 'left'
    }
];
export default function Users(props) {


    const [users, setUsers] = useState([]);
    console.log(`in UsersTable routes contains is ${JSON.stringify(users)}`);


    useEffect(() => {
        const api = new API();

        async function getUsers() {
            const usersJSONString = await api.getUserFromID(1);
            console.log(`users from the DB ${JSON.stringify(usersJSONString)}`);
            setUsers(usersJSONString.data);
        }

        getUsers();
    }, []);

    const TRow = ({usersObject}) => {
        return <TableRow
            sx={{'&:last-child td, &:last-child th': {border: 0}}}
        >
            {
                usersTableAttributes.map((attr, idx) =>
                    <TableCell key={idx}
                               align={attr.align}>
                        {
                            usersObject[attr.attributeDBName]
                        }
                    </TableCell>)
            }
        </TableRow>
    }

    return <Fragment>
        {
            users.length > 0 &&
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="users table">
                    <TableHead>
                        <TableRow>
                            {
                                usersTableAttributes.map((attr, idx) =>
                                    <TableCell  key={idx}
                                                align={attr.align}>
                                        {attr.title}
                                    </TableCell>)
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            users.map((user, idx) => (
                                <TRow usersObject={user} key={idx}/>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        }
    </Fragment>

}



