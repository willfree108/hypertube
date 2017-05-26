const express = require('express')
const router = express.Router()
const User = require('../models/Users.js')

router

.get('/:token', function(req, res) {
  User.activation(req.params.token)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err))
})

module.exports = router;
