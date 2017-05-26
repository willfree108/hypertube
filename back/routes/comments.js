const h = require('../models/hooks')
const express = require('express')
const router = express.Router()
const Comments = require('../models/Comments')
const config = require('../config/config')
const fieldPost = ['username', 'message', 'imdb', 'idUser']
const jwt = require('jsonwebtoken')

router

.get('/:imdb', function(req, res) {
  Comments.get(req.params.imdb)
  .then(data => res.status(200).json({ comments: data }))
  .catch(err => res.status(500).send(err))
})


.post('/', h.auth)
.post('/', h.required(...fieldPost))
.post('/', h.pickBefore(...fieldPost))
.post('/', h.valid)

.post('/', function (req, res, next) {
  if (req.headers.authorization){
    token = req.headers.authorization.substr(7)
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) res.status(500).send('An error occured at checking the owner!')
      if (JSON.stringify(decoded.id_user) === JSON.stringify(req.body.idUser)) {
        next()
      } else {
        res.status(500).send('You are not the owner of this ID!')
      }
    })
  }
})

.post('/', function (req, res) {
  Comments.add(req.body)
  .then(data => res.status(200).json({ movies: data }))
  .catch(err => res.status(500).send(err))
})
module.exports = router
