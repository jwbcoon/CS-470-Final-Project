import {useState} from 'react';
import {List, ListItem, Divider} from '@mui/material';
import StartIcon from '@mui/icons-material/Start';
import styles from './ToolBox.module.css';

const onClick = (e, open, setOpen) => {
    if (open === false) {
        setOpen(true);
    }
    else {
        setOpen(false);
    }
}


export default function ToolBox(props) {
    const [open, setOpen] = useState(false);

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
                            ['Open Tools', 'Save Image', 'Import Image', 'Upload Image'].map((option, key) => (
                                <>
                                    <Divider key={`divider${key}`} className={styles['divider']}/>
                                    <ListItem key={`li${key}`} className={styles['li']}>
                                        <p>{option}</p>
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
