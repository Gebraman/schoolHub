const db = require("../config/db");

const webpush = require("web-push");

const publicKey =
  "BFuEaumG9U1edPSKctlkBVY0b6u8ad0EXZMU0L8DhE7qQr6BXwu_RYJpvUkI6mkWtxDFjXMyLdt27PD8Cwqhk0k";

const privateKey = "ThTFs_EA_WHFkq01lU6PIhDX5BTyUWae_IHHGe_rAqc";

webpush.setVapidDetails("mailto:test@test.com", publicKey, privateKey);

// send public key to frontend
exports.getPublicKey = (req, res) => {
  res.send(publicKey);
};

// save user push subscription
exports.subscribeUser = async (req, res) => {
  try {
    const subscription = req.body;
    const user = req.user;

    await db.query(
      `INSERT INTO push_subscriptions (subscription, department, section, year)
       VALUES (?, ?, ?, ?)`,
      [JSON.stringify(subscription), user.department, user.section, user.year],
    );

    res.status(201).json({
      message: "Subscribed successfully",
    });
  } catch (err) {
    console.error("Push subscription error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
