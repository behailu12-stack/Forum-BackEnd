const { addAnswer, getByQId } = require('./answer.controller');

const router = require('express').Router();


router.post("/add", addAnswer);
router.post("/qid", getByQId)


module.exports = router;