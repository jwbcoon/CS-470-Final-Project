import {useState, useEffect} from 'react';
import API from '../API_Interface/API_Interface.js';
import styles from './Login.module.css';

import { ReactComponent as EditEaseLogo } from '../icons/editease-logo.svg';
import CredentialField from '../components/CredentialField.js';

export default function Login(props) {
    const [userInput, setUserInput] = useState('');
    const [secretInput, setSecretInput] = useState('');
    const [verifyUser, setVerifyUser] = useState(false);
    const [authFailed, setAuthFailed] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);

    function handleInputChange(event, field) {
        console.log("handleInputChange called.");

        if(event.key === "Enter" && !authFailed) {
            console.log("handleKeyPress: Verify user input.");
            setVerifyUser(true);
        }
        if (field === 'username')
            setUserInput(event.target.value);
        if (field === 'password') 
            setSecretInput(event.target.value);

        setAuthFailed(false);
    };

    useEffect(() => {
        if(!verifyUser || userInput.length === 0)
            return;
        console.log('useEffect!', verifyUser, userInput, secretInput);

        const api = new API();
        async function getUserInfo() {
            console.log(`user input is: ${userInput} and secret input is: ${secretInput}`);
            api.getLoginFromUsername(userInput)
                .then( userInfo => {
                    console.log(`api returns user info and it is: ${JSON.stringify(userInfo)}`);
                    if(userInfo.data.status === "OK") {
                        const {password} = userInfo.data.user;
                        if (password === secretInput) {
                            props.setUser(userInfo.data.user);
                            return;
                        }
                    }
                    setVerifyUser(false);
                    setAuthFailed(true);
                });
        }

        async function putUserInfo() {
            console.log(`user input is: ${userInput} and secret input is: ${secretInput}`);
            if (userInput.length + secretInput.length > 0) {
                api.putLogin(userInput, secretInput)
                    .then(putLoginInfo => {
                        console.log(`api returns login info and it is: ${JSON.stringify(putLoginInfo)}`);
                        if(postInfo.data.status === "OK")
                            props.setOpenSignUp(false);
                        else {
                            setVerifyUser(false);
                            setAuthFailed(true);
                        }
                    });
            }
        }

        if (!openSignUp)
            getUserInfo();
        else
            putUserInfo();
    }, [verifyUser, userInput, secretInput]);

    return (
        <div className={styles['container']}>
            <span className={styles['theme-btn']} onClick={props.updateColorTheme}>Change Theme</span>
            <header className={styles['logo-box']}>
                <EditEaseLogo/>
            </header>
            <main className={styles['form']}>
            {
                !openSignUp
                ?
                <>
                    <CredentialField type='text' placeholder={'username'} onChange={e => handleInputChange(e, 'username')}/>
                    <br/>
                    <CredentialField type='password' placeholder={'password'} onChange={e => handleInputChange(e, 'password')}/>
                    <br/>
                    <button className={styles['form-btn']} onClick={e => {e.preventDefault(); setVerifyUser(true); console.log(verifyUser)}} tabIndex={0}>
                        PROCEED
                    </button> 
                    <span onClick={() => setOpenSignUp(openSignUp === false)}>New here? Click here to sign up</span>
                </>
                :
                <>
                    <CredentialField type='text' placeholder={'username'} onChange={e => handleInputChange(e, 'username')}/>
                    <br/>
                    <CredentialField type='password' placeholder={'password'} onChange={e => handleInputChange(e, 'password')}/>
                    <br/>
                    <button className={styles['form-btn']} onClick={e => {e.preventDefault(); setVerifyUser(true); console.log(verifyUser)}} tabIndex={0}>
                        SUBMIT
                    </button> 
                    <span onClick={() => setOpenSignUp(openSignUp === false)}>Click here to sign in</span>
                </>
            }
            </main>
        </div>
    );
}

