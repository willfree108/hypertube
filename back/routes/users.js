const h = require('../models/hooks')
const express = require('express')
const router = express.Router()
const User = require('../models/Users')

const fieldPost = ['username', 'password', 'firstName', 'lastName', 'avatar', 'email']
const fieldUpdate = ['firstName', 'lastName', '_id', 'avatar', 'email', 'seen', 'local']

const fieldGetPublic = ['firstName', 'lastName', 'avatar', 'username', '_id']
const fieldGetPrivate = [...fieldGetPublic, 'email', 'seen', 'local']

router

/**
 *  Guard for add user / signUp
 */

.get('/:id', h.auth)

.get('/:id', function(req, res, next) {
  User.get(req.params.id)
    .then(data => {
      h.ownerAfter(req)
        .then(() => res.status(200).send(h.pickAfter(data, ...fieldGetPrivate)))
        .catch(() => res.status(200).send(h.pickAfter(data, ...fieldGetPublic)))
    })
    .catch(err => res.status(500).send(err))
})

/**
 *  Guard for add user / signUp
 */

.post('/', h.required(...fieldPost))
.post('/', h.pickBefore(...fieldPost))
.post('/', h.valid)
.post('/', h.hashPassword)

.post('/', function(req, res, next) {
  console.log(req.body)
  User.add(req.body)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err))
})

/**
 *  Guard for update user / settings
 */

.put('/', h.auth)
.put('/', h.ownerBefore)
.put('/', h.required(...fieldUpdate))
.put('/', h.pickBefore(...fieldUpdate))
.put('/', h.valid)

.put('/', function (req, res, next) {
  User.update(req.body)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err))
})

module.exports = router
