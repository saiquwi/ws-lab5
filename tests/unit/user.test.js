describe('User Unit Tests', () => {
  test('basic user test', () => {
    expect(1 + 1).toBe(2);
  });

  test('user object creation', () => {
    const user = { id: 1, username: 'testuser' };
    expect(user).toHaveProperty('username');
    expect(user.username).toBe('testuser');
  });
});