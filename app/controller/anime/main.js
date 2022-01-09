const cheerio = require('cheerio')
const client = require('../../lib/client')

const { 
    anime_url
} = require('../../lib/consts')
const {
    ImageList
} = require('../../lib/helpers')

const home = async(req, res, next) => {
    try {
        let on_going = []
        let complete = []
        let episode, uploaded_on, day_updated, thumb, title, link, id

        const response = await client(anime_url).get()
        const $ = cheerio.load(response.data)
        const element = $(".venz")

        element
        .children().eq(0).find("ul > li").each(function () {
            $(this).find(".thumb > a").filter(function () {
                title = $(this).find(".thumbz > h2").text()
                thumb = $(this).find(".thumbz > img").attr("src")
                link = $(this).attr("href")
                id = link.replace(`${anime_url}anime/`, "")
            })

            uploaded_on = $(this).find(".newnime").text()
            episode = $(this).find(".epz").text().replace(" ", "")
            day_updated = $(this).find(".epztipe").text().replace(" ", "")
            on_going.push({
                title,
                id,
                thumb,
                episode,
                uploaded_on,
                day_updated,
                link,
            })
        })

        element
        .children().eq(0).find("ul > li").each(function () {
            $(this).find(".thumb > a").filter(function () {
                title = $(this).find(".thumbz > h2").text()
                thumb = $(this).find(".thumbz > img").attr("src")
                link = $(this).attr("href")
                id = link.replace(`${anime_url}anime/`, "")
            })

            uploaded_on = $(this).find(".newnime").text()
            episode = $(this).find(".epz").text().replace(" ", "")
            score = parseFloat($(this).find(".epztipe").text().replace(" ", ""))
            complete.push({
                title,
                id,
                thumb,
                episode,
                uploaded_on,
                day_updated,
                link,
            })
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                ongoing: on_going,
                complete
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

const complateAnime = async(req, res, next) => {
    try {
        let page = req.params.page
        page = page ? (page == 0 ? 1 : page) : 1
        let episode, uploaded_on, thumb, title, link, id
        let animeList = []

        const response = await client(anime_url).get(`complete-anime/${page}`)
        const $ = cheerio.load(response.data)
        const element = $(".venz")

        element
        .children().eq(0).find("ul > li").each(function () {
          $(this)
            .find(".thumb > a").filter(function () {
                title = $(this).find(".thumbz > h2").text()
                thumb = $(this).find(".thumbz > img").attr("src")
                link = $(this).attr("href")
                id = link.replace(`${anime_url}anime/`, "")
            })

            uploaded_on = $(this).find(".newnime").text()
            episode = parseInt($(this).find(".epz").text().replace(" ", ""))
            score = parseFloat($(this).find(".epztipe").text().replace(" ", ""))
            animeList.push({
                title,
                id,
                thumb,
                episode,
                uploaded_on,
                score,
                link,
            })
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                anime: animeList
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

const ongoingAnime = async(req, res, next) => {
    try {
        let page = req.params.page
        page = page ? (page == 0 ? 1 : page) : 1
        let episode, uploaded_on, day_updated, thumb, title, link, id
        let animeList = []

        const response = await client(anime_url).get(`ongoing-anime/${page}`)
        const $ = cheerio.load(response.data)
        const element = $(".venz")

        element
        .children().eq(0).find("ul > li").each(function () {
            $(this)
                .find(".thumb > a").filter(function () {
                    title = $(this).find(".thumbz > h2").text()
                    thumb = $(this).find(".thumbz > img").attr("src")
                    link = $(this).attr("href")
                    id = link.replace(`${anime_url}anime/`, "")
            })

            uploaded_on = $(this).find(".newnime").text()
            episode = $(this).find(".epz").text().replace(" ", "")
            day_updated = $(this).find(".epztipe").text().replace(" ", "")
            animeList.push({
                title,
                id,
                thumb,
                episode,
                uploaded_on,
                day_updated,
                link,
            })
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                anime: animeList
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

const scheduleAnime = async(req, res, next) => {
    try {
        let day,anime_name, link, id
        let animeList = []
        let scheduleList = []

        const response = await client(anime_url).get(`jadwal-rilis/`)
        const $ = cheerio.load(response.data)
        const element = $(".kgjdwl321")

        element.find(".kglist321").each(function () {
            day = $(this).find("h2").text()
            animeList = []
            $(this)
                .find("ul > li").each(function () {
                    anime_name = $(this).find("a").text()
                    link = $(this).find("a").attr("href")
                    id = link.replace(anime_url + "anime/", "")
                    animeList.push({ anime_name, id, link })
            })
            
            scheduleList.push({ day, animeList })
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                schedule: scheduleList
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

const genreList = async(req, res) => {
    try {
        let genreList = []
        const response = await client(anime_url).get(`genre-list/`)
        const $ = cheerio.load(response.data)
        const element = $(".genres")

        element.find("li > a").each(function (i, el) {
            let object = {}
            object.genre_name = $(el).text()
            object.id = $(el).attr("href").replace("/genres/", "")
            object.link = anime_url + $(el).attr("href")
            object.image_link = ImageList[i]
            genreList.push(object)
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                genre: genreList
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

const genreDetail = async(req, res, next) => {
    try {
        const id = req.params.id
        let page = req.params.page
        page = page ? (page == 0 ? 1 : page) : 1
        let animeList = []
        let genre_name, genre_link, genre_id

        const response = await client(anime_url).get(`genres/${id}/page/${page}`)
        const $ = cheerio.load(response.data)
        const element = $(".page")
        
        element.find(".col-md-4").each(function () {
            object = {}
            object.anime_name = $(this).find(".col-anime-title").text()
            object.thumb = $(this).find('div.col-anime-cover > img').attr('src')
            object.link = $(this).find(".col-anime-title > a").attr("href")
            object.id = $(this)
            .find(".col-anime-title > a").attr("href").replace(`${anime_url}anime`, "")
            object.studio = $(this).find(".col-anime-studio").text()
            object.episode = $(this).find(".col-anime-eps").text()
            object.score = parseFloat($(this).find(".col-anime-rating").text())
            object.release_date = $(this).find(".col-anime-date").text()

            let genreList = []
            $(this)
            .find(".col-anime-genre > a").each(function () {
                genre_name = $(this).text()
                genre_link = $(this).attr("href")
                genre_id = genre_link.replace(`${anime_url}genres/`, "")
                genreList.push({ genre_name, genre_link, genre_id })
                object.genre_list = genreList
            })

            animeList.push(object)
        })

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: {
                anime: animeList
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

const searchAnime = async(req, res, next) => {
    try {
        const q = req.params.query
        let anime_list = []
        let obj = {}

        const response = await client(anime_url).get(`?s=${q}&post_type=anime`)
        const $ = cheerio.load(response.data)
        const element = $(".page")

        if(element.find("ul > li").length === 0){
            obj.search_results = []
        } else {
            element.find("ul > li").each(function () {
                const genre_list = []

                $(this).find(".set").find("a").each(function () {
                    const genre_result = {
                        genre_title: $(this).text(),
                        genre_link: $(this).attr("href"),
                        genre_id: $(this).attr("href").replace(`${anime_url}genres/`, ""),
                    }

                    genre_list.push(genre_result)
                })

                const results = {
                    thumb: $(this).find("img").attr("src"),
                      title: $(this).find("h2").text(),
                    link: $(this).find("h2 > a").attr("href"),
                    id: $(this).find("h2 > a").attr("href").replace(`${anime_url}anime/`, ""),
                    status: $(this).find(".set").eq(1).text().replace("Status : ", ""),
                    score: parseFloat(
                        $(this).find(".set").eq(2).text().replace("Rating : ", "")
                    ),
                  genre_list,
                }

                anime_list.push(results)
                obj.search_results = anime_list

            })
        }

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: obj
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
    home,
    complateAnime,
    ongoingAnime,
    scheduleAnime,
    genreList,
    genreDetail,
    searchAnime
}