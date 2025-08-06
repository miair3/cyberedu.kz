const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const multer = require('multer');
const path = require('path');

// Настройка multer для загрузки аватарок
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.get('/users/:id', authMiddleware, userController.getUserById);
router.get('/profile', authMiddleware, userController.getProfile);

// 🔹 Новый роут для обновления профиля
router.put(
  '/update-profile',
  authMiddleware,
  upload.single('avatar'),
  userController.updateProfile
);

module.exports = router;
