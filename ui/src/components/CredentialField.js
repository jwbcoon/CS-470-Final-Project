import {useState} from 'react';
import styles from './CredentialField.module.css';

export default function CredentialField(props) {
    const [styleId, setStyleId] = useState('valid');

    return (
        <div className={styles['input-box']}>
            <label>{props.placeholder}</label>
            <input type={props.type} onChange={props.onChange} required='required'/>
        </div>
    )
}
