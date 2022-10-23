require('dotenv').config()
const user = 'user'

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

module.exports.createUser = (data) => {
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex(user)
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

module.exports.fetchUser = (data) => {
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex(user)
      .select()
      .where(data)
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

module.exports.updateUser = (data, condition) => {
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex(user)
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
        console.log(err)
        err.error = true
        resolve(err)
      })
      .finally(() => {
        knex.destroy()
      })
  })
}
