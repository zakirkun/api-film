const axios = require('axios')

const client = (url) => {
    return axios.create({ 
        baseURL: url, 
        timeout: 5000,
        headers: {
            'Accept': 'application/json',
            'Referer': 'https://otakudesu.info/'
        }
    })
}

module.exports = client