const pool = require("../../config/database");

module.exports = {
  questionAdd: (data, callback) => {
    pool.query(
      `INSERT INTO question(question,question_description,question_code_block,tags,user_id)VALUES(?,?,?,?,?)`,
      [
        data.question,
        data.question_description,
        data.question_code_block,
        data.tags,
        data.user_id,
      ],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result);
      }
    );
  },
  getAllQuestion: (callback) => {
    pool.query(`SELECT * FROM question`, [], (err, result) => {
      if (err) {
        return callback(err);
      }
      return callback(null, result);
    });
  },
  getQuestionById: (qid, callback) => {
    pool.query(
      `SELECT * FROM question WHERE question_id = ?`,
      [qid],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result);
      }
    );
  },
  getQuestionByUserId: (id, callback) => {
    pool.query(
      `SELECT * FROM question WHERE user_id = ?`,
      [id],
      (err, result) => {
        if (err) {
          return callback(err);
        }
        return callback(null, result);
      }
    );
  },
};
