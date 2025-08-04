const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, async (req, res) => {
  const { lessonId, liked } = req.body;
  const userId = req.user.id;

  try {
    const existing = await db.query(
      "SELECT * FROM likes WHERE user_id = $1 AND lesson_id = $2",
      [userId, lessonId]
    );

    if (existing.rows.length > 0) {
      await db.query(
        "UPDATE likes SET liked = $1 WHERE user_id = $2 AND lesson_id = $3",
        [liked, userId, lessonId]
      );
    } else {
      await db.query(
        "INSERT INTO likes (user_id, lesson_id, liked) VALUES ($1, $2, $3)",
        [userId, lessonId, liked]
      );
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Ошибка лайка:", err);
    res.sendStatus(500);
  }
});

router.delete("/:lessonId", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const lessonId = req.params.lessonId;

  try {
    await db.query(
      "DELETE FROM likes WHERE user_id = $1 AND lesson_id = $2",
      [userId, lessonId]
    );
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(500);
  }
});

router.get("/:lessonId", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const lessonId = req.params.lessonId;

  try {
    const result = await db.query(
      "SELECT liked FROM likes WHERE user_id = $1 AND lesson_id = $2",
      [userId, lessonId]
    );
    if (result.rows.length > 0) {
      res.json({ liked: result.rows[0].liked });
    } else {
      res.json({ liked: null });
    }
  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;
