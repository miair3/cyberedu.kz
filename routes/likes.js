const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// Поставить или изменить лайк/дизлайк
router.post("/", authenticateToken, async (req, res) => {
  const { lessonId, liked } = req.body; // liked = true (лайк), false (дизлайк)
  const userId = req.user.id;

  try {
    // Проверяем, есть ли запись
    const existing = await db.query(
      "SELECT * FROM likes WHERE user_id = $1 AND lesson_id = $2",
      [userId, lessonId]
    );

    if (existing.rows.length > 0) {
      // Обновляем лайк/дизлайк
      await db.query(
        "UPDATE likes SET liked = $1 WHERE user_id = $2 AND lesson_id = $3",
        [liked, userId, lessonId]
      );
    } else {
      // Добавляем новую запись
      await db.query(
        "INSERT INTO likes (user_id, lesson_id, liked) VALUES ($1, $2, $3)",
        [userId, lessonId, liked]
      );
    }

    // Считаем лайки/дизлайки
    const counts = await db.query(
      `SELECT 
        SUM(CASE WHEN liked = true THEN 1 ELSE 0 END) AS likes_count,
        SUM(CASE WHEN liked = false THEN 1 ELSE 0 END) AS dislikes_count
       FROM likes
       WHERE lesson_id = $1`,
      [lessonId]
    );

    res.json({
      likesCount: parseInt(counts.rows[0].likes_count) || 0,
      dislikesCount: parseInt(counts.rows[0].dislikes_count) || 0,
      liked, // возвращаем текущую реакцию пользователя
    });
  } catch (err) {
    console.error("Ошибка лайка:", err);
    res.sendStatus(500);
  }
});

// Удалить лайк/дизлайк
router.delete("/:lessonId", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const lessonId = req.params.lessonId;

  try {
    await db.query(
      "DELETE FROM likes WHERE user_id = $1 AND lesson_id = $2",
      [userId, lessonId]
    );

    // Считаем новое количество
    const counts = await db.query(
      `SELECT 
        SUM(CASE WHEN liked = true THEN 1 ELSE 0 END) AS likes_count,
        SUM(CASE WHEN liked = false THEN 1 ELSE 0 END) AS dislikes_count
       FROM likes
       WHERE lesson_id = $1`,
      [lessonId]
    );

    res.json({
      likesCount: parseInt(counts.rows[0].likes_count) || 0,
      dislikesCount: parseInt(counts.rows[0].dislikes_count) || 0,
      liked: null,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Получить лайк пользователя + общее количество
router.get("/:lessonId", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const lessonId = req.params.lessonId;

  try {
    const userLike = await db.query(
      "SELECT liked FROM likes WHERE user_id = $1 AND lesson_id = $2",
      [userId, lessonId]
    );

    const counts = await db.query(
      `SELECT 
        SUM(CASE WHEN liked = true THEN 1 ELSE 0 END) AS likes_count,
        SUM(CASE WHEN liked = false THEN 1 ELSE 0 END) AS dislikes_count
       FROM likes
       WHERE lesson_id = $1`,
      [lessonId]
    );

    res.json({
      liked: userLike.rows[0]?.liked ?? null,
      likesCount: parseInt(counts.rows[0].likes_count) || 0,
      dislikesCount: parseInt(counts.rows[0].dislikes_count) || 0,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
