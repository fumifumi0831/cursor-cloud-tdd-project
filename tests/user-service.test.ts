import { createUser } from '../src/user-service';

describe('User Service', () => {
  test('should create a user with valid data', async () => {
    const user = await createUser({
      name: 'John Doe',
      email: 'john@example.com',
    });
    
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
  });

  test('should reject invalid email', async () => {
    await expect(
      createUser({ name: 'John', email: 'invalid-email' })
    ).rejects.toThrow('Invalid email format');
  });
});
