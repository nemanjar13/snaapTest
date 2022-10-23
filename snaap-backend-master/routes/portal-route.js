const express = require('express')
const router = express.Router()
const { routeAuthetication } = require('./../services/user-service')
const { getPortals } = require('./../services/portal-service')
const { ctrlHandler } = require('./../utils/error-handler')

router.get('/portals', routeAuthetication, (req, res) => {
  getPortals(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.send(message)
    })
  })
})

module.exports = router
