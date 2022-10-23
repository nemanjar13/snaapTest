const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const { routeAuthetication } = require('./../services/user-service')
const { bookRide, getRide, getRides, rateRideCleanliness, rideStatus } = require('./../services/ride-service')
const { requestHandler, ctrlHandler } = require('./../utils/error-handler')

router.post('/book-ride', routeAuthetication, [
  check('pod_id')
    .isNumeric().withMessage('INVALID: $[1],Pod Id'),
  check('source_portal_id')
    .isNumeric().withMessage('INVALID: $[1],Source Portal Id'),
  check('destination_portal_id')
    .isNumeric().withMessage('INVALID: $[1],Destination Portal Id')
  ], (req, res) => {
  const error = validationResult(req)
  if (error.array().length) {
    requestHandler(error.array(), true, (message) => {
      return res.send(message)
    })
  } else {
    bookRide(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.send(message)
      })
    })
  }
})

router.patch('/rate-ride-cleanliness/:id', routeAuthetication, [
  check('rating').isInt({ min: 1, max: 5 }).withMessage('INVALID_RATING'),
  check('clean').isIn(['Poor', 'Fair', 'Good']).withMessage('INVALID_CLEANLINESS')
  ], (req, res) => {
  const error = validationResult(req)
  if (error.array().length) {
    requestHandler(error.array(), true, (message) => {
      return res.send(message)
    })
  } else {
    rateRideCleanliness(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.send(message)
      })
    })
  }
})

router.get('/fetch-ride/:id', routeAuthetication, (req, res) => {
  getRide(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.send(message)
    })
  })
})

router.get('/fetch-rides', routeAuthetication, (req, res) => {
  getRides(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.send(message)
    })
  })
})

router.patch('/ride-status/:id', routeAuthetication, [
  check('status').isInt({min: 1, max: 2}).withMessage('INVALID_STATUS')
  ], (req, res) => {
  console.log(req.body)
  const error = validationResult(req)
  console.log("error", error)
  if (error.array().length) {
    requestHandler(error.array(), true, (message) => {
      return res.send(message)
    })
  } else {
    rideStatus(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.send(message)
      })
    })    
  }    
})

module.exports = router
