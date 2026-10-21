# AI Research Lab v3.5 AIチャット設定

## 実装
- 全8ページの右下から開く共通チャットUI（`ai-chat.js`）
- GPT／Claude切り替え、初心者／英語／研究／通常モード
- チャットの履歴は同じブラウザタブの sessionStorage に最大30件保持（異なる端末やブラウザには同期しない）
- AIによる会話の要約と、会話ログの Markdown ダウンロード
- Node.js 20以降で動く API中継サーバー（`server/index.cjs`）
- APIキーはサーバー環境変数に保持し、GitHub Pagesからは送信しない

## Railwayデプロイ
1. Railwayに新しいサービスを作成し、同じリポジトリを接続
2. Root Directoryを `/server` に設定
3. Start Commandを `npm start` に設定（package.jsonに含まれる）
4. Variablesに `LAB_ACCESS_TOKEN`（推測困難な長いランダム文字列）、`OPENAI_API_KEY` または `ANTHROPIC_API_KEY`、`ALLOWED_ORIGIN=https://soasano-ai.github.io` を設定
5. 利用する最新の対応モデル名を `OPENAI_MODEL` と `ANTHROPIC_MODEL` で指定する。初期値が廃止された場合は更新する
6. RailwayのPublic NetworkingでHTTPS URLを有効化し、`/health` にアクセスして `{"ok":true}` を確認
7. ラボ右下「AIに質問」を開き、APIサーバーURLと `LAB_ACCESS_TOKEN` と同じ接続用トークンを入力

## セキュリティ・運用上の制限
- APIサーバーはユーザー認証基盤ではない。共有の `LAB_ACCESS_TOKEN` を持つ人はAPI費用を発生させられる。一般公開利用にはユーザーごとの認証、利用量管理、予算上限、監査ログなどが別途必要
- 1分間12リクエスト/IP（プロセスメモリに保持）。複数インスタンス・再起動環境では正確な上限にならない
- プロバイダーへの出力は最大700トークン、リクエストは45秒以内のブラウザタイムアウト。サーバーの呼び出しは30秒
- ラボの会話内容は選択したAIプロバイダーへ送信される。会社の秘密、顧客情報、個人情報を入力しない
- 接続用トークンはタブ内の sessionStorage にのみ保存。共有PCではタブを閉じ、必要に応じてブラウザのサイトデータを消去する
- Obsidianへの保存はMarkdownの手動取り込み。OS内のVaultへ直接自動書き込みする機能、端末間同期、音声会話は未実装
- サーバー料金およびOpenAI/AnthropicのAPI料金がかかる。無料運用や既存ChatGPT/Claude契約からのAPI利用は保証されない
- `/health` はプロセス生存確認のみ。AIキーの有効性や請求設定まで検証するものではない

## マージ前の確認
- 8ページで右下のボタンを押して開閉できる
- ページ遷移時に同じタブの会話が維持される
- 未設定時に適切なエラーを表示する
- APIの認証なしのリクエストは401、許可しないOriginは403、入力不正は400を返す
- OpenAIとAnthropicの双方で単発会話と連続会話、要約を実地検証する
- MarkdownをObsidianに取り込んで日本語・改行を確認する
- 画面サイズ320px以上で重なりや横スクロールを確認する

## 次段階
- 完全自動のObsidian保存には、ローカル連携エージェントまたは認証付きのプライベート同期基盤が必要
- 英語ページの自由英文解析と意味の頻度順位は今回の変更に含めていない
