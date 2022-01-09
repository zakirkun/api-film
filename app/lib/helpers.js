const convertToBanner = (url) => {
    //https://image.tmdb.org/t/p/w185/xbGz8GKZNv824UgsL4cpKV0WMuV.jpg
    return `https://image.tmdb.org/t/p/w533_and_h300_face/${url.split("/")[url.split("/").length - 1]}`
}
  
const getBanner = (url) => {
    return url.split("(")[1].replace(")", "").replace(";", "")
}

const extractId = (link) => {
    const itemExtract = link.split("/")
    return itemExtract[itemExtract.length - 2]
}
  
const isSeries = (link) => {
    const itemExtract = link.split("/")
    return itemExtract[3] == "series"
}

const addHttp = (link) => {
    if (link.search("http") == -1) {
        link = "https:" + link
    }

    return link
}

const ImageList = [
    'https://cdn.myanimelist.net/images/anime/1223/96541.webp',
    'https://cdn.myanimelist.net/images/anime/13/17405.webp',
    'https://cdn.myanimelist.net/images/anime/8/77831.webp',
    'https://cdn.myanimelist.net/images/anime/3/50177.webp',
    'https://cdn.myanimelist.net/images/anime/1122/96435.webp',
    'https://cdn.myanimelist.net/images/anime/5/65187.webp',
    'https://cdn.myanimelist.net/images/anime/11/79410.webp',
    'https://cdn.myanimelist.net/images/anime/11/39717.webp',
    'https://cdn.myanimelist.net/images/anime/13/75587.webp',
    'https://cdn.myanimelist.net/images/anime/1286/99889.webp',
    'https://cdn.myanimelist.net/images/anime/4/75509.webp',
    'https://cdn.myanimelist.net/images/anime/9/11986.webp',
    'https://cdn.myanimelist.net/images/anime/2/73249.webp',
    'https://cdn.myanimelist.net/images/anime/6/20936.webp',
    'https://cdn.myanimelist.net/images/anime/5/50331.webp',
    'https://cdn.myanimelist.net/images/anime/4/84177.webp',
    'https://cdn.myanimelist.net/images/anime/3/67177.webp',
    'https://cdn.myanimelist.net/images/anime/9/9453.webp',
    'https://cdn.myanimelist.net/images/anime/13/33465.webp',
    'https://cdn.myanimelist.net/images/anime/12/76049.webp',
    'https://cdn.myanimelist.net/images/anime/5/43399.webp',
    'https://cdn.myanimelist.net/images/anime/5/87048.webp',
    'https://cdn.myanimelist.net/images/anime/10/73274.webp',
    'https://cdn.myanimelist.net/images/anime/5/75639.webp',
    'https://cdn.myanimelist.net/images/anime/5/73199.webp',
    'https://cdn.myanimelist.net/images/anime/10/77957.webp',
    'https://cdn.myanimelist.net/images/anime/4/39779.webp',
    'https://cdn.myanimelist.net/images/anime/11/89985.webp',
    'https://cdn.myanimelist.net/images/anime/9/77809.webp',
    'https://cdn.myanimelist.net/images/anime/11/49459.webp',
    'https://cdn.myanimelist.net/images/anime/7/76014.webp',
    'https://cdn.myanimelist.net/images/anime/10/71297.webp',
    'https://cdn.myanimelist.net/images/anime/11/33657.webp',
    'https://cdn.myanimelist.net/images/anime/11/75274.webp',
    'https://cdn.myanimelist.net/images/anime/5/71553.webp',
    'https://cdn.myanimelist.net/images/anime/12/73559.webp'
]

module.exports = {
    convertToBanner,
    getBanner,
    extractId,
    isSeries,
    addHttp,
    ImageList
}