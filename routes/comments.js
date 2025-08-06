const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// Получить все комментарии к уроку
router.get("/:lessonId", async (req, res) => {
  const { lessonId } = req.params;

  try {
    const result = await db.query(
      `SELECT c.id, c.content, c.created_at, u.username 
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.lesson_id = $1
       ORDER BY c.created_at DESC`,
      [lessonId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении комментариев:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// Добавить комментарий
router.post("/", authenticateToken, async (req, res) => {
  const { lessonId, content } = req.body;
  const userId = req.user.id;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Комментарий не может быть пустым" });
  }

  try {
    const result = await db.query(
      `INSERT INTO comments (user_id, lesson_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, created_at`,
      [userId, lessonId, content]
    );

    const newComment = {
      ...result.rows[0],
      username: req.user.username,
    };

    res.json(newComment);
  } catch (err) {
    console.error("Ошибка при добавлении комментария:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

module.exports = router;
