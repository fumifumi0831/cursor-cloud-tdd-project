# Cloud Agent初回実行テストガイド

## 📋 準備完了

✅ テストファイル作成済み: `tests/user-service.test.ts`
✅ GitHubリポジトリ作成済み: https://github.com/fumifumi0831/cursor-cloud-tdd-project
✅ コミット・プッシュ完了

## 🚀 Cloud Agent実行手順

### ステップ1: テストファイルを開く

Cursorで `tests/user-service.test.ts` を開いてください。

### ステップ2: Cloud Agentを起動

1. **Ctrl+E** (Mac: **Cmd+E**) を押す
   - または、Cursorのチャットパネルを開く

2. **プロンプトを入力**:
   ```
   このテストファイル(tests/user-service.test.ts)が100%通るように
   src/user-service.tsを実装してください。
   
   要件：
   - TypeScriptで実装
   - emailバリデーションを含む（正規表現でチェック）
   - ユーザーIDは自動生成（UUIDまたは連番）
   - テストが通るまで繰り返し修正してください
   ```

3. **"Run in Cloud" を選択**
   - チャットパネルに「Run in Cloud」ボタンが表示されます

4. **設定を選択**:
   - **Repository**: `cursor-cloud-tdd-project` を選択
   - **Branch**: `main` を選択
   - **Parallel Agents**: `3` を選択（推奨）
   - **"Start Agent"** をクリック

### ステップ3: 進捗確認

1. **Background Agents Sidebarを開く**
   - Cursor左下のクラウドアイコンをクリック
   - または、`Cmd+Shift+B` (Mac) / `Ctrl+Shift+B` (Windows)

2. **実行中のAgentを確認**
   ```
   Agent #1: RUNNING...
   Agent #2: RUNNING...
   Agent #3: RUNNING...
   ```

3. **完了を待つ（1-3分程度）**
   - 各Agentが並列で実装を試みます
   - テストが通ったAgentが成功として表示されます

4. **結果を確認**
   ```
   Agent #2: FINISHED ✅ (Tests: 2/2 passed)
   ```
   - 成功したAgentの「View Branch」をクリック
   - 実装されたコードをレビュー
   - テストが通っていることを確認

### ステップ4: マージまたはPR作成

成功したAgentのブランチを確認し、必要に応じて：
- 直接マージ
- PRを作成してレビュー後にマージ

## 📝 期待される実装

Cloud Agentが実装すべき `src/user-service.ts`:

```typescript
// 期待される実装例（参考）
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
}

export async function createUser(input: CreateUserInput): Promise<User> {
  // emailバリデーション
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email)) {
    throw new Error('Invalid email format');
  }

  // ユーザー作成（IDは自動生成）
  const user: User = {
    id: Math.random().toString(36).substring(7), // またはUUID
    name: input.name,
    email: input.email,
  };

  return user;
}
```

## ⚠️ トラブルシューティング

### Cloud Agentが起動しない

1. **Privacy Mode確認**
   - Settings → Privacy → Privacy Mode: OFF
   - ✅ Allow Cursor to use my code for background agents

2. **GitHub連携確認**
   - Settings → Background Agents → GitHub連携が有効か確認
   - リポジトリアクセス権限を確認

3. **Cursor Pro確認**
   - Account → Proプランに加入しているか確認

### テストが通らない

1. **ローカルでテスト実行**
   ```bash
   npm test
   ```
   - ローカルでテストが通るか確認

2. **environment.json確認**
   - `.cursor/environment.json`の設定を確認
   - Secret名が正しいか確認

3. **Agentログ確認**
   - Background Agents Sidebarで各Agentのログを確認
   - エラーメッセージを確認

## 🎯 成功の確認

Cloud Agentが成功した場合：
- ✅ テストが2つとも通る
- ✅ `src/user-service.ts`が作成される
- ✅ emailバリデーションが実装されている
- ✅ ユーザーIDが自動生成される

## 📚 次のステップ

初回テストが成功したら：
1. より複雑な機能でテスト
2. データベース連携のテスト
3. 並列数を増やして効率化
4. Plan Modeとの組み合わせ
