const express = require('express')
const router = express()

const {
    home,
    complateAnime,
    ongoingAnime,
    scheduleAnime,
    genreList,
    genreDetail,
    searchAnime
} = require('../app/controller/anime/main')

const {
    detailAnime,
    batchAnime,
    episodeAnime,
    mirrorAnime
} = require('../app/controller/anime/anime')

router.get("/", home)
router.get("/schedule", scheduleAnime)

router.get("/genre", genreList)
router.get("/genre/:id", genreDetail)
router.get("/genre/:id/:page", genreDetail)

router.get("/complate", complateAnime)
router.get("/complate/:page", complateAnime)

router.get("/ongoing", ongoingAnime)
router.get("/ongoing/:page", ongoingAnime)

router.get("/search/:query", searchAnime)

router.get("/:id", detailAnime)
router.get("/batch/:id", batchAnime)
router.get("/episode/:id", episodeAnime)
router.get("/episode/:id/mirror", mirrorAnime)

module.exports = router