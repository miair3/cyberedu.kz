const express = require("express");
const router = express.Router();
const pool = require("../db");

// Получение статистики по уроку
router.get("/lessons/:id", async (req, res) => {
  const lessonId = req.params.id;

  try {
    const likesRes = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE lesson_id = $1 AND liked = true",
      [lessonId]
    );
    const dislikesRes = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE lesson_id = $1 AND liked = false",
      [lessonId]
    );

    res.json({
      likesCount: parseInt(likesRes.rows[0].count, 10),
      dislikesCount: parseInt(dislikesRes.rows[0].count, 10),
    });
  } catch (err) {
    console.error("Ошибка при получении статистики урока:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

module.exports = router;
