/**
 * Technical Explanation: Decoupled Focus Management
 * 
 * このコンテキストは、ローディング表示（UI）とフォーカス復帰制御（Logic）の責務を
 * 呼び出し元（Component）から分離するために設計されています。
 * 
 * ## 仕組み
 * 1. **Capture**: `startLoading` 呼び出し時、`document.activeElement` を即座に `ref` に保存します。
 *    これはReactのState更新(非同期)等の影響を受ける前の「ユーザーが操作した瞬間の要素」を確実に捉えるためです。
 * 
 * 2. **State Isolation**: ローディング状態 (`isLoading`) はこのコンテキスト内でのみ管理され、
 *    各コンポーネントは `startLoading` を呼ぶだけで、その後のフォーカス管理を意識する必要がありません。
 * 
 * 3. **Restoration**: ローディング終了時 (`useEffect` on `isLoading` change to false)、
 *    保存された要素が存在すれば `focus()` メソッドを呼び出します。
 *    これにより、呼び出し元コンポーネントにフォーカス管理コードを散乱させることなく、
 *    アプリケーション全体で一貫した「元の場所に戻る」挙動を保証します。
 */
import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const triggerElementRef = useRef(null);

    /**
     * ローディングを開始し、指定時間後に完了させる
     * @param {number} duration - ローディング表示時間(ms)
     */
    const startLoading = useCallback((duration = 1000) => {
        // 1. ローディング開始時のフォーカス要素を記録
        triggerElementRef.current = document.activeElement;

        // 2. ローディング状態をON (オーバーレイ表示)
        setIsLoading(true);

        // 3. 指定時間待機
        setTimeout(() => {
            setIsLoading(false);
        }, duration);
    }, []);

    // 4. ローディング終了後の処理をuseEffectで監視
    useEffect(() => {
        if (!isLoading && triggerElementRef.current) {
            // ローディングが完了した直後、元の要素にフォーカスを戻す
            // ※ requestAnimationFrameやsetTimeout(0)を使用すると、Reactのレンダリングサイクル後により確実に動作する場合がある
            const el = triggerElementRef.current;

            // 要素がまだDOMに存在するか確認してからフォーカス
            if (document.body.contains(el)) {
                console.log("Restoring focus to:", el);
                el.focus();
            } else {
                console.warn("Trigger element no longer exists in DOM");
            }

            // 参照をクリア
            triggerElementRef.current = null;
        }
    }, [isLoading]);

    return (
        <LoadingContext.Provider value={{ isLoading, startLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
}
