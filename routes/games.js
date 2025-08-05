const express = require('express');
const router = express.Router();
const pool = require('../db'); // твоя настройка pg

// Получить все игры
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
