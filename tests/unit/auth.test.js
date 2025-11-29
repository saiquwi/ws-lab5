const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Импортируем напрямую из файла
const authJwt = require('../../app/middleware/authJwt');
const authConfig = require('../../app/config/auth.config');

// Mock response objects
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Mock request with all required properties
const mockRequest = (headers = {}, ip = '127.0.0.1') => {
  return {
    headers,
    ip,
    connection: { remoteAddress: ip },
    socket: { remoteAddress: ip }
  };
};

describe('Auth Unit Tests', () => {
  describe('JWT Verification', () => {
    it('should reject missing token', () => {
      const req = mockRequest();
      const res = mockResponse();
      const next = jest.fn();

      // Используем функцию напрямую
      authJwt.verifyTokenAndIp(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('Password Hashing', () => {
    it('should hash and verify password correctly', () => {
      const password = 'testpassword123';
      const hashed = bcrypt.hashSync(password, 8);
      
      expect(bcrypt.compareSync(password, hashed)).toBe(true);
      expect(bcrypt.compareSync('wrongpassword', hashed)).toBe(false);
    });
  });

  //падающий тест
  /*
  test('should fail intentionally', () => {
    expect(true).toBe(false);
  });
  */
});