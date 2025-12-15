# Cursor Cloud Agent TDD環境：完全セットアップガイド（30分版）

所要時間：約30分
コスト：$20/月（Cursor Pro）+ 無料サービス

## ステップ1: Cursor Proの契約（5分）

```
1. https://cursor.com をアクセス
2. "Download" → Cursorをインストール
3. アカウント作成（GitHubアカウントでサインイン推奨）
4. Settings → Account → Upgrade to Pro
5. クレジットカード情報を入力（$20/月）
```

## ステップ2: GitHubリポジトリ準備（5分）

```bash
# 新規プロジェクト作成
mkdir my-tdd-project
cd my-tdd-project

# Git初期化
git init
git branch -M main

# .gitignore作成
cat > .gitignore << 'EOF'
node_modules/
.env
.env.local
dist/
build/
.DS_Store
EOF

# package.json作成
npm init -y

# 基本パッケージインストール
npm install --save-dev \
  jest \
  @types/jest \
  typescript \
  @types/node \
  ts-node

# GitHubリポジトリ作成（GitHub CLIを使用）
gh repo create my-tdd-project --public --source=. --push

# または手動で：
# 1. https://github.com/new でリポジトリ作成
# 2. git remote add origin https://github.com/YOUR_USERNAME/my-tdd-project.git
# 3. git add .
# 4. git commit -m "Initial commit"
# 5. git push -u origin main
```

## ステップ3: Supabase準備（5分）

```
1. https://supabase.com にアクセス
2. GitHubでサインイン
3. "New Project" をクリック
4. 以下を入力：
   - Organization: 新規作成または既存を選択
   - Name: my-tdd-project-dev
   - Database Password: 強力なパスワード（メモ必須！）
   - Region: Northeast Asia (Tokyo)
5. "Create new project"をクリック（約2分待つ）

6. 接続文字列を取得：
   Project Settings → Database → Connection string → URI
   例：postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres

7. この文字列をコピーして保存
```

## ステップ4: Cursor設定（10分）

### 4-1. Privacy設定

```
Cursor → Settings (Cmd+,)
  → Privacy
    → Privacy Mode: OFF
    → Data Retention: Limited
    → ✅ Allow Cursor to use my code for background agents
```

### 4-2. GitHub連携

```
Settings → Background Agents
  → Connect GitHub
  → Authorize Cursor
  → リポジトリアクセスを許可（All repositoriesを推奨）
```

### 4-3. Secrets設定

```
1. https://cursor.com/dashboard にアクセス
2. Settings → Background Agents → Secrets
3. "Add Secret"をクリック
4. 以下を追加：
   Name: DATABASE_URL
   Value: postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
5. "Save"
```

### 4-4. environment.json作成

プロジェクトルートで：

```bash
mkdir -p .cursor
```

`.cursor/environment.json`を作成：

```json
{
  "snapshot": "",
  "install": "npm ci",
  "start": "",
  "terminals": [
    {
      "name": "test",
      "command": "npm test -- --watch=false",
      "ports": []
    }
  ],
  "env": {
    "NODE_ENV": "test",
    "DATABASE_URL": "${CURSOR_SECRET_DATABASE_URL}"
  }
}
```

## ステップ5: テストプロジェクト作成（5分）

### 5-1. package.json設定

```json
{
  "name": "my-tdd-project",
  "version": "1.0.0",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "dev": "ts-node src/index.ts"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^20.0.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.3.0"
  },
  "dependencies": {
    "pg": "^8.11.0"
  }
}
```

### 5-2. Jest設定

`jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
```

### 5-3. TypeScript設定

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 5-4. サンプルテスト作成

`tests/sample.test.ts`:

```typescript
describe('Sample Test Suite', () => {
  test('should pass basic assertion', () => {
    expect(1 + 1).toBe(2);
  });

  test('should handle async operations', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  });
});
```

### 5-5. データベース接続テスト

`tests/database.test.ts`:

```typescript
import { Client } from 'pg';

describe('Database Connection', () => {
  let client: Client;

  beforeAll(async () => {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  test('should connect to database', async () => {
    const result = await client.query('SELECT NOW()');
    expect(result.rows).toHaveLength(1);
  });

  test('should create and query a test table', async () => {
    // テーブル作成
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100)
      )
    `);

    // データ挿入
    await client.query(
      'INSERT INTO test_users (name, email) VALUES ($1, $2)',
      ['Test User', 'test@example.com']
    );

    // データ取得
    const result = await client.query('SELECT * FROM test_users');
    expect(result.rows.length).toBeGreaterThan(0);

    // クリーンアップ
    await client.query('DROP TABLE test_users');
  });
});
```

### 5-6. 動作確認

```bash
# パッケージインストール
npm install

# ローカルでテスト実行（DB接続確認）
DATABASE_URL="your-supabase-connection-string" npm test

# 期待される出力：
# PASS  tests/sample.test.ts
# PASS  tests/database.test.ts
# 
# Test Suites: 2 passed, 2 total
# Tests:       4 passed, 4 total
```

### 5-7. Gitにコミット

```bash
git add .
git commit -m "Setup TDD environment with Cursor Cloud Agent support"
git push origin main
```

## ステップ6: Cloud Agent初回実行テスト（5分）

### 実際のテストファイル作成

`tests/user-service.test.ts`:

```typescript
describe('User Service', () => {
  test('should create a user with valid data', async () => {
    const createUser = (await import('../src/user-service')).createUser;
    
    const user = await createUser({
      name: 'John Doe',
      email: 'john@example.com',
    });
    
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
  });

  test('should reject invalid email', async () => {
    const createUser = (await import('../src/user-service')).createUser;
    
    await expect(
      createUser({ name: 'John', email: 'invalid-email' })
    ).rejects.toThrow('Invalid email format');
  });
});
```

### Cloud Agent起動

```
1. Cursorで tests/user-service.test.ts を開く

2. Ctrl+E (または Cmd+E) を押す

3. プロンプトを入力：
   「このテストファイル(tests/user-service.test.ts)が100%通るように
   src/user-service.tsを実装してください。
   
   要件：
   - TypeScriptで実装
   - emailバリデーションを含む
   - テストが通るまで繰り返し修正してください」

4. "Run in Cloud" を選択

5. Repository: my-tdd-project を選択

6. Branch: main を選択

7. Parallel Agents: 3 を選択

8. "Start Agent" をクリック
```

### 進捗確認

```
1. Cursor → Background Agents Sidebar（左下のクラウドアイコン）

2. 実行中のAgentが表示される：
   Agent #1: RUNNING...
   Agent #2: RUNNING...
   Agent #3: RUNNING...

3. 1-2分後、成功したAgentが表示される：
   Agent #2: FINISHED ✅ (Tests: 2/2 passed)

4. Agent #2の結果を確認
   → "View Branch" をクリック
   → コードをレビュー
   → テストが通っていることを確認

5. PRを作成またはマージ
```

## セットアップ完了！

これで以下が可能になります：

✅ ローカルでテストを書く
✅ Cloud Agentに並列実装を依頼
✅ PC閉じても実行継続
✅ スマホから進捗確認
✅ テスト通過したコードだけレビュー
✅ 効率的なマージ作業

## 次のステップ

1. より複雑な機能でテスト
2. 並列数を増やして効率化
3. Plan Modeとの組み合わせ
4. 複数機能の同時開発

## トラブルシューティング

### Cloud Agentが起動しない

```
1. Privacy Modeがオフになっているか確認
2. GitHubリポジトリへのアクセス権限を再確認
3. Cursor Proプランに加入しているか確認
```

### データベース接続エラー

```
1. Supabaseプロジェクトが起動しているか確認
2. 接続文字列のパスワードが正しいか確認
3. Cursor Secretsに正しく設定されているか確認
```

### テストが通らない

```
1. ローカルで npm test が動くか確認
2. environment.json の設定を確認
3. Cloud Agent のログを確認
```
