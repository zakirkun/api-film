const axios = require('axios')

const client = (url) => {
    return axios.create({ 
        baseURL: url, 
        timeout: 5000,
        headers: {
            'Accept': 'application/vnd.GitHub.v3+json',
        }
    })
}

module.exports = client