require('dotenv').config()
const entity = 'portal'

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

module.exports.fetchPortals = () => {
  const output = {}
  return new Promise(function (resolve) {
    const knex = new Knex(config)
    knex(entity)
      .select()
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