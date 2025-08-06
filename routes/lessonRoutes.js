const express = require("express");
const router = express.Router();
const db = require("../db");

// Получить данные урока: количество лайков и дизлайков
router.get("/:lessonId", async (req, res) => {
  const { lessonId } = req.params;

  try {
    const likes = await db.query(
      "SELECT COUNT(*) FROM likes WHERE lesson_id = $1 AND liked = true",
      [lessonId]
    );
    const dislikes = await db.query(
      "SELECT COUNT(*) FROM likes WHERE lesson_id = $1 AND liked = false",
      [lessonId]
    );

    res.json({
      likesCount: parseInt(likes.rows[0].count),
      dislikesCount: parseInt(dislikes.rows[0].count),
    });
  } catch (err) {
    console.error("Ошибка получения данных урока:", err);
    res.sendStatus(500);
  }
});

module.exports = router;
