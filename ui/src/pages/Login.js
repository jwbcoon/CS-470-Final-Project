import {useState, useEffect, forwardRef} from 'react';
import { APIInterface as API } from '../interfaces/API_Interface.js';
import styles from './Login.module.css';

import { ReactComponent as EditEaseLogo } from '../icons/editease-logo.svg';
import CredentialField from '../components/CredentialField.js';

const Login = forwardRef(function Login(props, ref) {
    const [userInput, setUserInput] = useState('');
    const [secretInput, setSecretInput] = useState('');
    const [verifyUser, setVerifyUser] = useState(false);
    const [authFailed, setAuthFailed] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    let globalStyle = ref.current;

    useEffect(() => {
       globalStyle = ref.current;
    }, [ref.current])

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

        async function postUserInfo() {
            console.log(`user input is: ${userInput} and secret input is: ${secretInput}`);
            if (userInput.length + secretInput.length > 0) {
                api.postLogin(userInput, secretInput)
                    .then(postInfo => {
                        console.log(`api returns user info and it is: ${JSON.stringify(postInfo)}`);
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
            postUserInfo();
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
                    <CredentialField type='text' placeholder={'username'} onChange={e => handleInputChange(e)}/>
                    <br/>
                    <CredentialField type='password' placeholder={'password'} onChange={e => handleInputChange(e)}/>
                    <br/>
                    <button style={{
                                backgroundColor: '#888',
                                color: '#fff',
                                border: ' 1px solid #000'
                            }}
                            type={'button'}
                            onClick={() => {setVerifyUser(true)}}
                          >Proceed</button> 
                    <span onClick={() => setOpenSignUp(openSignUp === false)}>New here? Click here to sign up</span>
                </>
                :
                <>
                    <CredentialField type='text' placeholder={'username'} onChange={e => handleInputChange(e)}/>
                    <br/>
                    <CredentialField type='password' placeholder={'password'} onChange={e => handleInputChange(e)}/>
                    <br/>
                    <button style={{
                                backgroundColor: '#888',
                                color: '#fff',
                                border: ' 1px solid #000'
                            }}
                            type={'button'}
                            onClick={() => {setVerifyUser(true)}}
                          >Submit</button> 
                    <span onClick={() => setOpenSignUp(openSignUp === false)}>Click here to sign in</span>
                </>
            }
            </main>
        </div>
    );
});

export default Login;
