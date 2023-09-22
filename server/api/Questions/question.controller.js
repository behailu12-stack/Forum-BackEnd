const {
  questionAdd,
  getAllQuestion,
  getQuestionById,
  getQuestionByUserId,
} = require("./question.Service");


module.exports = {
  addQuestions: (req, res) => {
    const {
      question,
      question_description,
      question_code_block,
      tags,
      user_id,
    } = req.body;
    //validation
    if (!question || !question_description || !user_id) {
      return res
        .status(400)
        .json({ msg: "Not all fields have been provided!" });
    }

    questionAdd(req.body, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ msg: "database connection err" });
      }
      return res.status(200).json({
        msg: "New question added successfully",
        data: results,
      });
    });
  },
  getQuestions: (req, res) => {
    getAllQuestion((err, result) => {
      if (err) {
        return res.status(500).json({ msg: "database connection err" });
      }
      return res.status(200).json({ data: result });
    });
  },
  getById: (req, res) => {
    const { qid } = req.body;
    getQuestionById(qid, (err, result) => {
      if (err) {
        return res.status(500).json({ msg: "database connection err" });
      }
      return res.status(200).json({ data: result });
    });
  },
};
