# React PoC: フォーカス制御付きローディング実装計画

この実装計画は、仕様策定におけるデッドロックを解消するため、ローディング表示ロジックとフォーカス管理を明確に分離したReactアプリケーションの作成手順を示します。

## ユーザー確認事項
> [!IMPORTANT]
> フォーカス復帰ロジックは、ローディング開始時点の `document.activeElement` に依存します。ローディングオーバーレイが表示された際にフォーカスが移動する場合（アクセシビリティ対応などでオーバーレイ自体にフォーカスする場合など）、復帰ロジック側でそれを考慮する必要があります。今回は `useRef` を使用して、状態変更前の要素を保持する設計とします。

## 変更内容

### プロジェクトセットアップ
- `/home/yopeyt2/workspace/loading-sample` に Vite React プロジェクトを作成
- `lucide-react` アイコンライブラリのインストール

### コアロジック (PoCの核)
#### [NEW] src/context/LoadingContext.jsx
- `LoadingProvider` と `useLoading` フックを実装。
- **State**: `isLoading` (boolean).
- **Ref**: `triggerElementRef` - アクションを開始した要素を保持。
- **Actions**: `startLoading(duration)`
  1. 現在の `document.activeElement` を `triggerElementRef` に保存。
  2. `isLoading` を `true` に設定。
  3. `setTimeout` で `duration` 待機。
  4. `isLoading` を `false` に設定。
  5. `useEffect` (またはタイマー完了時のコールバック) で `triggerElementRef.current` にフォーカスを戻す。

### UIコンポーネント
#### [NEW] src/components/Layout/AppLayout.jsx
- 要件に基づくグリッドレイアウト: サイドバー(左), 検索(上), 一覧(中), アクション(下).

#### [NEW] src/components/UI/LoadingOverlay.jsx
- 表示専用コンポーネント。
- `isLoading` が true の時のみレンダリング (Context または親から制御)。
- CSS/SVGアニメーションで「2つの歯車」を表示。

#### [NEW] src/components/Features/SearchFilter.jsx
- 要件通り6つの入力フィールドを配置。
- `onFocus` イベントで `startLoading(3000)` をトリガー。

#### [NEW] src/components/Features/ProductList.jsx
- モックデータをテーブル表示 (チェックボックス付き)。

#### [NEW] src/components/Features/CommandBar.jsx
- アクションボタン群 (「検索」「一括登録」「登録」「閉じる」)。
- クリックで `startLoading(5000)` をトリガー。
- 「登録」ボタンは特定データの更新日を更新。

### スタイリング
- CSS Modules を使用し、コンポーネント単位でモジュール化。
- グローバルスタイルでリセットと変数定義 (色, フォント)。

### Automated Testing Setup
#### [NEW] Test Configuration
- Install `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`.
- Configure `vite.config.js` for testing.
- Create `src/test/setup.js` for global test setup.

#### [NEW] src/components/Features/SearchFilter.test.jsx
- Verify focus flow:
  - Focus on Item 1 -> Loading -> Focus back to Item 1.
  - Focus on Item 6 -> Loading -> Alert -> Focus to Item 5.

#### [NEW] src/components/Layout/AppLayout.test.jsx
- Verify Sidebar toggle:
  - Initial state: Visible.
  - Click Burger Menu -> Hidden.

## 検証計画

### 自動テスト
- 今回のPoCでは計画していません (目視確認重視)。

### 手動検証
#### [MOD] src/context/LoadingContext.jsx
- `startLoading(duration, restoreFocus = true)` に変更。
- `restoreFocus` が false の場合、自動フォーカス復帰をスキップする機能を追加。

#### [MOD] src/components/Features/SearchFilter.jsx
- 項目5（インデックス4）への参照 (`useRef`) を追加。
- 項目6（インデックス5）の `onFocus` ハンドラを修正:
  1. `startLoading(3000, false)` を呼び出し（自動復帰無効）。
  2. `setTimeout` で3000ms待機。
  3. `alert("エラーが発生しました")` を表示。
  4. 項目5へ `focus()` を移動。
  - 項目5の `onFocus` は既存のデバウンス (`lastFocusTime`) により、即座の再ローディングは回避される見込み。

#### [MOD] src/components/Layout/AppLayout.module.css
- サイドバーの開閉スタイルをデスクトップ版にも適用。
- `.sidebar` に `width` トランジションまたは `margin-left` ロジックを追加して、「隠れる」挙動を実装。

### 検証計画
1. **項目6のエラーフロー**:
   - 項目6をフォーカス -> ローディング(3秒) -> エラーアラート -> 項目5へフォーカス移動（ローディングなし）。
2. **サイドバー開閉**:
   - 画面幅に関わらず、バーガーメニューでサイドバーが隠れることを確認。

2. **操作ブロックテスト**:
   - 「登録」ボタンをクリック。
   - ローディングオーバーレイが5秒間表示されることを確認。
   - 背景がクリックできないことを確認。
   - 5秒後に「登録」ボタンにフォーカスが戻ることを確認。
