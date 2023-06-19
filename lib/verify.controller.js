
import User from "../Models/User.js";
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
      if (err) req.role = undefined;
      User.findOne({
          _id: decode.id
        })
        .then((user, err) => {
          if (err) {
            res.status(500)
              .send({
                message: err
              });
          } else {
            req.role = user.role;
            next();
          }
        })
    });
  } else {
    req.role = undefined;
    next();
  }
};

export default verifyToken;