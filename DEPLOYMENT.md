# URL公開手順：GitHub Pages（無料MVP）

## 現状
この配布物には`site/index.html`がある。スマホとPCで共通URLになる静的サイト。実際の公開URLは未発行。

## GitHub Pagesを使う理由
サーバーやDockerなしで静的HTMLをHTTPS公開できる。公開リポジトリの場合はソースファイルも他者から見られるため秘密情報は入れない。GitHubプランやリポジトリ公開設定による制約は公式情報を確認する。

## 手順A：GitHubブラウザから公開（初心者向け）
1. **個人アカウント**で新しいGitHubリポジトリを作る（例：`ai-research-lab`）。会社のリポジトリは使わない。
2. `site/index.html`をリポジトリのルート直下の`index.html`としてアップロードする。`site/404.html`も任意でアップロード。
3. リポジトリの **Settings → Pages** を開く。
4. **Build and deployment** で **Deploy from a branch** を選択。
5. Branchを`main`、Folderを`/(root)`に指定して保存。
6. Pages画面に表示されるURLを開き、スマホとPCで実機確認。
7. URL形式の例は `https://<GitHubユーザー名>.github.io/ai-research-lab/`。これは例示であり、実際のURLはGitHubの表示で確認。

## 手順B：VS Code + Claude Code（作業用）
- `site/index.html`をローカルで開くか、Live Serverなどのローカルプレビューを使う。
- レビューが済んでから公開用のファイルだけをGitHubに送る。
- commit / push / PR / Pages有効化はユーザーの明示許可があるまで行わない。

## スマホ確認チェック
- iPhone Safari / Android Chromeでタブ・ボタン・テストを操作できる
- 横スクロールしない
- 文字と入力欄が小さすぎない
- ページを更新して進捗が残る
- PCとスマホの進捗は同期しないことをユーザーに説明している
- ブラウザデータ削除時に進捗が消えることを明記し、バックアップを促す

## 公開の注意
- 公開したHTMLに社内データ、秘密鍵、メールアドレスなどを含めない
- 公開URLは知っている人がアクセスできる。秘密の限定公開には認証が必要
- サイト更新時に学習者のlocalStorage互換を保つ
- GitHub Pages以外にCloudflare Pages/Vercel等もあるが、最初は1つに絞る
