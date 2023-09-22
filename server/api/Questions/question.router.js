const {
  addQuestions,
  getQuestions,
  getById,
} = require("./question.controller");

const router = require("express").Router();

router.post("/add", addQuestions);
router.get("/all", getQuestions);
router.post("/qid", getById);

module.exports = router;
