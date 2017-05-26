const User = require('../models/Users.js')
const express = require('express')
const router = express.Router()
const h = require('../models/hooks')

const fieldPost = ['email']

router

/**
 *  Guard for sending an email to recover
 */

.post('/', h.required(...fieldPost))
.post('/', h.pickBefore(...fieldPost))
.post('/', h.valid)

.post('/', function(req, res) {
  User.recover(req.body.email)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err))
})

module.exports = router
