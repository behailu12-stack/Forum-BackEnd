const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createUser,
  getUsers,
  getUserById,
  login,
} = require("./user.controller");
// const { askquestion } = require("../Questions/question.controller");

router.post("/signin", createUser);
router.post("/", createUser);
router.get("/all", getUsers);
router.get("/", auth, getUserById);
router.post("/login", login);
// router.post("/askquestion", auth, askquestion);

module.exports = router;
