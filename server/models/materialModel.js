const db = require("../config/db");

exports.createMaterial = async ({
  course_id,
  title,
  file_path,
  file_type,
  uploaded_by,
}) => {
  const sql = `
    INSERT INTO materials (course_id, title, file_path, file_type, uploaded_by)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, [
    course_id,
    title,
    file_path,
    file_type,
    uploaded_by,
  ]);
  return result;
};
