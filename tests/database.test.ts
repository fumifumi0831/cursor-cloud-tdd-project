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
