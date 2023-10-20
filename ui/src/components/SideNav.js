import {useState} from 'react';
import {List, ListItem} from '@mui/material';

const onMouseOver = (e, open, style, setStyle) => {
    if (!open) {
        setStyle({...style, backgroundColor: '#f3f3f3'});
    }
}

const onMouseLeave = (e, open, style, setStyle) => {
    if (!open) {
        setStyle({...style, backgroundColor: '#ffffff'});
    }
}

const onClick = (e, open, setOpen, style, setStyle) => {
    if (open === false) {
        setStyle({...style, backgroundColor: '#efefef', width: '300px'});
        setOpen(true);
    }
    else {
        setStyle({...style, backgroundColor: '#ffffff', width: '50px'})
        setOpen(false);
    }
}


export default function SideNav(props) {
    const [open, setOpen] = useState(false);
    const [openStyle, setOpenStyle] = useState(props.style);
    const [hoverStyle, setHoverStyle] = useState(props.style);

    return (
        <div className={props.className} style={openStyle}
             onClick={e => onClick(e, open, setOpen, openStyle, setOpenStyle)}>
            <div style={hoverStyle}
                 onMouseOver={e => onMouseOver(e, open, hoverStyle, setHoverStyle)}
                 onMouseLeave={e => onMouseLeave(e, open, hoverStyle, setHoverStyle)}>
            {
                open &&
                <List>
                    <ListItem>
                        <h4>SideNav!</h4>
                    </ListItem>
                </List>
            }
            </div>
        </div>
    )
}
