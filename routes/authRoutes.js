const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/AuthController')
const ToughtController = require('../controllers/ToughtController')
const { checkAuth } = require('../helpers/auth')

// Controller
router.get('/login', AuthController.login)
router.post('/login', AuthController.loginPost)
router.get('/register', AuthController.register)
router.post('/register', AuthController.registerpost)
router.get('/logout', AuthController.logout)

module.exports = router