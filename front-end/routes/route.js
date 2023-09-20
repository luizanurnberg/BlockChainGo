const express = require('express')
const controller = require('../controllers/controller')
const router = express.Router()

// define the home page route
router.get('/', controller.renderHomePage)

// POST method route
router.post('/', controller.searchWeather)

// define the about page route
router.get('/about', controller.renderAboutPage)

module.exports = router