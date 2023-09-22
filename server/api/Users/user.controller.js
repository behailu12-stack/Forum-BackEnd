const {
  register,
  getUserByEmail,
  userById,
  getAllUsers,
  profile,
} = require("./user.service");
const pool = require("../../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = {
  // *********************************************//
  // Controller for creating a user
  // *********************************************//
  createUser: (req, res) => {
    const { userName, firstName, lastName, email, password } = req.body;
    console.log(req.body);
    //validation
    if (!userName || !firstName || !lastName || !email || !password)
      return res
        .status(400)
        .json({ msg: "Not all fields have been provided!" });
    if (password.length < 8)
      return res
        .status(400)
        .json({ msg: "Password must be at least 8 characters!" });
    pool.query(
      "SELECT * FROM registration WHERE user_email = ? ",
      [email],
      (err, result) => {
        if (err) {
          return res.status(err).json({ msg: "database connection err" });
        }
        if (result.length > 0) {
          return res
            .status(400)
            .json({ msg: "an account with this email is already exist" });
        } else {
          //password encryption

          const salt = bcrypt.genSaltSync();

          //changing the value of password from req.body with the encrypted password

          req.body.password = bcrypt.hashSync(password, salt);
          register(req.body, (err, results) => {
            // error on connection

            if (err) {
              console.log(err);
              return res.status(500).json({ msg: "database connection err" });
            }

            //Before completing the registration process, we need to retrieve the user_id from the database by accessing it through the email.

            pool.query(
              "SELECT * FROM registration WHERE user_email = ?",
              [email],
              (err, results) => {
                if (err) {
                  return res
                    .status(err)
                    .json({ msg: "database connection err" });
                }

                //Retrieve the user_id from the newly inserted data.

                req.body.userId = results[0].user_id;
                console.log(req.body);

                // Sending data, which includes the user_id from req.body, to the profile endpoint where req.body.userid originates from the data entered during registration.

                profile(req.body, (err, results) => {
                  if (err) {
                    console.log(err);
                    return res
                      .status(500)
                      .json({ msg: "database connection err" });
                  }
                  return res.status(200).json({
                    msg: "New user added successfully",
                    data: results,
                  });
                });
              }
            );
          });
        }
      }
    );
  },
  getUserById: (req, res) => {
    //Retrieving req.id from auth middleware

    userById(req.id, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "database connection err" });
      }
      if (!results) {
        return res.status(404).json({ msg: "Record not found" });
      }
      return res.status(200).json({ data: results });
    });
  },
  getUsers: (req, res) => {
    getAllUsers((err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "database connection err" });
      }
      return res.status(200).json({ data: results });
    });
  },
  login: (req, res) => {
    //destructuring req.body
    const { email, password } = req.body;
    //validation
    if (!email || !password)
      return res
        .status(400)
        .json({ msg: "Not all fields have been provided!" });

    //sending data to check if email exist on our database
    getUserByEmail(email, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "database connection err" });
      }
      if (!results) {
        return res
          .status(404)
          .json({ msg: "No account with this email has been registered" });
      }

      //Check provided password by the user with the encrypted password from database

      const isMatch = bcrypt.compareSync(password, results.user_password);
      if (!isMatch) return res.status(404).json({ msg: "Invalid Credentials" });

      // Creating a token for the authenticated user that expires in 1 hour, using our secret key for generation. Authentication involves user verification, while authorization determines the granted privileges. We utilize the JWT secret key (process.env.jwt_secret) to ensure token uniqueness, followed by token generation.

      const token = jwt.sign({ id: results.user_id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      //Returning an authentication token along with user information

      return res.json({
        token,
        user: {
          id: results.user_id,
          display_name: results.user_name,
        },
      });
    });
  },
};
