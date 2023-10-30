import {useState} from 'react';
import {List, ListItem, Divider} from '@mui/material';
import StartIcon from '@mui/icons-material/Start';
import styles from './TopNav.module.css';

const onClick = (e, open, setOpen) => {
    if (open === false) {
        setOpen(true);
    }
    else {
        setOpen(false);
    }
}


export default function TopNav(props) {
    const [open, setOpen] = useState(true);

    return (
        <div className={styles['container']}>
            {
                !open
                ? ( 
                <div className={styles['preview']} onClick={e => onClick(e, open, setOpen)}>
                    <StartIcon/>
                </div>
                )
                : (
                <div className={styles['nav']}>
                    <div onClick={e => onClick(e, open, setOpen)}>
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
