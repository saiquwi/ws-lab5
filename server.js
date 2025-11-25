const express = require("express");
const cors = require("cors");
require('dotenv').config();

const app = express();

app.set('trust proxy', true);

// CORS
app.use(cors({
  //origin: ['http://localhost:8081', 'http://localhost:3000'],
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;

// Инициализация БД
db.sequelize.sync({ force: false }).then(() => {
  console.log('Database synced successfully');
  initial();
});

// Маршруты
app.get("/", (req, res) => {
  res.json({ 
    message: "web-services lab 5",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Защищенный endpoint для Lab 5
app.get("/datalab5", [require("./app/middleware/authJwt").verifyTokenAndIp], (req, res) => {
  res.json({ 
    message: "Lab 5 protected data",
    user: req.userId,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}.`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

function initial() {
  Role.findOrCreate({
    where: { id: 1 },
    defaults: { name: "user" }
  });
  Role.findOrCreate({
    where: { id: 2 },
    defaults: { name: "admin" }
  });
}

module.exports = app;