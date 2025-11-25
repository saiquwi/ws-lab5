const config = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || config.DB,
  process.env.DB_USER || config.USER, 
  process.env.DB_PASSWORD || config.PASSWORD,
  {
    host: process.env.DB_HOST || config.HOST,
    dialect: config.dialect,
    dialectOptions: config.dialectOptions,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Указываем схему для каждой модели
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.refreshToken = require("../models/refreshtoken.model.js")(sequelize, Sequelize);

// Устанавливаем схему для каждой модели
db.user.schema(config.SCHEMA);
db.role.schema(config.SCHEMA);
db.refreshToken.schema(config.SCHEMA);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId',
  targetKey: 'id',
});
db.user.hasMany(db.refreshToken, {
  foreignKey: 'userId',
});

db.ROLES = ["user", "admin"];

module.exports = db;