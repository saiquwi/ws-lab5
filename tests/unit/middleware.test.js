// Импортируем напрямую из файлов, а не из index
const verifySignUp = require('../../app/middleware/verifySignUp');

describe('Middleware Unit Tests', () => {
  describe('checkRolesExisted', () => {
    it('should accept valid roles', () => {
      const req = {
        body: {
          roles: ['user', 'admin']
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      const next = jest.fn();

      // Используем функцию напрямую
      verifySignUp.checkRolesExisted(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should reject invalid roles', () => {
      const req = {
        body: {
          roles: ['invalid_role']
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      const next = jest.fn();

      verifySignUp.checkRolesExisted(req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should proceed without roles', () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      const next = jest.fn();

      verifySignUp.checkRolesExisted(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});