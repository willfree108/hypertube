const _ = require('lodash')
const bcrypt = require('bcrypt-nodejs')
const jwtChecker = require('express-jwt')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
/**
 *  Middleware/Hook before checking if user is logged
 */

const auth = jwtChecker({
  secret: config.secret
})

const ownerBefore = function (req, res, next) {
  if (req.headers.authorization){
    token = req.headers.authorization.substr(7)
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) res.status(500).send('An error occured at checking the owner!')
      if (JSON.stringify(decoded.id_user) === JSON.stringify(req.body._id)) {
        next()
      } else {
        res.status(500).send('You are not the owner of this ID!')
      }
    })
  }
}

const ownerAfter = function (req) {
  return new Promise(function(resolve, reject) {
    if (req.headers.authorization){
      token = req.headers.authorization.substr(7)
      jwt.verify(token, config.secret, function(err, decoded) {
        if (err) reject('An error occured at checking the owner!')
        if (JSON.stringify(decoded.id_user) === JSON.stringify(req.params.id)) {
          resolve('You are the owner!')
        } else {
          reject('You are not the owner of this ID!')
        }
      })
    }
  })
}

/**
 *  Middleware/Hook before encrypt password with salt
 */

const hashPassword = function (req, res, next) {
  if (req.body.password === undefined || req.body.password === null) {
    res.status(500).json({ error: [ { message: 'password field is required on hashPassword' } ] })
  } else {
    bcrypt.hash(req.body.password, null, null, function(err, hash) {
      if (err) res.status(500).send({ error: [ { message: 'An error occured on hashPassword' } ] } )
      else {
        req.body.password = hash
        next()
      }
    })
  }
}

/**
 *  Middleware/Hook before encrypt password with salt
 */

const hashPassword2 = function (req, res, next) {
  if (req.body.password === undefined || req.body.password === null) {
    res.status(500).json({ error: [ { message: 'password field is required on hashPassword' } ] })
  } else {
    bcrypt.hash(req.body.password, null, null, function(err, hash) {
      if (err) res.status(500).send({ error: [ { message: 'An error occured on hashPassword' } ] } )
      else {
        req.body.password = hash
        next()
      }
    })
  }
}

/**
 *  Middleware/Hook before checking if all fields required are presents
 *  Otherwise send a response with a status 500 and error: [message]
 */

const required = function (...fields) {
  return function (req, res, next) {
    let error = []
    fields.forEach(n => {
      if (req.body[n] === undefined) error.push({ message: `Error: ${n} is required!` })
    })
    if (error.length === 0) next()
    else res.status(500).json({ error })
  }
}

/**
 *  Function which valid all fields
 */

const validate = function (user, cb) {
  let error = []

  const nameRegex = /^[\w+]{2,25}$/
  const usernameRegex = /^[\w\d]{4,25}$/
  const messageRegex = /^[\w\d\s]{1,200}$/
  const localRegex = /^(fr|en)$/
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,12}$/
  const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (user.hasOwnProperty("password")) {
    if (user.password.toUpperCase() === false) {
      error.push({ message: 'Error: password can only be alphanumeric.'})
    }
    if (user.password.toUpperCase() === user.password) {
      error.push({ message: 'Error: password need at least one lowercase.'})
    }
    if (user.password.toLowerCase() === user.password) {
      error.push({ message: 'Error: password need at least one capital letter.'})
    }
    if (user.password.match(/\d+/) === null) {
      error.push({ message: 'Error: password need at least one number.'})
    }
    if (user.password.length < 6 || user.password.length > 12) {
      error.push({ message: 'Error: password length should be 6 to 12.'})
    }
  }
  if (user.hasOwnProperty("username") && usernameRegex.test(user.username) === false) {
    error.push({ message: 'Error: username length should be 4 to 25 and contain only alphanumeric characters.'})
  }
  if (user.hasOwnProperty("email") && mailRegex.test(user.email) === false) {
    error.push({ message: 'Error: email invalid format.'})
  }
  if (user.hasOwnProperty('firstName') && nameRegex.test(user.firstName) === false) {
    error.push({ message: 'Error: firstName length should be 2 to 25 and contain only alphabetic characters.'})
  }
  if (user.hasOwnProperty('lastName') && nameRegex.test(user.lastName) === false) {
    error.push({ message: 'Error: lastName length should be 2 to 25 and contain only alphabetic characters.'})
  }
  if (user.hasOwnProperty('local') && localRegex.test(user.local) === false) {
    error.push({ message: 'Error: lang currently supported are en/fr.'})
  }
  if (user.hasOwnProperty('message') && messageRegex.test(user.message) === false) {
    error.push({ message: 'Error: Please only send alphanumeric with a length between 1 and 200.'})
  }

  cb(error)
}

/**
 *  Wrap validate into a Middleware
 */

const valid = (req, res, next) => {
  validate(req.body, error => {
    if (error.length !== 0) res.status(500).json({ error })
    else next()
  })
}

/**
 *  Middleware/Hook before omit fields
 */

const omitBefore = function (...fields) {
  return function(req, res, next) {
    req.body = _.omit(req.body, fields)
    next()
  }
}
/**
 *  Middleware/Hook before pick fields
 */

const pickBefore = function (...fields) {
  return function(req, res, next) {
    req.body = _.pick(req.body, fields)
    next()
  }
}

/**
 * Middleware/Hook after omit fields
 */

const omitAfter = (obj, ...fields) =>  _.omit(obj, fields)

/**
 * Middleware/Hook after pick fields
 */

const pickAfter = (obj, ...fields) =>  _.pick(obj, fields)

module.exports = {

  auth,
  hashPassword,

  valid,
  required,

  ownerBefore,
  ownerAfter,

  pickBefore,
  omitBefore,

  pickAfter,
  omitAfter
}
