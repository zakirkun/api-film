const cheerio = require('cheerio')
const client = require('./client')

const _batchQualityFunction = (num, res) => {
    const $ = cheerio.load(res)
    const element = $(".download").find(".batchlink")
    const download_links = []
    let response

    element.find("ul").filter(function () {
        const quality = $(this).find("li").eq(num).find("strong").text()
        const size = $(this).find("li").eq(num).find("i").text()

        // console.log(quality)
        let _result = []
        $(this)
            .find("li")
            .eq(num)
            .find("a").each(function () {
            
            const _list = {
                host: $(this).text(),
                link: $(this).attr("href"),
            }

            download_links.push(_list)
        })

        response = { quality, size, download_links }
    })

    return response
}

const _getEpisode = async(url) => {
    try {
        const response = await client(url).get()
        const $ = cheerio.load(response.data)

        let source1 = $.html().search('"file":')
        let source2 = $.html().search("'file':")

        if (source1 !== -1) {
            const end = $.html().indexOf('","');
            return $.html().substring(source1 + 8, end)
        } else if (source2 !== -1) {
            const end = $.html().indexOf("','");
            return $.html().substring(source2 + 8, end)
        }

        const _url = $('body > #mediaplayer > source').attr('src')
        return _url || null
    } catch (error) {
        console.log(error)
        return null
    }
}

const _epsQualityFunction = (num, res) => {
    const $ = cheerio.load(res)
    const element = $(".download")
    const download_links = []
    let response

    element.find("ul").filter(function () {
        const quality = $(this).find("li").eq(num).find("strong").text()
        const size = $(this).find("li").eq(num).find("i").text()

        $(this).find("li").eq(num).find("a").each(function () {
            const _list = {
                host: $(this).text(),
                link: $(this).attr("href"),
            }

            download_links.push(_list)
            response = { quality, size, download_links }
        })
    })

    return response
}

const _notFoundQualityHandler = (num, res) => {
    const $ = cheerio.load(res)
    const download_links = []
    const element = $('.download')
    let response

    element.filter(function(){
        if($(this).find('.anime-box > .anime-title').eq(0).text() === ''){
            $(this).find('.yondarkness-box').filter(function(){
                const quality = $(this).find('.yondarkness-title').eq(num).text().split('[')[1].split(']')[0]
                const size = $(this).find('.yondarkness-title').eq(num).text().split(']')[1].split('[')[1]
                
                $(this).find('.yondarkness-item').eq(num).find('a').each((idx,el) => {
                    const _list = {
                        host: $(el).text(),
                        link: $(el).attr("href"),
                    }
                
                    download_links.push(_list)
                    response = { quality, size, download_links }
                })
            })
        }else{
            $(this).find('.anime-box').filter(function(){
                const quality = $(this).find('.anime-title').eq(num).text().split('[')[1].split(']')[0];
                const size = $(this).find('.anime-title').eq(num).text().split(']')[1].split('[')[1];
                
                $(this).find('.anime-item').eq(num).find('a').each((idx,el) => {
                    const _list = {
                        host: $(el).text(),
                        link: $(el).attr("href"),
                    }

                    download_links.push(_list)
                    response = { quality, size, download_links }
                })
            })
        }
    })

    return response
}

module.exports = {
    _batchQualityFunction,
    _getEpisode,
    _epsQualityFunction,
    _notFoundQualityHandler
}