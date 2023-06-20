import User from "../Models/User.js";
import jwt from "jsonwebtoken";

/**
 * Middleware function for verifying JSON Web Tokens (JWT).
 * The function extracts the token from the request headers and verifies its authenticity.
 * If the token is valid, it decodes the token payload and retrieves the user information.
 * The user information is attached to the request object for further processing.
 * If the token is invalid or missing, it sets the user role and id to undefined.
 * The middleware function calls the next() function to pass control to the next middleware or route handler.
 * If an error occurs during token verification or user retrieval, it calls the next() function with the error.
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function.
 */
const verifyToken = (req, res, next) => {
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "JWT"
    ) {
      jwt.verify(
        req.headers.authorization.split(" ")[1],
        process.env.API_SECRET,
        function (err, decode) {
          if (err) {
            req.role = undefined;
            req.id = undefined;
            next(err);
          }
          User.findOne({
            _id: decode.id,
          }).then((user, err) => {
            if (err) {
              res.status(500).send({
                message: err,
              });
            } else {
              req.role = user.role;
              req.id = decode.id;
              next();
            }
          });
        }
      );
    } else {
      req.role = undefined;
      req.id = undefined;
      next(new Error('No Token Provided'));
    }
  };
  
  export default verifyToken;
  