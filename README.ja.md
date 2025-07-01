# Udon Exposed Diff Viewer

これは、[UdonExposed](https://github.com/Merlin-san/UdonExposed) の異なるバージョン間の差分を表示するためのWebアプリケーションです。ユーザーは2つのバージョンを選択し、ファイル間の差分を分かりやすく色分けされた形式で確認できます。

## 主な機能

- **バージョン比較**: UdonExposedの任意の2つのバージョンを選択して差分を表示します。
- **サイドバイサイド差分表示**: 変更点をクリーンな横並び形式で表示します。
- **シンタックスハイライト**: (将来的に実装予定) コードをハイライト表示し、可読性を向上させます。
- **レスポンシブデザイン**: デスクトップとモバイルの両方で動作します。

## 技術スタック

- **フレームワーク**: React (Viteを使用)
- **UI**: Bootstrap
- **差分ライブラリ**: `diff`

## セットアップ方法

### 前提条件

- Node.js (v18以降)
- [UdonExposed](https://github.com/Merlin-san/UdonExposed) リポジトリのローカルクローン

### インストール

1.  **このリポジトリをクローンします:**

    ```sh
    git clone https://github.com/your-username/udon-exposed-diff-viewer.git
    cd udon-exposed-diff-viewer/viewer
    ```

2.  **`UdonExposed` リポジトリを親ディレクトリにクローンします:**

    データ生成スクリプトは、`UdonExposed` リポジトリがプロジェクトルートから見て `../UdonExposed` に存在することを想定しています。

    ```sh
    git clone https://github.com/Merlin-san/UdonExposed.git ../UdonExposed
    ```

3.  **依存関係をインストールします:**

    ```sh
    npm install
    ```

4.  **差分データを生成し、プロジェクトをビルドします:**

    このコマンドは `prepare-data.js` スクリプトを実行して必要な差分ファイルを生成し、その後Reactアプリケーションをビルドします。

    ```sh
    npm run build
    ```

5.  **アプリケーションをプレビューします:**

    ```sh
    npm run preview
    ```

    Viteから提供されたURLでアプリケーションにアクセスできます。

### 開発

ホットリロード機能を備えた開発モードでアプリケーションを実行するには：

```sh
npm run dev
```

## 利用可能なスクリプト

-   `npm run dev`: 開発サーバーを起動します。
-   `npm run build`: 差分データを生成し、本番用にアプリケーションをビルドします。
-   `npm run lint`: ESLintを使用してコードをチェックします。
-   `npm run preview`: 本番ビルドをローカルでプレビューします。

## 仕組み

このプロジェクトの中核は `scripts/prepare-data.js` スクリプトです。ビルドプロセス中に、このスクリプトは以下の処理を行います：

1.  `UdonExposed` リポジトリ内の異なるバージョンのディレクトリからすべてのファイルを読み込みます。
2.  各バージョンペア間の差分を計算します。
3.  これらの差分をJSONファイルとして `public/diffs` ディレクトリに保存します。
4.  利用可能なすべてのバージョンをリストした `versions.json` ファイルを作成します。

Reactアプリケーションは、これらのJSONファイルを取得してユーザーに差分を表示します。

## 作者

[@ikuko](https://x.com/magi_ikuko)
