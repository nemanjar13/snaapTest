require('dotenv').config()
const { createRide, fetchRide, fetchRides, updateRide } = require('./../repositories/ride-repository')
const { fetchUser } = require('./../repositories/user-repository')

module.exports.bookRide = async (request, callback) => {
  try {

    const uid = request.auth
    const query = { uuid: uid.uuid }
    const userInfo = await fetchUser(query)
    const response = {}
    if (userInfo.error) {
      response.error = true
      response.msg = 'NOTEXIST: $[1],User'
      callback(response)
    } else {
      response.error = false
      response.msg = 'VALID'
      const user = userInfo.data
      const body = request.body
      const data = {
        user_id: user.id,
        pod_id: body.pod_id,
        source_portal_id: body.source_portal_id,
        destination_portal_id: body.destination_portal_id,
        status: 0
      }
      const rideInfo = await createRide(data)

      if (rideInfo.error) {
        response.error = true
        response.msg = 'OOPS'
      } else {
        response.error = false
        response.msg = 'INSERTED'
        response.data = {
          ride: {
            id: rideInfo.data,
            user_id: user.user_id,
            pod_id: data.pod_id,
            source_portal_id: data.source_portal_id,
            destination_portal_id: data.destination_portal_id,
            status: 0
          }
        };
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

module.exports.getRides = async (request, callback) => {
  try {
    const response = {}
    const uid = request.auth
    const query = { uuid: uid.uuid }
    const userInfo = await fetchUser(query)

    if (userInfo.error) {
      response.error = true
      response.msg = 'NOTEXIST: $[1],User'
      callback(response)
    } else {
      response.error = false
      response.msg = 'VALID'
      const user = userInfo.data
      
      const query = { user_id: user.id}

      const ridesInfo = await fetchRides(query)
      if (ridesInfo.error) {
        response.error = true
        response.msg = 'NOTEXIST: $[1],Rides'
      } else {
        response.error = false
        response.msg = 'VALID'
        response.data = ridesInfo.data
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

module.exports.getRide = async (request, callback) => {
  try {
    const response = {}
    const query = { id: request.params.id }
    const rideInfo = await fetchRide(query)
    if (rideInfo.error) {
      response.error = true
      response.msg = 'NOTEXIST: $[1],Ride'
    } else {
      response.error = false
      response.msg = 'VALID'
      response.data = rideInfo.data
    }
    callback(response)
  } catch (err) {
    err.error = true
    err.msg = 'OOPS'
    console.error(err)
    callback(err)
  }
}

module.exports.rateRideCleanliness = async (request, callback) => {
  try {
    const response = {}
    const body = request.body
    const query = { id: request.params.id }
    const rideInfo = await fetchRide(query)
    if (rideInfo.error) {
      response.error = true
      response.msg = 'NOTEXIST: $[1],Ride'
    } else {
      const data = {}
      data.rating = body.rating
      data.clean = body.clean
      data.status = 2
      const rideInfo = await updateRide(data, query)
      if (rideInfo.error) {
        response.error = true
        response.msg = 'OOPS'
      } else {
        response.error = false
        response.msg = 'UPDATE'
        response.data = data
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

module.exports.rideStatus = async (request, callback) => {
  try {
    const response = {}
    const body = request.body
    const query = { id: request.params.id }    

    const rideInfo = await fetchRide(query)
    if (rideInfo.error) {
      response.error = true
      response.msg = 'NOTEXIST: $[1],Ride'
      callback(response)
    } else {
      const data = {}
      data.status = rideInfo.status === 0 ? 1 : 2
      const rideInfo2 = await updateRide(data, query)
      if (rideInfo2.error) {
        response.error = true
        response.msg = 'OOPS'
      } else {
        response.error = false
        response.msg = 'UPDATE'
        response.data = data
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
