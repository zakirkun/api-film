const express = require('express')
const router = express()

// load drakor controller
const { 
    getHome,
    getDetail,
    getEpisode
} = require('../app/controller/drakor/drakor')

const { getMovies } = require('../app/controller/drakor/movies')
const { 
    korea, 
    west,
    asia,
    movies,
    search 
} = require('../app/controller/drakor/list')

// home endpont
router.get('/', getHome)

// series endpoint
router.get('/series/:id', getDetail)
router.get('/episode/:id', getEpisode)
router.get('/korean/:id', korea)
router.get('/west/:id', west)
router.get('/asian/:id', asia)

// movie endpoint
router.get('/movies/:id', getMovies)
router.get('/movies/page/:id', movies)

// search endpoint
router.get('/search/:query/', search)
router.get('/search/:query/:page', search)

module.exports = router