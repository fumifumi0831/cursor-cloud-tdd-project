import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/dbname';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

interface CreateUserInput {
  name: string;
  email: string;
}

/**
 * メールアドレスの形式を検証する
 * @param email 検証するメールアドレス
 * @returns 有効なメールアドレスの場合true
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * ユーザーを作成する
 * @param input ユーザー情報（name, email）
 * @returns 作成されたユーザーオブジェクト
 * @throws 無効なメールアドレスの場合 'Invalid email format'
 */
export async function createUser(input: CreateUserInput) {
  if (!isValidEmail(input.email)) {
    throw new Error('Invalid email format');
  }

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
    },
  });

  return user;
}
