require('dotenv').config()
const needle = require('needle')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')
const privateKey = fs.readFileSync('key/oauth-private.key')
const publicKey = fs.readFileSync('key/oauth-public.key')
const AWS = require('aws-sdk')

module.exports.getFacebookUserInfo = (fields, accessToken) => {
  const result = {}
  return new Promise(function (resolve) {
    needle.get(process.env.FB_AUTH_URL + fields + '&access_token=' + accessToken, function (error, response) {
      if (!error && response.statusCode === 200 && response.body.email != null && response.body.email != null) {
        result.error = false
        result.data = response.body
      } else {
        result.error = true
        result.data = response.body
        result.msg = response.body.error.message
      }
      console.log(JSON.stringify(result))
      resolve(result)
    })
  })
}

module.exports.getGoogleUserinfo = (accessToken) => {
  const result = {}
  return new Promise(function (resolve) {
    needle.get(process.env.GOOGLE_AUTH_URL + accessToken, function (error, response) {
      if (!error && response.statusCode === 200) {
        result.error = false
        result.data = response.body
      } else {
        result.error = true
        result.data = response.body
      }
      resolve(result)
    })
  })
}

module.exports.generateUniqueString = function (length, type) {
  const response = {}
  try {
    let result = ''
    let chars
    if (type === 'numeric') {
      chars = '0123456789'
    } else {
      chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
    for (let i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))]
    response.error = false
    response.data = result
    return response
  } catch (err) {
    response.error = true
    return response
  }
}

module.exports.hashPassword = function (password, salt) {
  const response = {}
  return new Promise(function (resolve) {
    bcrypt.hash(password, parseInt(salt), function (err, hash) {
      if (err) {
        response.error = true
      } else {
        response.error = false
        response.data = hash
      }
      resolve(response)
    })
  })
}

module.exports.comparePassword = function (password, hash) {
  return new Promise(function (resolve) {
    bcrypt.compare(password, hash, function (err, result) {
      const response = {}
      if (err) {
        response.error = true
      } else {
        if (result) {
          response.error = false
        } else {
          response.error = true
        }
      }
      resolve(response)
    })
  })
}

module.exports.generateToken = function (data) {
  return new Promise(function (resolve) {
    jwt.sign(data, privateKey, { algorithm: 'RS256' }, (err, token) => {
      const response = {}
      if (err) {
        response.error = true
      } else {
        response.error = false
        response.data = token
      }
      resolve(response)
    })
  })
}

module.exports.getPayloadFromToken = function (token) {
  return new Promise(function (resolve) {
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, payload) => {
      const response = {}
      if (err) {
        response.error = true
      } else {
        response.error = false
        response.data = payload
      }
      resolve(response)
    })
  })
}

module.exports.generateUUID = function () {
  const uuid = uuidv4()
  return uuid
}

module.exports.fileUpload = (image, type) => {
  const response = {}
  const s3Bucket = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
    signatureVersion: 'v4',
    apiVersion: '2006-03-01'
  })
  const buf = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64')
  const data = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: this.generateUUID(),
    Body: buf,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: type
  }
  return new Promise(function (resolve) {
    s3Bucket.upload(data)
      .promise()
      .then(result => {
        response.error = false
        response.data = { location: result.Location }
        resolve(response)
      }).catch((err) => {
        console.error(err)
        response.error = true
        response.data = err
        resolve(response)
      })
  })
}

module.exports.fileUploadMultiPart = (buffer, originalname, encoding, mimetype) => {
  const response = {}
  const s3Bucket = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION,
    signatureVersion: 'v4',
    apiVersion: '2006-03-01'
  })
  const data = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: originalname,
    Body: buffer,
    ACL: 'public-read',
    ContentEncoding: encoding,
    ContentType: mimetype
  }
  return new Promise(function (resolve) {
    s3Bucket.upload(data)
      .promise()
      .then(result => {
        response.error = false
        response.data = { location: result.Location }
        resolve(response)
      }).catch((err) => {
        console.error(err)
        response.error = true
        response.data = err
        resolve(response)
      })
  })
}
