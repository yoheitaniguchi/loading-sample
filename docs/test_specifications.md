# テスト仕様書

現在のソースコードに含まれるテストコード (`src/**/*.test.jsx`) から解析したテスト仕様を以下にまとめます。

## 対象コンポーネント: SearchFilter
**ファイルパス**: `src/components/Features/SearchFilter.test.jsx`

### テストスイート: SearchFilter Focus Logic
検索フィルターの入力項目におけるフォーカス制御とローディング動作を検証します。

| No. | テストケース名 | 前提条件 | 操作・手順 | 期待される結果 | 備考 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Item 1: Restores focus to itself after loading** | `LoadingProvider` 内で `SearchFilter` がレンダリングされていること。 | 1. 「条件 1 を入力」フィールド (Item 1) にフォーカスする。<br>2. ローディング完了まで待機する (3秒)。 | ・ローディング完了後、フォーカスが再度「条件 1 を入力」フィールドに戻っていること。 | 通常のフォーカス復帰動作の検証 |
| 2 | **Item 6: Shows alert and moves focus to Item 5 after loading** | `LoadingProvider` 内で `SearchFilter` がレンダリングされていること。 | 1. 「条件 6 を入力」フィールド (Item 6) にフォーカスする。<br>2. ローディング完了まで待機する (3秒)。<br>3. さらに追加処理の待機時間 (100ms程度) を経過させる。 | ・`window.alert` が呼び出され、メッセージ "エラーが発生しました" が表示されること。<br>・フォーカスが「条件 5 を入力」フィールド (Item 5) に移動していること。 | エラー発生時の例外的なフォーカス移動の検証 |

---

## 対象コンポーネント: AppLayout
**ファイルパス**: `src/components/Layout/AppLayout.test.jsx`

### テストスイート: AppLayout Sidebar Logic
アプリケーションレイアウトのサイドバー開閉動作を検証します。
※ 子コンポーネント (`SearchFilter`, `ProductList`, `CommandBar`) はモック化されています。

| No. | テストケース名 | 前提条件 | 操作・手順 | 期待される結果 | 備考 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Sidebar toggles visibility when burger menu is clicked** | `AppLayout` がレンダリングされていること。 | 1. 初期状態を確認する。<br>2. ハンバーガーメニューボタン (aria-label="メニュー切り替え") をクリックする。<br>3. 再度ボタンをクリックする。 | ・初期状態ではサイドバーが表示 (Open) クラスを持っていること。<br>・1回目のクリック後、サイドバーのクラスが変化しまていること (Closed)。<br>・2回目のクリック後、サイドバーのクラスが初期状態に戻ること (Open)。 | サイドバーのトグル機能の検証 |
