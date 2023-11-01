import {useState} from 'react';
import {List, ListItem, Divider} from '@mui/material';
import StartIcon from '@mui/icons-material/Start';
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
                    <div onClick={() => setOpen(open === false)}>
                        <StartIcon/> 
                    </div>
                    <List>
                        {
                            props.options.map((option, key) => (
                                <>
                                    <Divider key={`divider${key}`} className={styles['divider']} orientation='vertical'/>
                                    <ListItem key={`${option.child.innerText}${key}`}
                                              className={option.pageName === props.current ? styles['selected'] : styles['li']}
                                              onClick={option.onClick}>
                                        {option.child}
                                    </ListItem>
                                </>
                            ))
                        }
                    </List>
                </div>
                )
            }
        </div>
    )
}
