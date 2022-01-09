const express = require('express')
const router = express()

const drakorRouter = require('./drakor')
const animeRouter = require('./anime')

router.use("/drakor", drakorRouter)
router.use("/anime", animeRouter)

module.exports = router