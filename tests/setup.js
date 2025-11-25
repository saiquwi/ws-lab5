require('dotenv').config();

// Настройка тестовой среды
process.env.NODE_ENV = 'test';

// Глобальные таймауты для тестов
jest.setTimeout(30000);