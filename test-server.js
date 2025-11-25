const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

// Тестовые маршруты
app.get("/test-health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: "test"
  });
});

app.get("/test-data", [require("./app/middleware/authJwt").verifyTokenAndIp], (req, res) => {
  res.json({ 
    message: "Test protected data",
    user: req.userId,
    timestamp: new Date().toISOString()
  });
});

// Тестовые auth routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const TEST_PORT = process.env.TEST_PORT || 8081;

// Экспортируем app для тестов, но не запускаем сервер автоматически
module.exports = { app, TEST_PORT };