# React Focus Loading PoC

このプロジェクトは、ローディング表示とフォーカス管理の疎結合性を実証するProof of Concept (PoC) アプリケーションです。

## 実行方法

Node.js環境が必要です。

1. 依存関係のインストール
```bash
npm install
```

2. 開発サーバーの起動
```bash
npm run dev
```

3. ブラウザで確認
表示されたURL (通常 `http://localhost:5173`) にアクセスしてください。

## 機能確認手順

### 1. 検索フィールドのフォーカス制御
- 画面上部の6つの検索入力欄のいずれかをクリック（フォーカス）します。
- **期待値**: 
  - 即座にローディングオーバーレイ（歯車アイコン）が表示されます（3秒間）。
  - ローディング終了後、**フォーカスがクリックした入力欄に自動的に戻ります**。
  - テキスト入力が可能になります。

### 2. コマンドボタンのブロック制御
- 画面下部の「登録」ボタンなどをクリックします。
- **期待値**:
  - ローディングオーバーレイが表示されます（5秒間）。
  - その間、他の要素はクリックできません。
  - 終了後、フォーカスが押したボタンに戻ります。

## 技術ポイント
- `src/context/LoadingContext.jsx`: フォーカス管理の中核ロジック。`useRef` を使用してトリガー要素を追跡および復元します。
- `src/components/Features/SearchFilter.jsx`: `onFocus` イベントでの無限ループ防止ロジック（デバウンス処理）を実装しています。

## ドキュメント
詳細な設計や検証手順については `docs/` ディレクトリを参照してください。
- [Task Checklist](docs/task.md)
- [Implementation Plan](docs/implementation_plan.md)
- [Walkthrough](docs/walkthrough.md)
