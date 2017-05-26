export {
  validateUsername,
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateCheckPassword,
  validateConfirmPassword,
  validateLocal
}

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

let validateUsername = function (rule, value, callback) {
  if (value === '') {
    callback(new Error(this.$t('errorInputUsername')))
  } else if (value.length < 4 || value.length > 25) {
    callback(new Error(this.$t('errorCorrectUsername')))
  } else {
    callback()
  }
}

let validateFirstName = function (rule, value, callback) {
  if (value === '') {
    callback(new Error(this.$t('errorInputFirstName')))
  } else if (value.length < 2 || value.length > 25) {
    callback(new Error(this.$t('errorCorrectFirstName')))
  } else {
    callback()
  }
}

let validateLastName = function (rule, value, callback) {
  if (value === '') {
    callback(new Error(this.$t('errorInputLastName')))
  } else if (value.length < 2 || value.length > 25) {
    callback(new Error(this.$t('errorCorrectLastName')))
  } else {
    callback()
  }
}

let validateEmail = function (rule, value, callback) {
  if (value === '') {
    callback(new Error(this.$t('errorInputEmail')))
  } else if (emailRegex.test(value) === false) {
    callback(new Error(this.$t('errorCorrectEmail')))
  } else {
    callback()
  }
}

let validatePassword = function (rule, value, callback) {
  if (value === '') {
    callback(new Error(this.$t('errorInputPassword')))
  } else if (value.toUpperCase() === value) {
    callback(new Error(this.$t('errorCorrectPasswordLower')))
  } else if (value.toLowerCase() === value) {
    callback(new Error(this.$t('errorCorrectPasswordUpper')))
  } else if (value.match(/\d+/) === null) {
    callback(new Error(this.$t('errorCorrectPasswordNumber')))
  } else if (value.length < 6 || value.length > 12) {
    callback(new Error(this.$t('errorCorrectPassword')))
  } else {
    callback()
  }
}

let validateCheckPassword = function (rule, value, callback) {
  if (value === '') {
    callback(new Error(this.$t('errorInputPassword')))
  } else if (value.toUpperCase() === value) {
    callback(new Error(this.$t('errorCorrectPasswordLower')))
  } else if (value.toLowerCase() === value) {
    callback(new Error(this.$t('errorCorrectPasswordUpper')))
  } else if (value.match(/\d+/) === null) {
    callback(new Error(this.$t('errorCorrectPasswordNumber')))
  } else if (value.length < 6 || value.length > 12) {
    callback(new Error(this.$t('errorCorrectPassword')))
  } else {
    if (this.ruleForm.checkPass !== '') {
      this.$refs.ruleForm.validateField('confirmPassword')
    }
    callback()
  }
}

let validateConfirmPassword = function (rule, value, callback) {
  if (value === '') {
    callback(new Error(this.$t('errorInputConfirm')))
  } else if (value !== this.ruleForm.password) {
    callback(new Error(this.$t('errorCorrectConfirm')))
  } else {
    callback()
  }
}

let validateLocal = function (rule, value, callback) {
  if (value === '') {
    callback(new Error(this.$t('errorInputLocal')))
  } else if (value !== 'en' && value !== 'fr') {
    callback(new Error(this.$t('errorCorrectLocal')))
  } else {
    callback()
  }
}
