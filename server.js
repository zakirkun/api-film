require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const router = require('./router/index')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use('/api', router)

app.get('/', (req, res) => {
    res.json({
        status: true,
        message: 'Hello!'
    })
})

app.use('*', (req, res) => {
    res.status(404).json({
        status: false,
        message: 'Error 404 Not Found!'
    })
})

const PORT = process.env.PORT || 5000 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})