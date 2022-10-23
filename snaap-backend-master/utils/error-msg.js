module.exports = {
  PARAM_ERROR: {
    'INVALID: $[1]': {
      default: '$[1] is invalid'
    },
    'MISSING: $[1]': {
      default: '$[1] is required'
    },
    'NUMERIC_LIMIT: $[1] $[2] $[3]': {
      default: '$[1] should be numeric'
    },
    'TEXT_LIMIT: $[1] $[2] $[3]': {
      default: '$[1] string limit should be between $[2] to $[3]'
    },
    'NUMERIC: $[1]': {
      default: '$[1] should be numeric'
    },
    'STRING: $[1]': {
      default: '$[1] should be string'
    },
    'PASSWORD: $[1] $[2]': {
      default: 'Password lenght should be $[1] to $[2]'
    },
    OTP: {
      default: 'Please enter a valid OTP of 4 digit'
    },
    INVALID_FIELDNAME: {
      default: 'Please enter a valid field name'
    },
    'INVALID_ADDRESS: $[1] $[2] $[3]': {
      default: 'Please provider a valid $[1] address between $[2] to $[3] length'
    },
    UNAUTHORIZED: {
      default: 'Unauthorized access'
    },
    INVALID_PAYMENT_MODE: {
      default: 'Please select a valid Payment Mode'
    },
    INVALID_PAYMENT_MODE: {
      default: 'Please select a valid Payment Mode'
    },   
    INVALID_CLEANLINESS: {
      default: 'Please provide a boolean value 0 or 1 (0-true or 1-false)'
    },
    INVALID_RATING: {
      default: 'Please provide a rating between 1 and 3'
    },
    INVALID_STATUS: {
      default: 'Please provide a status value 1 or 2'
    }
  },
  ERROR: {
    'NOTEXIST: $[1]': {
      default: 'Your $[1] does not exists'
    },
    'EXIST: $[1]': {
      default: 'Your $[1] already exists'
    },
    OTP: {
      default: 'You have entered a incorrect OTP'
    },
    PASSWORD: {
      default: 'Please enter a valid password'
    },
    OTP_VERIFY: {
      default: 'Please enter a valid OTP'
    },
    OOPS: {
      default: 'OOPS something went wrong'
    },
    'NOT_ALPHA: $[1]': {
      default: '$[1] is not alphabetical character'
    },
    'TRY_LOGIN: $[1]': {
      default: 'This user account already exists. Please login using $[1]'
    }
  },
  SUCCESS: {
    OTP: {
      default: 'OTP has been verified Successfully'
    },
    OTP_SENT: {
      default: 'OTP has been sent to your registered email'
    },
    OTP_EXPIRED: {
      default: 'Your OTP has been expired'
    },
    'EXIST: $[1]': {
      default: 'Your $[1] exist'
    },
    INSERTED: {
      default: 'Your information has been registered successfully'
    },
    UPDATE: {
      default: 'Your data has been updated'
    },
    DELETED: {
      default: 'Your data has been deleted'
    },
    VALID: {
      default: 'Data loaded successfully'
    },
    PASSWORD: {
      default: 'Your credentials has been verified successfully'
    },
    PASSWORD_RESET: {
      default: 'Your password has been reset successfully'
    },
    LOGIN_SUCCESS: {
      default: 'You have been logged in'
    },
    UNAUTHORIZED: {
      default: 'Unauthorized access'
    }
  },
  SYSTEM: {
    OOPS: {
      default: 'OOPS something went wrong'
    },
    DB: {
      default: 'Not able to connect with database'
    }
  }
}
