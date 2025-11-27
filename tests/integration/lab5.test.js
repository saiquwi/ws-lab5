const request = require('supertest');
const { app, TEST_PORT } = require('../../test-server');
const db = require('../../app/models');

describe('Lab 5 Basic Tests', () => {
  beforeAll(async () => {
    // Используем существующую БД, не пересоздаем
    await db.sequelize.authenticate();
  });

  afterAll(async () => {
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
});