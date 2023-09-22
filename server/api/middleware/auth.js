const jwt = require("jsonwebtoken");
require("dotenv").config();

// Authentication middleware function
const auth = (req, res, next) => {
  try {
    // Get the token from the request headers
    req.token = req.headers["x-auth-token"];

    // If token is missing, return a 401 Unauthorized response
    if (!req.token) {
      return res
        .status(401)
        .json({ msg: "No authentication token, authorization denied." });
    }

    // Verify the token using the JWT_SECRET from environment variables
    const verified = jwt.verify(req.token, process.env.JWT_SECRET);

    // If token verification fails, return a 401 Unauthorized response
    if (!verified) {
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });
    }

    // Attach the authenticated user's ID to the request object
    req.id = verified.id;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Handle errors by returning a 500 Internal Server Error response
    res.status(500).json({ error: err.message });
  }
};

// Export the authentication middleware
module.exports = auth;
