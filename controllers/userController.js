const pool = require('../db');

class UserController {
  async getAllUsers(req, res) {
    try {
      const users = await pool.query('SELECT id, username, email FROM users');
      res.json(users.rows);
    } catch (err) {
      res.status(500).json({ error: 'Ошибка при получении пользователей' });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [id]);
      if (user.rows.length === 0) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      res.json(user.rows[0]);
    } catch (err) {
      res.status(500).json({ error: 'Ошибка при получении пользователя' });
    }
  }

  async getProfile(req, res) {
    const userId = req.user.id;
    try {
      const result = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [userId]);
      const user = result.rows[0];

      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      res.json(user);
    } catch (error) {
      console.error('Ошибка при получении профиля:', error);
      res.status(500).json({ message: 'Внутренняя ошибка сервера' });
    }
  }
}

module.exports = new UserController();
