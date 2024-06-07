const router = require('express').Router();
const UserController = require('./UserController');
const AuthMiddleware = require('../../middleware/authMiddleware');

router.post('/signup', UserController.signup());
router.post('/signin', UserController.signin());
router.get('/me', AuthMiddleware, UserController.getMe());

module.exports = router;