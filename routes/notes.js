const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../middleware/authMiddleware");

// Получить все заметки пользователя
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user; // id пользователя из токена
    const result = await pool.query(
      "SELECT id, text, created_at FROM notes WHERE user_id = $1 ORDER BY created_at DESC",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при получении заметок" });
  }
});

// Добавить заметку
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const { id } = req.user;

    const result = await pool.query(
      "INSERT INTO notes (user_id, text) VALUES ($1, $2) RETURNING *",
      [id, text]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при добавлении заметки" });
  }
});

// Удалить заметку
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.id;
    const { id } = req.user;

    await pool.query("DELETE FROM notes WHERE id = $1 AND user_id = $2", [
      noteId,
      id,
    ]);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка при удалении заметки" });
  }
});

module.exports = router;
