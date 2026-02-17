const db = require("../config/db");

exports.createAssignment = ({
  course_id,
  title,
  file_path,
  file_type,
  file_name,
  deadline,
  uploaded_by,
}) => {
  const sql = `
    INSERT INTO assignments 
    (course_id, title, file_path, file_type, file_name, deadline, uploaded_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  return db
    .promise()
    .query(sql, [
      course_id,
      title,
      file_path,
      file_type,
      file_name,
      deadline,
      uploaded_by,
    ]);
};
