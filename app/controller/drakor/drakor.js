const cheerio = require('cheerio')
const client = require('../../lib/client')

const { 
    drakor_url
} = require('../../lib/consts')

const {
    extractId, isSeries, convertToBanner, addHttp
} = require('../../lib/helpers')

const getEpisode = async(req, res, next) => {
    try {
        const id = req.params.id
        const response = await client(drakor_url).get(`episode/${id}`)
        const $ = cheerio.load(response.data)

        const urlStreaming = [];
        $("#player2").children().each((i, elem) => {
            urlStreaming.push({
                url: addHttp($(elem).find("iframe").attr("src")),
                name: `Server ${i + 1}`,
            })
        })

        const urlDownload = [];
        $(".btn-group").eq(1).children().each((i, elem) => {
            urlDownload.push({
                url: addHttp($(elem).attr("href")),
                name: $(elem).find(".serv_tit").eq(0).text(),
            })
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                urlStreaming,
                urlDownload
            }
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const getDetail = async(req, res, next) => {
    try {
        const id = req.params.id
        const response = await client(drakor_url).get(`series/${id}`)
        const $ = cheerio.load(response.data)

        const descResponse = $(".mvic-desc").eq(0)
        const descLeft = descResponse.find(".mvici-left").eq(0).children()
        const descRight = descResponse.find(".mvici-right").eq(0).children()
        const descriptions = {}

        const title = descResponse.find("h3").eq(0).text()
        const thumbnail = $("img.hidden").eq(0).attr("src")
        const banner = $("#content-cover")
            .attr("style")
            .split("(")[1]
            .replace(");", "")

        descLeft.each((i, elem) => {
            const desc = $(elem).text().trim()
            if (desc.length > 0) {
                descriptions[
                    desc.split(":")[0].toLocaleLowerCase().replace(" ", "")
                ] = desc.split(":")[1].trim()
            }
        })

        descRight.each((i, elem) => {
            const desc = $(elem).text().trim()
            if (desc.length > 0) {
                descriptions[
                  desc.split(":")[0].toLocaleLowerCase().replace(" ", "")
                ] = desc
                    .split(":")[1]
                    .replace("Country", "")
                    .replace("Networks", "")
                    .trim()
            }
        })

        const episodes = []

        $("#seasons").children().each((i, elem) => {
            const season = {}
            season.season = i + 1
            season.data = []

            const item = $(elem)
            const episodeContent = item.find("div.les-content").eq(0)
            if (episodeContent.text().trim() != "No Episodes Available") {
                episodeContent.children().each((i, elem) => {
                    season.data.push({
                        id: extractId($(elem).attr("href") + "/"),
                        episode: $(elem).text().replace("Episode", "").trim()
                    })
                })
            }

            episodes.push(season)
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                id,
                title,
                thumbnail,
                banner,
                descriptions,
                episodes
            }
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const getHome = async(req, res, next) => {
    try {
        const response = await client(drakor_url).get()
        const $ = cheerio.load(response.data)

        const mostViewedResponse = $(".movies-list-wrap")
        .eq(0)
        .find("#topview-today")
        .find(".ml-item")
        const newDramaResponse = $(".movies-list-wrap").eq(2).find(".ml-item")
        const boxOfficeResponse = $(".movies-list-wrap").eq(3).find(".ml-item")
        const newMoviesResponse = $(".movies-list-wrap").eq(4).find(".ml-item")

        let mostViewed = []
        mostViewedResponse.each((i, elem) => {
            const id = extractId($(elem).find("a").eq(0).attr("href"))
            const url = $(elem).find(".ml-mask").attr("href")

            if (url.search("/episode/") == -1) {
                mostViewed.push({
                    id,
                    type: isSeries(url) ? "series" : "movies",
                    title: $(elem).find("span.mli-info").eq(0).text(),
                    quality: $(elem).find("span.mli-quality").eq(0).text(),
                    thumbnail: $(elem).find("img.mli-thumb").eq(0).attr("data-original"),
                    banner: convertToBanner(
                        $(elem).find("img.mli-thumb").eq(0).attr("data-original")
                    ),
                })
            }
        })

        let newSeries = []
        newDramaResponse.each((i, elem) => {
            const id = extractId($(elem).find("a").eq(0).attr("href"))
            const url = $(elem).find(".ml-mask").attr("href")

            if (url.search("/episode/") == -1) {
                newSeries.push({
                    id,
                    type: isSeries(url) ? "series" : "movies",
                    title: $(elem).find("span.mli-info").eq(0).text(),
                    quality: $(elem).find("span.mli-quality").eq(0).text(),
                    thumbnail: $(elem).find("img.mli-thumb").eq(0).attr("data-original"),
                    banner: convertToBanner(
                        $(elem).find("img.mli-thumb").eq(0).attr("data-original")
                    ),
                })
            }
        })

        let boxOffice = []
        boxOfficeResponse.each((i, elem) => {
            const id = extractId($(elem).find("a").eq(0).attr("href"))
            const url = $(elem).find(".ml-mask").attr("href")

            if (url.search("/episode/") == -1) {
                boxOffice.push({
                    id,
                    type: isSeries(url) ? "series" : "movies",
                    title: $(elem).find("span.mli-info").eq(0).text(),
                    quality: $(elem).find("span.mli-quality").eq(0).text(),
                    thumbnail: $(elem).find("img.mli-thumb").eq(0).attr("data-original"),
                    banner: convertToBanner(
                        $(elem).find("img.mli-thumb").eq(0).attr("data-original")
                    ),
                })
            }
        })

        let newMovies = []
        newMoviesResponse.each((i, elem) => {
            const id = extractId($(elem).find("a").eq(0).attr("href"))
            const url = $(elem).find(".ml-mask").attr("href")

            if (url.search("/episode/") == -1) {
                newMovies.push({
                    id,
                    type: isSeries(url) ? "series" : "movies",
                    title: $(elem).find("span.mli-info").eq(0).text(),
                    quality: $(elem).find("span.mli-quality").eq(0).text(),
                    thumbnail: $(elem).find("img.mli-thumb").eq(0).attr("data-original"),
                    banner: convertToBanner(
                        $(elem).find("img.mli-thumb").eq(0).attr("data-original")
                    ),
                })
            }
        })
        
        let genreList = []
        $(".sub-container").find("ul >li").each((i, elem) => {
            genreList.push({
                id: $(elem).find("a").attr("href").replace(drakor_url, ""),
                title: $(elem).find("a").text(),
            })
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                genreList,
                mostViewed,
                newSeries,
                boxOffice,
                newMovies
            }
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}


module.exports = {
    getHome,
    getDetail,
    getEpisode
}