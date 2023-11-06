import {useState} from 'react';
import {List, ListItem} from '@mui/material';
import StartIcon from '@mui/icons-material/Start';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DropNav from './DropNav';
import styles from './TopNav.module.css';

export default function TopNav(props) {
    const [open, setOpen] = useState(true);

    return (
        <header className={styles['container']}>
            {
                !open
                ? ( 
                <div className={styles['preview']} onClick={() => setOpen(open === false)}>
                    <StartIcon/>
                </div>
                )
                : (
                <div className={styles['nav']}>
                    <div className={styles['left']} onClick={() => setOpen(open === false)}>
                        <div>
                            <StartIcon/> 
                        </div>
                        <div>
                            {props.username}
                        </div>
                    </div>
                    <div className={styles['right']}>
                        <List className={styles['nav-ul']}>
                            {
                                props.options.map((option, key) => (
                                    <>
                                        <ListItem key={key}
                                                  className={styles['nav-li']}
                                                  onClick={option.onClick}>
                                            {option.child}
                                        </ListItem>
                                    </>
                                ))
                            }
                        </List>
                        <DropNav mask={<AccountCircleIcon/>} options={props.dropOptions} current={props.current}/>
                    </div>
                </div>
                )
            }
        </header>
    )
}
