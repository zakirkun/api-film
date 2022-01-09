const axios = require('axios')

const client = (url) => {
    return axios.create({ 
        baseURL: url, 
        timeout: 5000,
        headers: {
            'Accept': 'application/json',
            'X-Forwarded-For': '104.21.77.107',
            'Referer': 'https://otakudesu.info/'
        }
    })
}

module.exports = client