import {useState, useEffect} from 'react';
import API from '../API_Interface/API_Interface';
import styles from './Login.module.css';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { ReactComponent as EditEaseLogo } from '../icons/editease-logo.svg';
import CredentialField from '../components/CredentialField';


export default function Login({setUser}) {
    const [userInput, setUserInput] = useState('');
    const [verifyUser, setVerifyUser] = useState(false);
    const [authFailed, setAuthFailed] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);

    const makeUserName = ({user_fName, user_mName, user_lName}) => {

        console.log(`making user name with: ${user_fName} : ${user_mName} : ${user_lName}`);
        const middleName = () => user_mName !== undefined && user_mName !== null  
                            ? `${user_mName.length === 1 ? user_mName[0] + '.' : user_mName}` 
                            : '';

        return `${user_fName} ${middleName()} ${user_lName}`;
    };



    const handleInputChange = event => {
        console.log("handleInputChange called.");

//        event.stopPropagation();
//        event.preventDefault();

        setUserInput(event.target.value);
        setAuthFailed(false);

        if(event.key === "Enter") {
            console.log("handleKeyPress: Verify user input.");
            setVerifyUser(true);
        }
    };

    useEffect(() => {

        if( ! verifyUser || userInput.length === 0)
            return;

        const api = new API();
        async function getUserInfo() {
            console.log(`user input is: ${userInput}`);
            api.getLoginFromUsername(userInput)
                .then( userInfo => {
                    console.log(`api returns user info and it is: ${JSON.stringify(userInfo)}`);
                    if( userInfo.data.status === "OK" ) {
                        setUser(userInfo.data.user.username);
                    } else  {
                        setVerifyUser(false);
                        setAuthFailed(true);
                    }
                });
        }

        getUserInfo();
    }, [verifyUser, setUser, userInput]);


    return (
        <div className={styles['container']}>
            <div className={styles['logo-box']}>
                <EditEaseLogo/>
            </div>
            <div className={styles['form']}>
            {
                !openSignUp
                ?
                <>
                    <CredentialField type='text' placeholder={'username'} onChange={e => handleInputChange(e)}/>
                    <Divider/>
                    <CredentialField type='password' placeholder={'password'} onChange={e => handleInputChange(e)}/>
                    <Divider/>
                    <Button   style={{ backgroundColor: '#1f0a0a', color: '#a96fb3', border: '1px solid #a96fb3' }}
                              variant="contained"
                              onClick={() => {setVerifyUser(true)}}
                          >Proceed</Button> 
                    <span onClick={() => setOpenSignUp(openSignUp === false)}>New here? Click here to sign up</span>
                </>
                :
                <>
                    <CredentialField type='text' placeholder={'username'} onChange={e => handleInputChange(e)}/>
                    <Divider/>
                    <CredentialField type='password' placeholder={'password'} onChange={e => handleInputChange(e)}/>
                    <Divider/>
                    <Button   style={{ backgroundColor: '#1f0a0a', color: '#a96fb3', border: '1px solid #a96fb3' }}
                              variant="contained"
                              onClick={() => {setVerifyUser(true)}}
                          >Submit</Button> 
                    <span onClick={() => setOpenSignUp(openSignUp === false)}>Click here to sign in</span>
                </>
            }
            </div>
        </div>
    );
}
