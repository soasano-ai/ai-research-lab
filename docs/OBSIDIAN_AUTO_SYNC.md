# Windows: Obsidian教材の自動取り込み

## 結論
WindowsのObsidian Vaultに、GitHubで公開した教材Markdownを片方向に同期できます。**個人ノートの自動共有・端末間同期は含みません。**

## 初期設定
1. Windows PCでGitをインストール。
2. 信頼できる作業場所で `git clone https://github.com/soasano-ai/ai-research-lab.git` を実行。
3. ObsidianのVaultフォルダのパスを確認。
4. クローンしたフォルダに移動しPowerShellで実行：

```powershell
powershell -NoProfile -File .\scripts\sync-obsidian.ps1 -VaultPath "C:\Users\YOUR_USER\Desktop\Obsidian"
```

GitHubの `obsidian/` 以下のMarkdownがVaultの `AI_Research_Lab/00_GitHub_Materials/` にコピーされます。

## 自動化
最初に上記を手動で実行し、成功を確認します。その後Windowsのタスクスケジューラで同じコマンドをログオン時または1日1回起動するよう登録します。PCがオフの間は同期しません。

## 注意
- GitHub側の同名教材ファイルで同期先を上書きします。個人メモはこのフォルダに書かないでください。
- Git更新が失敗した場合、同期を中断します。
- `git push` は実行しません。社内・顧客情報や非公開研究ノートはPublic GitHubに保存しないでください。
- スマホのObsidianまで自動でノートを同期するには、Obsidian Sync等の別サービスが必要です。
