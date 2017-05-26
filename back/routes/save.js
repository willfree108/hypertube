const User = require('../models/Users.js')
const h = require('../models/hooks')
const express = require('express')
const router = express.Router()

const fieldPost = ['password', 'recoverToken']

router

/**
 *  Guard to set the new password / save
 */

.post('/', h.required(...fieldPost))
.post('/', h.pickBefore(...fieldPost))
.post('/', h.valid)
.post('/', h.hashPassword)

.post('/', function(req, res) {
  User.save(req.body)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err))
})

module.exports = router;
