import React, { useRef } from 'react';
import { Search } from 'lucide-react';
import { useLoading } from '../../context/LoadingContext';
import styles from './SearchFilter.module.css';

const SearchFilter = () => {
    const { startLoading } = useLoading();
    const lastFocusTime = useRef(0);
    const lastFocusedIndex = useRef(-1); // 前回フォーカスされた要素のインデックス
    const item5Ref = useRef(null); // 項目5 (index 4) への参照

    const handleFocus = (e, index) => {
        const now = Date.now();

        // 直前のローディングから十分時間が経っていない、かつ「同じ要素」へのフォーカス復帰の場合は無視
        // これにより、ユーザーが「別の要素」を素早くクリックした場合はブロックしないようにする
        if (index === lastFocusedIndex.current && now - lastFocusTime.current < 3500) {
            console.log('Focus ignored due to recent loading completion (Restoration)');
            return;
        }

        console.log('Focus triggered loading on:', e.target.name);
        // フォーカスされた要素を記録
        lastFocusedIndex.current = index;
        lastFocusTime.current = now;

        if (index === 5) { // 項目6 (index 5) の場合
            // 自動フォーカス復帰を無効にしてローディング開始
            startLoading(3000, false);

            // ローディング終了後(3000ms)の処理
            setTimeout(() => {
                // エラーメッセージ表示
                alert("エラーが発生しました");

                // 項目5へフォーカス移動
                if (item5Ref.current) {
                    // プログラマティックな移動なので、移動先のデバウンス情報を更新して
                    // 移動先でのローディング発火を抑制する
                    lastFocusedIndex.current = 4;
                    lastFocusTime.current = Date.now();
                    item5Ref.current.focus();
                }
            }, 3100);
        } else {
            // 通常の挙動
            startLoading(3000);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {/* 6 input fields */}
                {[...Array(6)].map((_, i) => (
                    <div key={i} className={styles.inputGroup}>
                        <label htmlFor={`search-${i}`} className={styles.label}>検索項目 {i + 1}</label>
                        <input
                            id={`search-${i}`}
                            name={`search-field-${i + 1}`}
                            type="text"
                            className={styles.input}
                            ref={i === 4 ? item5Ref : null} // 項目5 (index 4) に ref を設定
                            onFocus={(e) => handleFocus(e, i)}
                            placeholder={`条件 ${i + 1} を入力`}
                        />
                    </div>
                ))}
            </div>
            <div className={styles.buttonArea}>
                <button className={styles.searchButton} onClick={() => startLoading(5000)}>
                    <Search size={18} style={{ marginRight: '8px' }} />
                    検索
                </button>
            </div>
        </div>
    );
};

export default SearchFilter;
