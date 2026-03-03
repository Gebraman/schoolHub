const db = require("../config/db");

exports.sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await db.execute(
      "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
      [name, email, message],
    );

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
};
