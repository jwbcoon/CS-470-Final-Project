import {useState} from 'react';
import DropNav from './DropNav.js';
import styles from './TopNav.module.css';

export default function TopNav(props) {
    const [open, setOpen] = useState(true);

    return (
        <header className={styles['container']}>
            {
                !open
                ? ( 
                <div className={styles['preview']} onClick={() => setOpen(open === false)}>
                    <span>SVG</span>
                </div>
                )
                : (
                <div className={styles['nav']}>
                    <div className={styles['left']} onClick={() => setOpen(open === false)}>
                        <div>
                            <span>SVG</span>
                        </div>
                        <div>
                            {props.username}
                        </div>
                    </div>
                    <div className={styles['right']}>
                        <menu className={styles['nav-ul']}>
                            {
                                props.options.map((option, key) => (
                                    <li key={`${option.child.innerText}${key}`}
                                              className={styles['nav-li']}
                                              onClick={option.onClick}>
                                        {option.child}
                                    </li>
                                ))
                            }
                        </menu>
                        <DropNav mask={<span>SVG</span>} options={props.dropOptions} current={props.current}/>
                    </div>
                </div>
                )
            }
        </header>
    )
}
