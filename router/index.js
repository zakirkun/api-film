const express = require('express')
const router = express()

const drakorRouter = require('./drakor')
const animeRouter = require('./anime')

router.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'Develop With <3'
    })
})

router.use("/drakor", drakorRouter)
router.use("/anime", animeRouter)

module.exports = router