const request = require('supertest');
const { app, TEST_PORT } = require('../../test-server');
const db = require('../../app/models');

let server;

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    // Запускаем тестовый сервер на другом порту
    server = app.listen(TEST_PORT);
    
    // Ждем немного чтобы сервер запустился
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    // Закрываем сервер после тестов
    if (server) {
      await server.close();
    }
    if (db.sequelize) {
      await db.sequelize.close();
    }
  });

  describe('Health Check', () => {
    it('should return server status', async () => {
      const response = await request(app).get('/test-health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
    });
  });

  describe('Public Routes', () => {
    ('should access public content', async () => {
      const response = await request(app).get('/api/test/all');
      expect(response.status).toBe(200);
    });
  });
});