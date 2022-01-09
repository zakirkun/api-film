const axios = require('axios')

const client = (url) => {
    return axios.create({ 
        baseURL: url, 
        timeout: 5000,
        headers: {
            'Accept': 'application/vnd.GitHub.v3+json',
            'X-Forwarded-For': '104.21.77.107'
        }
    })
}

module.exports = client