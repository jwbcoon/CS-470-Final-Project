import {useState} from 'react';
import {List, ListItem, Divider} from '@mui/material';
import StartIcon from '@mui/icons-material/Start';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DropNav from './DropNav';
import styles from './TopNav.module.css';

export default function TopNav(props) {
    const [open, setOpen] = useState(true);

    return (
        <div className={styles['container']}>
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
                        <StartIcon/> 
                    </div>
                    <div className={styles['right']}>
                        <List className={styles['nav-ul']}>
                            {
                                props.options.map((option, key) => (
                                    <>
                                        <Divider key={`divider${key}`} className={styles['divider']} orientation='vertical'/>
                                        <ListItem key={`${option.child.innerText}${key}`}
                                                  className={styles['nav-li']}
                                                  onClick={option.onClick}>
                                            {option.child}
                                        </ListItem>
                                    </>
                                ))
                            }
                            <Divider className={styles['divider']} orientation='vertical'/>
                        </List>
                        <DropNav mask={<AccountCircleIcon/>} options={props.dropOptions} current={props.current}/>
                    </div>
                </div>
                )
            }
        </div>
    )
}
