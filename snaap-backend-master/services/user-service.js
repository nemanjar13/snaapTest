require('dotenv').config()
const { getFacebookUserInfo, getGoogleUserinfo, hashPassword, comparePassword, generateToken, generateUUID, getPayloadFromToken, fileUpload, fileUploadMultiPart } = require('./../utils/common')
const { createUser, fetchUser, updateUser } = require('./../repositories/user-repository')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const MEMBERSHIP_AMOUNT = 35000

module.exports.routeAuthetication = async (request, response, next) => {
  try {
    const data = request.headers
    const token = data.authorization !== undefined ? data.authorization.replace('Bearer ', '') : null
    const auth = await getPayloadFromToken(token)
    const response = {}
    if (auth.error) {
      response.error = true
      response.msg = 'UNAUTHORIZED'
      return response.status(401).send(response)
    } else {
      const payload = auth.data
      request.auth = payload
      next()
    }
  } catch (err) {
    err.error = true
    err.msg = 'UNAUTHORIZED'
    console.error(err)
    return response.status(401).send(err)
  }
}

module.exports.socialLoginService = async (request, callback) => {

  try {
    const body = request.body
    const response = {}
    const accessToken = body.accessToken
    const fields = 'id,name,email,picture'
    let userInfo
    if (body.type === 'facebook') {
      userInfo = await getFacebookUserInfo(fields, accessToken)
    } else if (body.type === 'google') {
      userInfo = await getGoogleUserinfo(accessToken)
    } else if (body.type === 'apple') {
        userInfo = {data: body.userData}
    }

    if (userInfo.error) {
      response.error = true
      response.msg = 'UNAUTHORIZED'
    } else {
      const uuid = generateUUID()
      const data = {
        firstname: userInfo.data.name,
        lastname: userInfo.data.family_name,
        email: Buffer.from(userInfo.data.email.toLowerCase()).toString('base64'),
        login_type: body.type,
        photo: body.type === 'google' ? userInfo.data.picture : body.type === 'facebook' ? userInfo.data.picture.data.url : '',
        uuid: uuid
      }
      const checkEmail = await fetchUser({ email: Buffer.from(userInfo.data.email.toLowerCase()).toString('base64') })
      if (checkEmail.error) {
        const user = await createUser(data)
        if (user.error) {
          response.error = true
          response.msg = 'OOPS'
        } else {

          const customer = await stripe.customers.create({email: body.email})
          const data = {customer: customer.id }

          const query = { uuid: uuid }
          const updateUserInfo = await updateUser(data, query)
          if (updateUserInfo.error) {
            response.error = true
            response.msg = 'OOPS'
          } else {
            response.error = false
            response.msg = 'INSERTED'
            response.data = {
              accessToken: (await generateToken({ uuid: uuid })).data,
              customer: customer
            }
          }         
       
        }
      } else if (checkEmail.data.login_type === body.type) {
        response.error = false
        response.msg = 'VALID'
        response.data = {
          accessToken: (await generateToken({ uuid: checkEmail.data.uuid })).data
        }
      } else {
        response.error = true
        var loginType = {"google": "Google", "facebook": "FB", "apple": "Apple", "manual": "Email"}
        response.msg = 'TRY_LOGIN: $[1],' + loginType[checkEmail.data.login_type]
      }
      callback(response)
    }
  } catch (err) {
    err.error = true
    err.msg = 'OOPS'
    console.error(err)
    callback(err)
  }
}

module.exports.createUserService = async (request, callback) => {
  try {
    const response = {}
    const body = request.body
    const password = await hashPassword(body.password, process.env.SALT)
    const uuid = generateUUID()
    const data = {
      firstname: body.firstname,
      lastname: body.lastname,
      email: Buffer.from(body.email.toLowerCase()).toString('base64'),
      password: password.data,
      login_type: 'manual',
      uuid: uuid
    }
    console.log("fetch user", data.email)
    const checkEmail = await fetchUser({ email: data.email })
    if (checkEmail.error && !password.error) {
      const user = await createUser(data)
      if (user.error) {
        response.error = true
        response.msg = 'OOPS'
      } else {

        const customer = await stripe.customers.create({email: body.email})
        const data = {customer: customer.id }

        const query = { uuid: uuid }
        const updateUserInfo = await updateUser(data, query)
        if (updateUserInfo.error) {
          response.error = true
          response.msg = 'OOPS'
        } else {
          response.error = false
          response.msg = 'INSERTED'
          response.data = {
            accessToken: (await generateToken({ uuid: uuid })).data,
            customer: customer
          }
        }        

      }
    } else {
      response.error = true
      if (!checkEmail.error) {
        response.msg = 'EXIST: $[1],Email'
      } else {
        response.msg = 'OOPS'
      }
    }
    callback(response)
  } catch (err) {
    err.error = true
    err.msg = 'OOPS'
    console.error(err)
    callback(err)
  }
}

module.exports.authUserService = async (request, callback) => {
  try {
    const response = {}
    const body = request.body
    const password = body.password
    const checkEmail = await fetchUser({ email: Buffer.from(body.email.toLowerCase()).toString('base64') })
    const userInfo = checkEmail.error ? checkEmail.data : checkEmail.data
    if (checkEmail.error) {
      console.log("checkEmail.error", checkEmail)
      response.error = true
      response.msg = 'PASSWORD'
    } else {
      console.log("checkEmail", checkEmail.data)
      const userPassword = checkEmail.data.password
      const comPassword = await comparePassword(password, userPassword)
      if (comPassword.error) {
        response.error = true
        response.msg = 'PASSWORD'
      } else {
        response.error = false
        response.msg = 'VALID'
        response.data = {
          accessToken: (await generateToken({ uuid: userInfo.uuid })).data
        }
      }
    }
    callback(response)
  } catch (err) {
    err.error = true
    err.msg = 'OOPS'
    console.error(err)
    callback(err)
  }
}

module.exports.getProfile = async (request, callback) => {
  try {
    const uid = request.auth
    const query = { uuid: uid.uuid }
    const userInfo = await fetchUser(query)
    const response = {}
    if (userInfo.error) {
      response.error = true
      response.msg = 'NOTEXIST: $[1],Profile'
      callback(response)
    } else {
      response.error = false
      response.msg = 'VALID'
      const data = userInfo.data
      /*if(data.cell) {
        data.cell = Buffer.from(data.cell, 'base64').toString('ascii')
      }*/
      response.data = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: Buffer.from(data.email, 'base64').toString('ascii'),
        cell: data.cell,
        photo: data.photo,
        type: data.login_type,
        audio: data.audio_of_name,  
        is_profile_updated: data.is_profile_updated,
        is_payment_added: data.is_payment_added,
        watched_safety_video: data.watched_safety_video,
        signed_agreement: data.signed_agreement
      }
      callback(response)
    }
  } catch (err) {
    err.error = true
    err.msg = 'OOPS'
    console.error(err)
    callback(err)
  }
}

module.exports.updateProfile = async (request, callback) => {
  try {
    const uid = request.auth
    const body = request.body
    const query = { uuid: uid.uuid }
    const userInfo = await fetchUser(query)
    const response = {}
    if (userInfo.error) {
      response.error = true
      response.msg = 'NOTEXIST: $[1],Profile'
      callback(response)
    } else {
      
      const data = {}

      if(body.cardnumber && body.expirationdate && body.cardcvv){
        
        const card = {
          "number": body.cardnumber,
          "exp_month": body.expirationdate.split("/")[0],
          "exp_year": body.expirationdate.split("/")[1],
          "cvc": body.cardcvv
        }

        const token = await stripe.tokens.create({ card: card });

        data.credit_card = JSON.stringify({token: token.id})

      }else{
        const userFields = {
          firstname: 'firstname',
          lastname: 'lastname',
          email: 'email',
          cell: 'cell',
          photo: 'photo',
          audio: 'audio_of_name',
          safteyVideo: 'watched_safety_video',
          terms: 'signed_agreement',
          auto_pay: 'auto_pay'
        }
        
        Object.keys(userFields).map((ele) => {
          if (body[ele] !== null || body !== undefined) {
            data[userFields[ele]] = body[ele]
          }
        })
        if (data.email) {
          data.email = Buffer.from(data.email.toLowerCase()).toString('base64')
        }
        /*if (data.cell) {
          data.cell = Buffer.from(data.cell).toString('base64')
        }*/
        data.is_profile_updated = 1

      }
      var credit_card = userInfo.data.credit_card
      if(data.signed_agreement && data.auto_pay && credit_card){
        const charge = await stripe.charges.create({
          amount: MEMBERSHIP_AMOUNT,
          currency: 'usd',
          source: credit_card.token,
          description: 'Charge by SNAAP Transportation at https://ridesnaap.com',
        });
        data.is_payment_added = 1
        data.membership_paid = MEMBERSHIP_AMOUNT
      }

      const updateUserInfo = await updateUser(data, query)

      if (updateUserInfo.error) {
        response.error = true
        response.msg = 'OOPS'
      } else {
        response.error = false
        response.msg = 'UPDATE'
      }
      callback(response)
    }
  } catch (err) {
    err.error = true
    err.msg = err.raw.message
    console.error(err)
    callback(err)
  }
}

module.exports.fileUpload = async (request, callback) => {
  const uid = request.auth
  const query = { uuid: uid.uuid }
  const response = {}
  try {
    const body = request.body
    const base64Image = body.file
    const imageType = body.type
    const upload = await fileUpload(base64Image, imageType)
    if (upload.error) {
      response.error = true
      response.msg = 'NO_DATA'
    } else {
      response.error = false
      response.data = { url: upload.data.location }
      response.msg = 'VALID'
    }
    const updateUserInfo = await updateUser({audio_of_name: upload.data.location}, query)

    callback(response)
  } catch (err) {
    err.error = true
    err.msg = 'OOPS'
    console.error(err)
    callback(err)
  }
}

module.exports.fileUploadMultiPart = async (request, callback) => {
  const response = {}
  try {
    const {fieldname, originalname, encoding, mimetype, buffer} = request.files[0];
    const upload = await fileUploadMultiPart(buffer, request.auth.uuid, encoding, mimetype)
    if (upload.error) {
      response.error = true
      response.msg = 'NO_DATA'
    } else {
      response.error = false
      response.data = { url: upload.data.location }
      response.msg = 'VALID'
    }
    callback(response)
  } catch (err) {
    err.error = true
    err.msg = 'OOPS'
    console.error(err)
    callback(err)
  }
}