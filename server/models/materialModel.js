const db = require("../config/db");

exports.createMaterial = ({
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

  return db
    .promise()
    .query(sql, [course_id, title, file_path, file_type, uploaded_by]);
};
