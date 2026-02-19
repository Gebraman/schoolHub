const db = require("../config/db");

exports.createAssignment = async ({
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
  const [result] = await db.query(sql, [
    course_id,
    title,
    file_path,
    file_type,
    file_name,
    deadline,
    uploaded_by,
  ]);
  return result;
};
