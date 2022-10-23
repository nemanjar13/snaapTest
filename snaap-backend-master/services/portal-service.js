require('dotenv').config()
const { fetchPortals } = require('./../repositories/portal-repository')

module.exports.getPortals = async (request, callback) => {
  try {
    const portals = await fetchPortals()
    const response = {}
    if (portals.error) {
      response.error = true
      response.msg = 'NOTEXIST: $[1],Portals'
      callback(response)
    } else {
      response.error = false
      response.msg = 'VALID'
      response.data = portals.data
      callback(response)
    }
  } catch (err) {
    err.error = true
    err.msg = 'OOPS'
    console.error(err)
    callback(err)
  }
}