# ゼロからAI研究ラボ

AIの完全初心者が「分かる→試す→測る→研究する」を学ぶ、日本語の学習Webアプリ（MVP）。

## まず使う
`site/index.html`をダブルクリックしてブラウザで開く。スマホからURLで使うには`docs/DEPLOYMENT.md`に従ってGitHub Pagesへ公開する。**公開URLはまだ発行されていません。**

## 収録
- `site/index.html`：20ステップ、確認テスト、研究ワーク、ノート、進捗・バックアップ
- `PROJECT_INSTRUCTIONS.md`：ChatGPTプロジェクト用の全体指示
- `CHATGPT.md`：ChatGPTの教育・研究メンター指示
- `CLAUDE.md`：Claude Codeの実装指示
- `AGENTS.md`：Codexの品質レビュー指示
- `docs/PRODUCT_REQUIREMENTS.md`：要件定義
- `docs/CURRICULUM.md`：学習カリキュラム
- `docs/MOBILE_UI.md`：スマホ設計
- `docs/DEPLOYMENT.md`：GitHub Pages公開手順

## 推奨の進め方
1. ChatGPTの新しいプロジェクトへ本フォルダのMDを投入し、`PROJECT_INSTRUCTIONS.md`をプロジェクトの指示として設定。
2. VS Codeでこのフォルダを開き、Claude Codeには`CLAUDE.md`を読み込ませる。
3. Codexには`AGENTS.md`を読み込ませて独立レビューを依頼。
4. ローカル確認と公開許可を経てGitHub Pagesにデプロイする。

## 注意
X・note運用はこの開発プロジェクトでは扱わない。データは端末内のlocalStorageに保存され、スマホ/PCで自動同期しない。バックアップを活用すること。
