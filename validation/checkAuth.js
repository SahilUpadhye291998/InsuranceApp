const jwt = require(`jsonwebtoken`);
const jwtSecret = require(`../secret/keys`).jwtSecret;

const checkAuth = (req, res, next) => {
  try {
    const decode = jwt.verify(req.body.token, jwtSecret);
    req.userName = decode;
    next();
  } catch (error) {
    res.status(401).json({
      message: `Please check your credentials: Authentication fail`
    });
  }
};
