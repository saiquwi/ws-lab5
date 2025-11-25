const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      const userIp = req.ip || req.connection.remoteAddress;
      console.log(`Login from IP: ${userIp}`);

      const accessToken = jwt.sign(
        { 
          id: user.id,
          ip: userIp 
        },
        config.secret,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: config.accessTokenExpiresIn
        }
      );

      const refreshToken = await db.refreshToken.createToken(user); 

      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: accessToken,
          refreshToken: refreshToken
        });
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).send({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await db.refreshToken.findOne({ where: { token: requestToken } });

    if (!refreshToken) {
      return res.status(403).json({ message: "Refresh token is not in database!" });
    }

    if (db.refreshToken.verifyExpiration(refreshToken)) {
      await refreshToken.destroy();
      return res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
    }

    const user = await refreshToken.getUser();
    
    await refreshToken.destroy(); 

    const newUserIp = req.ip || req.connection.remoteAddress;
        console.log(`Token refresh from IP: ${newUserIp}`);

    const newAccessToken = jwt.sign({ id: user.id, ip: newUserIp }, config.secret, {
      algorithm: 'HS256',
      allowInsecureKeySizes: true,
      expiresIn: config.accessTokenExpiresIn,
    });

    const newRefreshToken = await db.refreshToken.createToken(user);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, 
    });

  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};