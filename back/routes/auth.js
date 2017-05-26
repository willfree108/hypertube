var express = require('express')
var router = express.Router()
const User = require('../models/Users.js')
var jwt = require('jsonwebtoken')
var config  = require('../config/config')
const h = require('../models/hooks')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
var OAuth2Strategy = require('passport-oauth2')
var BasicStrategy = require('passport-http').BasicStrategy;
var FortyTwoStrategy = require('passport-42').Strategy;
const uuidV4 = require('uuid/v4')

function createToken (user) {
  return jwt.sign(user, config.secret, { expiresIn: 60*60*5 })
}

passport.use(new FacebookStrategy({
    clientID: '1840154542976580',
    clientSecret: 'a1b1db1f6e0ca8825b21ae6562828a27',
    callbackURL: 'http://localhost:8080/api/auth/facebook/callback',
    profileFields: ['id', 'first_name', 'last_name', 'cover', 'emails', 'photos']
  },
  function(accessToken, refreshToken, profile, cb) {
    User.db
    .then(db => {
      const collection = db.collection('users')
      console.log(profile)
      collection.findOne({ facebookId: profile.id }, function (err, user) {
        if (err) return cb(err)
        else if (user === undefined || user === null) {
          if (!profile.username) profile.username = profile.name.givenName
          User.getByUsername({ username: profile.username, cpt: 0 })
            .then(newUsername => {
                console.log(profile.emails[0])
              const newUser = {
                avatar: profile.cover || profile.photos[0].value || 'https://s-media-cache-ak0.pinimg.com/736x/9c/3f/cf/9c3fcf249124eee74a92bf48d4a2705c.jpg',
                email: profile.emails[0].value,
                firstName: profile.name.givenName || 'FirstName',
                lastName: profile.name.familyName || 'LastName',
                username: newUsername,
                facebookId: profile.id
              }
              console.log(newUser)
              User.add(newUser)
                .then(res => {
                  console.log(res)
                    return cb(null, newUser)
                })
                .catch(err => {

                    console.log('***************************************', err)
                  return cb(err)
                })
            })
            .catch(err => {

                console.log('***************************************', err)
              return cb(err)
            })
        } else {
          return cb(null, user)
        }

      })
    })
    .catch(err => {
      return cb(null, null)
    })
  }
))

passport.use(new FortyTwoStrategy({
    clientID: "14b8097f766fe8419515ac5cc41412bec8221d96925e79449e89a0444452b7e7",
    clientSecret: "9b70cc18af62d30f38a99f62affa7bc5a9d9ddbf5dc1c0a8c7fd3977a007dd8d",
    callbackURL: "http://localhost:8080/api/auth/42/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.db
    .then(db => {
      const collection = db.collection('users')
      console.log(profile)
      collection.findOne({ fortytwoId: profile.id }, function (err, user) {
        if (err) return cb(err)
        else if (user === undefined || user === null) {
          const newUser = {
            avatar: profile._json.image_url || 'https://s-media-cache-ak0.pinimg.com/736x/9c/3f/cf/9c3fcf249124eee74a92bf48d4a2705c.jpg',
            email: profile.emails[0].value,
            firstName: profile.name.familyName || 'FirstName',
            lastName: profile.name.givenName  || 'LastName',
            fortytwoId: profile.id,
            username: profile.username
          }
          console.log(newUser)
          User.add(newUser)
            .then(res => {
              console.log(res)
                return cb(null, newUser)
            })
            .catch(err => {
              return cb(err)
            })

        } else {
          return cb(null, user)
        }

      })
    })
    .catch(err => {
      return cb(null, null)
    })
  }
))

const fieldPost = ['username', 'password']

router

.get('/facebook',
  // passport.authenticate('facebook')
  passport.authorize('facebook', { scope : ['email'] })
)

.get('/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
    failureRedirect: '/error/',
  }),
  function(req, res) {
    res.redirect('http://localhost:3000#/auth/' + createToken({ username: req.user.username, id_user: req.user._id }) + '/' + req.user._id)
  }
)

.get('/42',
  passport.authenticate('42'))

.get('/42/callback',
  passport.authenticate('42', {
    session: false,
    failureRedirect: '/error/'
  }),
  function(req, res) {
    res.redirect('http://localhost:3000#/auth/' + createToken({ username: req.user.username, id_user: req.user._id }) + '/' + req.user._id )
})

/**
 *  Guard for checking if user exist / auth
 */

.post('/', h.required(...fieldPost))
.post('/', h.pickBefore(...fieldPost))
.post('/', h.valid)

.post('/', function(req, res) {
  User.exist(req.body)
    .then(user => {
      if (user.verifyToken !== true) {
        res.status(401).send('You need to activate your account !')
      } else {
        res.status(200).json({
          token: createToken({ username: user.username, id_user: user._id }),
          id: user._id
        })
      }
    })
    .catch(err => res.status(500).send(err))
})

module.exports = router;
