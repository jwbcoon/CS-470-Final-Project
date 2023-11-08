import {useState, forwardRef, useRef, useImperativeHandle} from 'react';
import styles from './ToolBox.module.css';

const ToolBox = forwardRef(function ToolBox(props, ref) {
    const redRef = useRef({value: 0});
    const greenRef = useRef({value: 0});
    const blueRef = useRef({value: 0});
    const alphaRef = useRef({value: 0});

    useImperativeHandle(ref, () => {
        return {
            red: redRef.current.value,
            green: greenRef.current.value,
            blue: blueRef.current.value,
            alpha: alphaRef.current.value
        };
    }, [redRef.current.value, greenRef.current.value, blueRef.current.value, alphaRef.current.value]);

    return (
        <menu className={styles['toolbox']}>
            <div className={styles['slider']}>
                <span>This will be an input</span>
            </div>
            <div className={styles['rgba-input']}>
                <span className={styles['r']}>
                    <label>R:</label>
                    <input type={'number'} onChange={props.onChange} ref={redRef}
                           min={props.rgbaMin} max={props.rgbaMax} value={redRef.current.value}/>
                </span>
                <span className={styles['g']}>
                    <label>G:</label>
                    <input type={'number'} onChange={props.onChange} ref={greenRef}
                           min={props.rgbaMin} max={props.rgbaMax} value={greenRef.current.value}/>
                </span>
                <span className={styles['b']}>
                    <label>B:</label>
                    <input type={'number'} onChange={props.onChange} ref={blueRef}
                           min={props.rgbaMin} max={props.rgbaMax} value={blueRef.current.value}/>
                </span>
                <span className={styles['a']}>
                    <label>A:</label>
                    <input type={'number'} onChange={props.onChange} ref={alphaRef}
                           min={props.rgbaMin} max={props.rgbaMax} value={alphaRef.current.value}/>
                </span>
            </div>
            <div className={styles['apply']}>
                <button onClick={props.onApply}>Apply</button>
            </div>
        </menu>
    );
});

export default ToolBox;
