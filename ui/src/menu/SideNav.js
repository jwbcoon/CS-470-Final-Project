import {useState} from 'react';
import {List, ListItem, Divider} from '@mui/material';
import StartIcon from '@mui/icons-material/Start';
import styles from './SideNav.module.css';

const onClick = (e, open, setOpen) => {
    if (open === false) {
        setOpen(true);
    }
    else {
        setOpen(false);
    }
}


export default function SideNav(props) {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles['container']}>
            {
                !open
                ? ( 
                <div className={styles['preview']}>
                    <StartIcon onClick={e => onClick(e, open, setOpen)}/>
                </div>
                )
                : (
                <div className={styles['nav']}>
                    <div onClick={e => onClick(e, open, setOpen)}>
                        <StartIcon/> 
                    </div>
                    <List style={{p: 0}}>
                        <Divider className={styles['divider']}/>
                        <ListItem className={styles['li']}>
                            <p>Open Tools</p>
                        </ListItem>
                        <Divider className={styles['divider']}/>
                        <ListItem className={styles['li']}>
                            <p>Save Image</p>
                        </ListItem>
                        <Divider className={styles['divider']}/>
                        <ListItem className={styles['li']}>
                            <p>Import Image</p>
                        </ListItem>
                        <Divider className={styles['divider']}/>
                        <ListItem className={styles['li']}>
                            <p>Upload Image</p>
                        </ListItem>
                    </List>
                </div>
                )
            }
        </div>
    )
}
