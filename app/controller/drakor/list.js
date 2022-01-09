const cheerio = require('cheerio')
const client = require('../../lib/client')

const { 
    drakor_url
} = require('../../lib/consts')

const {
    extractId, isSeries
} = require('../../lib/helpers')

const west = async(req, res, mext) => {
    try {
        let id = req.params.id
        id = id ? (id == 0 ? 1 : id) : 1
        const response = await client(drakor_url).get(`serial-barat/page/${id}`)
        const $ = cheerio.load(response.data)

        const list = []
        $(".movies-list").eq(0).children().each((i, elem) => {
            const url = $(elem).find(".ml-mask").attr("href")
            if (url && isSeries(url)) {
                const id = extractId($(elem).find("a").eq(0).attr("href"))
                list.push({
                    id,
                    type: "series",
                    title: $(elem).find("span.mli-info").eq(0).text(),
                    quality: $(elem).find("span.mli-quality").eq(0).text(),
                    thumbnail: $(elem).find("img.mli-thumb").eq(0).attr("data-original"),
                })
            }
        })

        let nextUrl = null
        $(".pagination").eq(0).children().each((i, elem) => {
            const nextIndex = parseInt(id) + 1
            if (nextIndex == $(elem).text()) {
                nextUrl = nextIndex
            }
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                list,
                next: nextUrl
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

const korea = async(req, res, next) => {
    try {
        let id = req.params.id
        id = id ? (id == 0 ? 1 : id) : 1
        const response = await client(drakor_url).get(`korea-drama/page/${id}`)
        const $ = cheerio.load(response.data)

        const list = []
        $(".movies-list").eq(0).children().each((i, elem) => {
            const url = $(elem).find(".ml-mask").attr("href")
            if (url && isSeries(url)) {
                const id = extractId($(elem).find("a").eq(0).attr("href"))
                list.push({
                    id,
                    type: "series",
                    title: $(elem).find("span.mli-info").eq(0).text(),
                    quality: $(elem).find("span.mli-quality").eq(0).text(),
                    thumbnail: $(elem).find("img.mli-thumb").eq(0).attr("data-original"),
                })
            }
        })

        let nextUrl = null
        $(".pagination").eq(0).children().each((i, elem) => {
            const nextIndex = parseInt(id) + 1
            if (nextIndex == $(elem).text()) {
                nextUrl = nextIndex
            }
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                list,
                next: nextUrl
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

const asia = async(req, res, next) => {
    try {
        let id = req.params.id
        id = id ? (id == 0 ? 1 : id) : 1
        const response = await client(drakor_url).get(`drama-asia/page/${id}`)
        const $ = cheerio.load(response.data)

        const list = []
        $(".movies-list").eq(0).children().each((i, elem) => {
            const url = $(elem).find(".ml-mask").attr("href")
            if (url && isSeries(url)) {
                const id = extractId($(elem).find("a").eq(0).attr("href"))
                list.push({
                    id,
                    type: "series",
                    title: $(elem).find("span.mli-info").eq(0).text(),
                    quality: $(elem).find("span.mli-quality").eq(0).text(),
                    thumbnail: $(elem).find("img.mli-thumb").eq(0).attr("data-original"),
                })
            }
        })

        let nextUrl = null
        $(".pagination").eq(0).children().each((i, elem) => {
            const nextIndex = parseInt(id) + 1
            if (nextIndex == $(elem).text()) {
                nextUrl = nextIndex
            }
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                list,
                next: nextUrl
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

const movies = async(req, res, next) => {
    try {
        let id = req.params.id
        id = id ? (id == 0 ? 1 : id) : 1
        const response = await client(drakor_url).get(`movies/page/${id}`)
        const $ = cheerio.load(response.data)

        const list = []
        $(".movies-list").eq(0).children().each((i, elem) => {
            const url = $(elem).find(".ml-mask").attr("href")
            if (url) {
                const id = extractId($(elem).find("a").eq(0).attr("href"))
                list.push({
                    id,
                    type: "movies",
                    title: $(elem).find("span.mli-info").eq(0).text(),
                    quality: $(elem).find("span.mli-quality").eq(0).text(),
                    thumbnail: $(elem).find("img.mli-thumb").eq(0).attr("data-original"),
                })
            }
        })

        let nextUrl = null
        $(".pagination").eq(0).children().each((i, elem) => {
            const nextIndex = parseInt(id) + 1
            if (nextIndex == $(elem).text()) {
                nextUrl = nextIndex
            }
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                list,
                next: nextUrl
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

const search = async(req, res, next) => {
    try {
        const q = req.params.query.replace(" ", "+")
        let page = req.params.page
        page = page ? (page == 0 ? 1 : page) : 1

        const response = await client(drakor_url).get(`page/${page}/?s=${q}`)
        const $ = cheerio.load(response.data)

        const list = []
        $(".movies-list").eq(0).children().each((i, elem) => {
            const url = $(elem).find(".ml-mask").attr("href")
            if (url) {
                if (url.search("/episode/") == -1) {
                    const id = extractId($(elem).find("a").eq(0).attr("href"))
                    list.push({
                        id,
                        type: isSeries(url) ? "series" : "movies",
                        title: $(elem).find("span.mli-info").eq(0).text(),
                        quality: $(elem).find("span.mli-quality").eq(0).text(),
                        thumbnail: $(elem).find("img.mli-thumb").eq(0).attr("data-original"),
                    })
                }
            }
        })

        let nextUrl = null
        $(".pagination").eq(0).children().each((i, elem) => {
            const nextIndex = parseInt(page) + 1
            if (nextIndex == $(elem).text()) {
                nextUrl = nextIndex
            }
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                list,
                next: nextUrl
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
    korea,
    west,
    asia,
    movies,
    search
}