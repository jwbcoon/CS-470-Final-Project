import { ReactComponent as ProfileIcon } from '../icons/profile-user-svgrepo-com.svg';
import styles from './Gallery.module.css';

export default function Gallery(props) {
    return (
        <main className={styles['layout']}>
            <header className={styles['head']}>
                <div className={styles['user-info']}>
                    <div>
                        <ProfileIcon/>
                    </div>
                    <p>Info about uploaded photos!</p>
                </div>
                <div className={styles['options']}>
                    <p>Some buttons to interact with Gallery</p>
                </div>
            </header>
            <section className={styles['gallery']}>
                {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                     11, 12, 13, 14, 15, 16, 17, 18,
                     19, 20].map(img => (
                        <div style={{ width: '10rem', height: '10rem', border: '1px solid #ffffff44', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            Content!
                        </div>
                     ))
                }
            </section>
        </main>  
    );
}
