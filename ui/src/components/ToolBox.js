import styles from './ToolBox.module.css';

export default function ToolBox({editParams, setEditParams, rgbaMin, rgbaMax, onApply}) {

    function handleChange(ev, color) {
        setEditParams(prevEditParams => ({
            ...prevEditParams,
            [color]: parseInt(ev.target.value)
        }));
    }

    return (
        <menu className={styles['toolbox']}>
            <div className={styles['slider']}>
                <span>This will be an input</span>
            </div>
            <div className={styles['rgba-input']}>
                <span className={styles['r']}>
                    <label>R:</label>
                    <input type={'number'}
                           onChange={ev => handleChange(ev, 'red')}
                           min={rgbaMin} max={rgbaMax} value={editParams.red}/>
                </span>
                <span className={styles['g']}>
                    <label>G:</label>
                    <input type={'number'}
                           onChange={ev => handleChange(ev, 'green')}
                           min={rgbaMin} max={rgbaMax} value={editParams.green}/>
                </span>
                <span className={styles['b']}>
                    <label>B:</label>
                    <input type={'number'}
                           onChange={ev => handleChange(ev, 'blue')}
                           min={rgbaMin} max={rgbaMax} value={editParams.blue}/>
                </span>
                <span className={styles['a']}>
                    <label>A:</label>
                    <input type={'number'}
                           onChange={ev => handleChange(ev, 'alpha')}
                           min={rgbaMin} max={rgbaMax} value={editParams.alpha}/>
                </span>
            </div>
            <div className={styles['apply']}>
                <button onClick={onApply}>Apply</button>
            </div>
        </menu>
    );
}

