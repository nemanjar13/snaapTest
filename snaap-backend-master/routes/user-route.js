const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const { socialLoginService, createUserService, authUserService, routeAuthetication, getProfile, updateProfile, fileUpload, fileUploadMultiPart } = require('./../services/user-service')
const { getPortals } = require('./../services/portal-service')
const { requestHandler, ctrlHandler } = require('./../utils/error-handler')
const fileParser = require('express-multipart-file-parser')

router.post('/social-login', [
  check('type')
    .isIn(['facebook', 'google', 'apple']).withMessage('INVALID: $[1],Type'),
  check('accessToken')
    .isLength({ min: 1 }).withMessage('INVALID: $[1],Access Token')
], (req, res) => {
  const error = validationResult(req)
  if (error.array().length) {
    requestHandler(error.array(), true, (message) => {
      return res.send(message)
    })
  } else {
    socialLoginService(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.send(message)
      })
    })
  }
})

router.post('/sign-up', [
  check('firstname')
    .isLength({ min: 2, max: 55 }).withMessage('TEXT_LIMIT: $[1] $[2] $[3],Firstname,2,55'),
  check('lastname')
    .isLength({ min: 2, max: 55 }).withMessage('TEXT_LIMIT: $[1] $[2] $[3],Lastname,2,55')
    .optional({ nullable: true }),
  check('email')
    .isEmail().withMessage('INVALID: $[1],Email'),
  check('password')
    .isLength({ min: 6, max: 12 }).withMessage('TEXT_LIMIT: $[1] $[2] $[3],Password,6,12')
], (req, res) => {
  const error = validationResult(req)
  if (error.array().length) {
    requestHandler(error.array(), true, (message) => {
      return res.send(message)
    })
  } else {
    createUserService(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.send(message)
      })
    })
  }
})

router.post('/login', [
  check('email')
    .isEmail().withMessage('INVALID: $[1], Email'),
  check('password')
    .isLength({ min: 6, max: 12 }).withMessage('TEXT_LIMIT: $[1] $[2] $[3],Password,6,12')
], (req, res) => {
  const error = validationResult(req)
  if (error.array().length) {
    requestHandler(error.array(), true, (message) => {
      return res.send(message)
    })
  } else {
    authUserService(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.send(message)
      })
    })
  }
})

router.get('/profile', routeAuthetication, (req, res) => {
  getProfile(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.send(message)
    })
  })
})

router.patch('/profile', routeAuthetication, [
  check('firstname')
    .isLength({ min: 2, max: 55 }).withMessage('TEXT_LIMIT: $[1] $[2] $[3],Firstname,2,55')
    .optional(),
  check('lastname')
    .isLength({ min: 2, max: 55 }).withMessage('TEXT_LIMIT: $[1] $[2] $[3],Lastname,2,55')
    .optional(),
  check('phone')
    .isNumeric({ min: 10, max: 15 }).withMessage('INVALID: $[1],Phone')
    .optional(),
  check('email')
    .isEmail().withMessage('INVALID: $[1],Email')
    .optional(),
  check('photo')
    .isURL().withMessage('INVALID: $[1],Photo')
    .optional(),
  check('audio')
    .isURL().withMessage('INVALID: $[1],Audio')
    .optional(),
  check('cardnumber')
    .isLength({ min: 16, max: 16 }).withMessage('TEXT_LIMIT: $[1] $[2] $[3],Card Number,16,16')
    .optional(),
  check('expirationdate')
    .isLength({ min: 7, max: 7 }).withMessage('TEXT_LIMIT: $[1] $[2] $[3],Expiration Date,7,7')
    .optional(),    
  check('cardcvv')
    .isLength({ min: 3, max: 3 }).withMessage('TEXT_LIMIT: $[1] $[2] $[3],Card CVV,3,3')
    .optional(),
  check('safteyVideo')
    .isBoolean().withMessage('INVALID: $[1],Video Status')
    .optional(),
  check('terms')
    .isBoolean().withMessage('INVALID: $[1],Terms Status')
    .optional(),
  check('auto_pay')
    .isBoolean().withMessage('INVALID: $[1],Auto Pay')
    .optional() 
], (req, res) => {
  updateProfile(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.send(message)
    })
  })
})

router.post('/file', routeAuthetication, [
  check('file')
    .isString().withMessage('INVALID: $[1],BASE64'),
  check('type')
    .isIn(['image/png', 'image/jpeg', 'image/jpg', 'audio/mp3', 'audio/wav', 'audio/aac', 'audio/mpeg', 'video/mp4', 'audio/mp4']).withMessage('INVALID: $[1],File type')
], (req, res) => {
  const error = validationResult(req)
  if (error.array().length) {
    requestHandler(error.array(), true, (message) => {
      return res.send(message)
    })
  } else {
    fileUpload(req, (result) => {
      ctrlHandler(result, (message) => {
        return res.send(message)
      })
    })
  }
})

router.post("/file-multipart", routeAuthetication, fileParser, (req, res) => {
  fileUploadMultiPart(req, (result) => {
    ctrlHandler(result, (message) => {
      return res.send(message)
    })    
  })
});

module.exports = router
