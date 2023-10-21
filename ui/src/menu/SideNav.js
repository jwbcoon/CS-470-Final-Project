import {useState} from 'react';
import {List, ListItem} from '@mui/material';
import StartIcon from '@mui/icons-material/Start';
import styles from './SideNav.module.css';

const onClick = (e, open, setOpen, setCurrStyles) => {
    if (open === false) {
        setOpen(true);
    }
    else {
        setOpen(false);
    }
}


export default function SideNav(props) {
    const [open, setOpen] = useState(false);
    const [currStyles, setCurrStyles] = useState(styles);

    return (
        <div className={currStyles['container']}>
            {
                !open
                ? ( 
                <div className={currStyles['preview']}>
                    <StartIcon onClick={e => onClick(e, open, setOpen, setCurrStyles)}/>
                </div>
                )
                : (
                <div className={currStyles['nav']}>
                    <StartIcon onClick={e => onClick(e, open, setOpen, setCurrStyles)}/> 
                    <List>
                        <ListItem>
                            <h4>SideNav!</h4>
                        </ListItem>
                    </List>
                </div>
                )
            }
        </div>
    )
}
