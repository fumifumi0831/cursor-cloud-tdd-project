# Cursor Cloud TDD環境セットアップ - 進捗状況

## ✅ 完了済み

1. **Cursor Pro契約** ✅
2. **Supabase接続** ✅
   - 接続確認済み（test-db.jsで確認）
3. **Secret設定** ✅
   - Cursor Dashboardで`DATABASE_URL`を設定済み
4. **environment.json作成** ✅
   - `.cursor/environment.json`を作成
   - Secret参照設定済み（`${CURSOR_SECRET_DATABASE_URL}`）
5. **テストプロジェクト基本設定** ✅
   - `package.json`にテスト関連依存関係追加
   - `jest.config.js`作成
   - `tsconfig.json`作成
   - サンプルテストファイル作成
   - データベース接続テスト作成
   - 依存関係インストール完了

## ⏳ 次のステップ

### 1. GitHubリポジトリ準備（必須）

```bash
# プロジェクトディレクトリで実行
cd /Users/fumipen/Documents/progress/cursor_cloud_test

# Git初期化（まだの場合）
git init
git branch -M main

# 初回コミット
git add .
git commit -m "Setup TDD environment with Cursor Cloud Agent support"

# GitHubリポジトリ作成（GitHub CLIを使用する場合）
gh repo create cursor-cloud-tdd-project --public --source=. --push

# または手動で：
# 1. https://github.com/new でリポジトリ作成
# 2. git remote add origin https://github.com/YOUR_USERNAME/cursor-cloud-tdd-project.git
# 3. git push -u origin main
```

### 2. Privacy設定とGitHub連携（必須）

#### Privacy設定
```
Cursor → Settings (Cmd+,)
  → Privacy
    → Privacy Mode: OFF
    → Data Retention: Limited
    → ✅ Allow Cursor to use my code for background agents
```

#### GitHub連携
```
Settings → Background Agents
  → Connect GitHub
  → Authorize Cursor
  → リポジトリアクセスを許可（All repositoriesを推奨）
```

### 3. ローカルテスト実行確認（推奨）

```bash
# Supabase接続文字列を環境変数に設定してテスト実行
DATABASE_URL="postgresql://postgres:CdZ5jGp5PPddnPM9@db.aynlamkvjpidwhgnzpmr.supabase.co:5432/postgres" npm test

# 期待される出力：
# PASS  tests/sample.test.ts
# PASS  tests/database.test.ts
# 
# Test Suites: 2 passed, 2 total
# Tests:       4 passed, 4 total
```

### 4. Cloud Agent初回実行テスト

1. Cursorで `tests/user-service.test.ts` を作成（または既存のテストファイルを開く）
2. Ctrl+E (または Cmd+E) を押す
3. プロンプトを入力：
   ```
   このテストファイル(tests/user-service.test.ts)が100%通るように
   src/user-service.tsを実装してください。
   
   要件：
   - TypeScriptで実装
   - emailバリデーションを含む
   - テストが通るまで繰り返し修正してください
   ```
4. "Run in Cloud" を選択
5. Repository: cursor-cloud-tdd-project を選択
6. Branch: main を選択
7. Parallel Agents: 3 を選択
8. "Start Agent" をクリック

## 📋 チェックリスト

- [x] Cursor Pro契約
- [x] Supabase接続
- [x] Secret設定
- [x] environment.json作成
- [x] テストプロジェクト基本設定
- [ ] GitHubリポジトリ作成
- [ ] Privacy設定確認
- [ ] GitHub連携
- [ ] ローカルテスト実行確認
- [ ] Cloud Agent初回実行テスト

## 🔍 確認事項

### Secret設定の確認
Cursor Dashboardで以下を確認：
- Secret名: `DATABASE_URL`
- 値: Supabase接続文字列（`postgresql://...`）

### environment.jsonの確認
`.cursor/environment.json`で以下を確認：
- `DATABASE_URL: "${CURSOR_SECRET_DATABASE_URL}"` が設定されているか
- Secret名が正しいか（`DATABASE_URL`）

## 📝 注意事項

1. **GitHubリポジトリは必須**: Cloud AgentはGitHubリポジトリが必要です
2. **Privacy Mode**: OFFにしないとCloud Agentが動作しません
3. **GitHub連携**: リポジトリアクセス権限が必要です
4. **Secret名**: environment.jsonのSecret名とCursor DashboardのSecret名が一致している必要があります
