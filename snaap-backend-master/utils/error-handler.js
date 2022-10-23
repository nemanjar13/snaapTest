const Localize = require('localize')
const error = require('./../utils/error-msg')
const paramsErrorMsg = new Localize(error.PARAM_ERROR)
const ctrlErrorMsg = new Localize(error.ERROR)
const ctrlSuccessMsg = new Localize(error.SUCCESS)

module.exports.requestHandler = (error, status, callback) => {
  const message = {}
  try {
    paramsErrorMsg.setLocale('default')
    const errorMessage = error[0].msg
    const msg = errorMessage.split(',')
    message.error = status
    message.msg = paramsErrorMsg.translate(msg[0], msg[1], msg[2], msg[3])
  } catch (err) {
    message.error = true
    message.msg = 'Oops something went wrong'
  }
  callback(message)
}

module.exports.ctrlHandler = (data, callback) => {
  const message = {}
  const errorMessage = data.msg
  const msg = errorMessage.split(',')
  if (data.error === true) {
    try {
      ctrlErrorMsg.setLocale('default')
      message.error = data.error
      message.msg = ctrlErrorMsg.translate(msg[0], msg[1], msg[2], msg[3])
      message.data = data.data
    } catch (err) {
      message.error = data.error
      message.msg = 'Oops something went wrong'
    }
  } else {
    try {
      ctrlSuccessMsg.setLocale('default')
      message.error = data.error
      message.msg = ctrlSuccessMsg.translate(msg[0], msg[1], msg[2], msg[3])
      message.data = data.data
    } catch (err) {
      message.error = data.error
      message.msg = 'Oops something went wrong'
    }
  }
  callback(message)
}
