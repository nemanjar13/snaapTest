require('dotenv').config()
const entity = 'ride'

const config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSWD,
    database: process.env.DB_NAME
  },
  pool: {
    min: Number(process.env.DB_POOL_MIN),
    max: Number(process.env.DB_POOL_MAX)
  },
  acquireConnectionTimeout: Number(process.env.DB_TIMEOUT)
}
const Knex = require('knex')

module.exports.createRide = (data) => {
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex(entity)
      .insert(data)
      .then(result => {
        if (result[0] > 0) {
          output.error = false
          output.data = result[0]
        } else {
          output.error = true
        }
        resolve(output)
      })
      .catch((err) => {
        console.error(err)
        err.error = true
        resolve(err)
      })
      .finally(() => {
        knex.destroy()
      })
  })
}

module.exports.fetchRide = (query) => {
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex(entity)
      .select()
      .where(query)
      .then(result => {
        if (result.length === 1) {
          output.error = false
          output.data = result[0]
        } else {
          output.error = true
        }
        resolve(output)
      })
      .catch((err) => {
        err.error = true
        resolve(err)
      })
      .finally(() => {
        knex.destroy()
      })
  })
}

module.exports.fetchRides = (query) => {
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex.select(
      'r.id ',
      'r.pod_id',
      's.address as src_address',
      's.latitude as src_latitude',
      's.longitude as src_longitude',
      'd.address as des_address',
      'd.latitude as des_latitude',
      'd.longitude as des_longitude',
      'r.status'
      ).from('ride as r')
      .join('portal as s', 's.id', 'source_portal_id')
      .join('portal as d', 'd.id', 'destination_portal_id')
      .where(query)
      .whereIn('status', [0, 1])
      .then(result => {
        if (result.length > 0) {
          output.error = false
          output.data = result
        } else {
          output.error = true
        }
        resolve(output)
      })
      .catch((err) => {
        err.error = true
        resolve(err)
      })
      .finally(() => {
        knex.destroy()
      })
  })
}

module.exports.updateRide = (data, condition) => {
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex(entity)
      .update(data)
      .where(condition)
      .then(result => {
        if (result) {
          output.error = false
        } else {
          output.error = true
        }
        resolve(output)
      })
      .catch((err) => {
        console.error(err)
        err.error = true
        resolve(err)
      })
      .finally(() => {
        knex.destroy()
      })
  })
}