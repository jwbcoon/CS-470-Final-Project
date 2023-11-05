import {useState} from 'react';
import {Divider} from '@mui/material';
import styles from './DropNav.module.css';

export default function DropNav(props) {
    const [open, setOpen] = useState(false);

    return (
        <nav>
            <div className={styles['mask']} onClick={() => setOpen(!open)}>
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
                                </>
                            )
                        }
                    </ul>
                </div>
                )
                : (
                <div style={{ width: '0', height: '0', transform: 'translateX(250px)' }}>
                    <ul className={styles['dmul']}>
                        {
                            props.options.map((option, key) => 
                                <>
                                    <li onClick={option.onClick}
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
        </nav>
    );
}
