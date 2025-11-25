module.exports = {
  secret: process.env.JWT_SECRET || "ws-sem7-lab5-secret-key",
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || 60,
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || 86400,
};