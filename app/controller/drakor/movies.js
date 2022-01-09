const cheerio = require('cheerio')
const client = require('../../lib/client')

const { 
    drakor_url
} = require('../../lib/consts')

const {
    addHttp, getBanner
} = require('../../lib/helpers')

const getMovies = async(req, res, next) => {
    try {
        const id = req.params.id
        const response = await client(drakor_url).get(`${id}`)
        const $ = cheerio.load(response.data)

        const descResponse = $(".mvic-desc").eq(0)
        const descLeft = descResponse.find(".mvici-left").eq(0).children()
        const descRight = descResponse.find(".mvici-right").eq(0).children()

        const descriptions = {}

        const title = descResponse.find("h3").eq(0).text()
        const thumbnail = $("img.hidden").eq(0).attr("src")
        const banner = getBanner($(".mvi-cover").first().attr("style"))

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

        const urlStreaming = []
        $(".movieplay").each((i, elem) => {
            urlStreaming.push({
                url: addHttp($(elem).children().first().attr("src")),
                name: `Server ${i + 1}`,
            })
        })

        const urlDownload = []
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
                id,
                title,
                thumbnail,
                banner,
                descriptions,
                urlStreaming,
                urlDownload,
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
    getMovies
}