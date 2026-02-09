import React from 'react';
import { useLoading } from '../../context/LoadingContext';
import { useProducts } from '../../context/ProductContext';
import styles from './CommandBar.module.css';

const CommandBar = () => {
    const { startLoading } = useLoading();
    const { updateSelectedProducts, selectedIds } = useProducts();

    const handleRegister = () => {
        // 5秒間ローディング
        startLoading(5000);

        // 更新処理をモック実行（ローディング開始と同時、または終了後に反映させても良いが、今回は即座にデータ上は更新しておく）
        // UI上はオーバーレイで見えないので問題ない
        setTimeout(() => {
            updateSelectedProducts();
        }, 2000); // 少し遅らせてリアリティを出す
    };

    const handleBulkRegister = () => {
        startLoading(5000);
    };

    const handleClose = () => {
        startLoading(5000);
    };

    return (
        <div className={styles.container}>
            {/* 左側にステータス表示などを置いても良いが、今回は右寄せボタンのみ */}
            <div className={styles.status}>
                {selectedIds.length > 0 ? `${selectedIds.length} 件選択中` : ''}
            </div>

            <div className={styles.actions}>
                <button className={`${styles.button} ${styles.secondary}`} onClick={handleBulkRegister}>
                    一括登録
                </button>

                <button
                    className={`${styles.button} ${styles.primary}`}
                    onClick={handleRegister}
                    disabled={selectedIds.length === 0}
                >
                    登録
                </button>

                <button className={`${styles.button} ${styles.danger}`} onClick={handleClose}>
                    閉じる
                </button>
            </div>
        </div>
    );
};

export default CommandBar;
