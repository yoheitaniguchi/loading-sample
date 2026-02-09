import React from 'react';
import { Settings } from 'lucide-react';
import styles from './LoadingOverlay.module.css';
import { useLoading } from '../../context/LoadingContext';

const LoadingOverlay = () => {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className={styles.overlay} role="alert" aria-busy="true">
            <div className={styles.spinnerContainer}>
                {/* Gear icons rotating */}
                <Settings className={`${styles.gear} ${styles.gearLarge}`} size={64} />
                <Settings className={`${styles.gear} ${styles.gearSmall}`} size={48} />
                <p className={styles.text}>処理中...</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
