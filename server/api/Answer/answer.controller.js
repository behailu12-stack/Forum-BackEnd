const {
  addAnswers,
  getAllAnswers,
  getAnswerById,
  getAnswerByQid,
} = require("./answer.Service");

module.exports = {
  addAnswer: (req, res) => {
    const { answer, answer_code_block, user_id, question_id } = req.body;
    if (!answer || !answer_code_block || !user_id || !question_id) {
      return res
        .status(400)
        .json({ msg: "Not all fields have been provided!" });
    }
    addAnswers(req.body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "database connection err" });
      }
      return res.status(200).json({
        msg: "New answer added successfully",
        data: results,
      });
    });
  },
  getByQId: (req, res) => {
    const { qid } = req.body;
    getAnswerByQid(qid, (err, result) => {
      if (err) {
        return res.status(500).json({ msg: "database connection err" });
      }
      return res.status(200).json({ data: result });
    });
  },
};
