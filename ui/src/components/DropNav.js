import {useState} from 'react';
import {Divider} from '@mui/material';
import styles from './DropNav.module.css';

export default function DropNav(props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className={styles['container']} onClick={() => setOpen(!open)}>
                {props.mask}
            </div>
            {
                open 
                ? (
                <div className={styles['drop-menu']}>
                    <ul className={styles['dmul']}>
                        {
                            props.options.map((option, key) => 
                                <>
                                    <li onClick={option.onClick}
                                        className={option.pageName === props.current ? styles[`selected${key}`] : styles[`dmli${key}`]}>
                                        {option.child}
                                    </li>
                                    <Divider/>
                                </>
                            )
                        }
                    </ul>
                </div>
                )
                : (
                <div style={{ width: '0', height: '0', backgroundColor: 'transparent', transform: 'scale(0.01)' }}>
                    <ul className={styles['dmul']}>
                        {
                            props.options.map((option, key) => 
                                <>
                                    <Divider className={styles['divider']}/>
                                    <li onClick={option.onClick} style={{ transform: 'scale(0.01)' }}
                                        className={option.pageName === props.current ? styles[`selected${key}`] : styles[`dmli${key}`]}>
                                        {option.child}
                                    </li>
                                </>
                            )
                        }
                    </ul>
                </div>
                )
            }
        </>
    );
}
