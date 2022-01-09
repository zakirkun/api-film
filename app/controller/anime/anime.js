const cheerio = require('cheerio')
const client = require('../../lib/client')

const { 
    anime_url
} = require('../../lib/consts')

const {
    _batchQualityFunction,
    _epsQualityFunction,
    _notFoundQualityHandler,
    _getEpisode
} = require('../../lib/animeHelper')

const detailAnime = async(req, res, next) => {
    try {
        let genre_name, genre_id, genre_link
        const id = req.params.id
        let genreList = []
        let object = {}
        let episode_list = []

        const response = await client(anime_url).get(`anime/${id}`)
        const $ = cheerio.load(response.data)
        
        const detailElement = $(".venser").find(".fotoanime")

        object.thumb = detailElement.find("img").attr("src")
        object.anime_id = req.params.id
        object.synopsis = $("#venkonten > div.venser > div.fotoanime > div.sinopc").find("p").text()
        detailElement.find(".infozin").filter(function () {
            object.title = $(this)
                .find("p").children().eq(0).text().replace("Judul: ", "")
            
            object.japanase = $(this)
                .find("p")
                .children()
                .eq(1)
                .text()
                .replace("Japanese: ", "")

            object.score = parseFloat(
                $(this).find("p").children().eq(2).text().replace("Skor: ", "")
            )

            object.producer = $(this)
                .find("p")
                .children()
                .eq(3)
                .text()
                .replace("Produser:  ", "")

            object.type = $(this)
                .find("p")
                .children()
                .eq(4)
                .text()
                .replace("Tipe: ", "")
            
            object.status = $(this)
                .find("p")
                .children()
                .eq(5)
                .text()
                .replace("Status: ", "")
            
            object.total_episode = parseInt(
                $(this).find("p").children().eq(6).text().replace("Total Episode: ", "")
            )

            object.duration = $(this)
                .find("p")
                .children()
                .eq(7)
                .text()
                .replace("Durasi: ", "")

            object.release_date = $(this)
                .find("p")
                .children()
                .eq(8)
                .text()
                .replace("Tanggal Rilis: ", "")

            object.studio = $(this)
                .find("p")
                .children()
                .eq(9)
                .text()
                .replace("Studio: ", "")

            $(this)
                .find("p")
                .children()
                .eq(10)
                .find("span > a")
                .each(function () {
                    genre_name = $(this).text()
                    genre_id = $(this)
                        .attr("href")
                        .replace(`${anime_url}genres/`, "")
                    genre_link = $(this).attr("href")
                    genreList.push({ genre_name, genre_id, genre_link })

                object.genre_list = genreList
            })
        })
        
        $("#venkonten > div.venser > div:nth-child(8) > ul > li").each(
            (i, element) => {
                const dataList = {
                    title: $(element).find("span > a").text(),
                    id: $(element)
                        .find("span > a")
                        .attr("href")
                        .replace(`${anime_url}`, ""),
                    link: $(element).find("span > a").attr("href"),
                    uploaded_on: $(element).find(".zeebr").text(),
              }

              episode_list.push(dataList)
            }
        )

        object.episode_list = episode_list.length === 0 ? [
            {
              title: "Masih kosong gan",
              id: "Masih kosong gan",
              link: "Masih kosong gan",
              uploaded_on: "Masih kosong gan",
            },
        ] : episode_list

        const batch_link = {
            id:
                $("div.venser > div:nth-child(6) > ul").text().length !== 0 ? $("div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a")
                    .attr("href")
                    .replace(`${anime_url}batch/`, "")
                : "Masih kosong gan",
            link:
                $("div.venser > div:nth-child(6) > ul").text().length !== 0? $("div.venser > div:nth-child(6) > ul > li > span:nth-child(1) > a").attr("href")
                : "Masih kosong gan",
        }

        const empty_link = {
            id: "Masih kosong gan",
            link: "Masih kosong gan",
        }

        object.batch_link = batch_link

        res.status(200).json({
            status: true,
            message: 'Success Fetch Data',
            data: object
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

const batchAnime = async(req, res, next) => {
    try {

        const id = req.params.id
        const obj = {}

        const response = await client(anime_url).get(`batch/${id}`)
        const $ = cheerio.load(response.data)
        
        obj.title = $(".batchlink > h4").text()
        let low_quality = _batchQualityFunction(0, response.data)
        let medium_quality = _batchQualityFunction(1, response.data)
        let high_quality = _batchQualityFunction(2, response.data)

        obj.download_list = { low_quality, medium_quality, high_quality }

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

const episodeAnime = async(req, res, next) => {
    try {
        const id = req.params.id
        const obj = {}
        let low_quality
        let medium_quality
        let high_quality
        let mirror1 = []
        let mirror2 = []
        let mirror3 = []

        const response = await client(anime_url).get(`${id}`)
        const $ = cheerio.load(response.data)

        const streamElement = $("#lightsVideo").find("#embed_holder")
        const streamLink = streamElement.find("iframe").attr("src")

        obj.title = $(".venutama > h1").text()
        obj.id = id
        obj.link_stream = await _getEpisode(streamLink)

        $('#embed_holder > div.mirrorstream > ul.m360p > li').each((idx,el)=>{``
            mirror1.push({
                host:$(el).find('a').text().trim(),
                id:$(el).find('a').attr('href'),
            })
        })

        $('#embed_holder > div.mirrorstream > ul.m480p > li').each((idx,el)=>{
            mirror2.push({
                host:$(el).find('a').text().trim(),
                id:$(el).find('a').attr('href'),
            })
        })

        $('#embed_holder > div.mirrorstream > ul.m720p > li').each((idx,el)=>{
            mirror3.push({
                host:$(el).find('a').text().trim(),
                id:$(el).find('a').attr('href'),
            })
        })

        obj.mirror1 = {
            quality:'360p',
            mirrorList: mirror1
        }

        obj.mirror2 = {
            quality:'480p',
            mirrorList:mirror2
        }

        obj.mirror3 = {
            quality:'720p',
            mirrorList:mirror3
        }

        if($('#venkonten > div.venser > div.venutama > div.download > ul > li:nth-child(1)').text() === ''){
            low_quality = _notFoundQualityHandler(0, response.data)
            medium_quality = _notFoundQualityHandler(1, response.data)
            high_quality = _notFoundQualityHandler(2, response.data)
        }else{
            low_quality = _epsQualityFunction(0, response.data)
            medium_quality = _epsQualityFunction(1, response.data)
            high_quality = _epsQualityFunction(2, response.data)
        }

        obj.quality = { low_quality, medium_quality, high_quality }    

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

const mirrorAnime = async(req, res, next) => {
    try {
        const mirror_id = req.body.mirror_id
        const id = req.params.id
        const obj = {}

        const response = await client(anime_url).get(`${id}/${mirror_id}`)
        const $ = cheerio.load(response.data)
        const streamLink = $('#pembed > div > iframe').attr('src')
        
        obj.title = $(".venutama > h1").text()
        obj.id = id 
        obj.streamLink = streamLink
        obj.link_stream = await _getEpisode(streamLink)

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
    detailAnime,
    batchAnime,
    episodeAnime,
    mirrorAnime
}