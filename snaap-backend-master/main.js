require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const http = require('http').Server(app)
const cors = require('cors')

app.use(cors())
app.use(express.raw({ limit: '5mb' }))
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ limit: '5mb', extended: true }))

app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/', function (request, response, next) {
  if (process.env.PROD === 'true') {
    console.log(`IP: ${request.connection.remoteAddress} Method: ${request.method} Route: ${request.originalUrl}`)
  } else {
    console.log(`IP: ${request.connection.remoteAddress} Method: ${request.method} Route: ${request.originalUrl} Body: ` + JSON.stringify(request.body))
  }
  next()
})

app.use('/api/', require('./routes/user-route.js'))
app.use('/api/', require('./routes/portal-route.js'))
app.use('/api/', require('./routes/ride-route.js'))

app.use(function (req, res, next) {
  res.status(404)
  res.send('404: File Not Found')
})

http.listen(process.env.PORT, function () {
  console.log('Snapp Rider server has been started at ' + process.env.PORT + '!')
})
