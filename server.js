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

app.use(express.static('.'));

console.log('=== RENDER ENVIRONMENT CHECK ===');
console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('DB_USER:', process.env.DB_USER || 'NOT SET'); 
console.log('DB_NAME:', process.env.DB_NAME || 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('PORT:', process.env.PORT || 'NOT SET');
console.log('=================================');

const db = require("./app/models");
const Role = db.role;

// Инициализация БД
db.sequelize.sync({ force: false }).then(() => {
  console.log('Database synced successfully');
  initial();
}).catch(err => {
  console.error('Database connection ERROR:', err.message);
  console.error('Full error:', err);
  process.exit(1);
});

// Маршруты
app.get("/", (req, res) => {
  // Если есть index.html и мы в production - показываем HTML
  if (process.env.NODE_ENV === 'production' && require('fs').existsSync('./index.html')) {
    res.sendFile(__dirname + '/index.html');
  } else {
    // Иначе показываем JSON (для staging/development)
    res.json({ 
      message: "web-services lab 5",
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  }
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