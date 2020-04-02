const jwt = require(`jsonwebtoken`);
const jwtSecret = require('../secert/keys').jwtSecret;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    
    const decode = jwt.verify(token, jwtSecret);

    req.userData = decode;
    console.log(decode);
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      message: `Please check your credentials: Authentication fail`
    });
  }
};

