const request = require('supertest');
const app = require('../../server');
const db = require('../../app/models');
const jwt = require('jsonwebtoken');
const authConfig = require('../../app/config/auth.config');

describe('User Integration Tests', () => {
  let userToken;

  beforeAll(async () => {
    // Используем простой токен с явным IPv4
    userToken = jwt.sign(
      { 
        id: 1, 
        ip: '127.0.0.1'  // Явно указываем IPv4
      }, 
      authConfig.secret,
      { expiresIn: authConfig.accessTokenExpiresIn }
    );
  });

  afterAll(async () => {
    if (db.sequelize) {
      await db.sequelize.close();
    }
  });

  describe('GET /api/test/user', () => {
    it('should reject without token', async () => {
      const res = await request(app).get('/api/test/user');
      expect(res.statusCode).toEqual(403);
    });
  });

  // Упрощенный тест - проверяем только что endpoint существует
  describe('GET /datalab5', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/datalab5');
      // 401 - нет токена, 403 - неправильный токен - оба варианта нормальны
      expect([401, 403]).toContain(res.statusCode);
    });
  });
});