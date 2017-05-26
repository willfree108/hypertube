const ObjectId = require('mongodb').ObjectID
const db = require('./database')
const uuidV4 = require('uuid/v4')
const Mail = require('./Mail')
const bcrypt = require('bcrypt-nodejs')

/**
 *  Model user
 */

const originUser = {
  _id: 'auto generated', // Don't forget to use ObjectId

  username: 'Length should be 6 to 25. / unique',
  password: 'Length should be 6 to 12',


  firstName: 'Length should be 2 to 25.',
  lastName: 'Length should be 2 to 25.',

  avatar: '550ko max',
  email: 'email / unique',
  local: 'en/fr', // default 'en'

  movies: [],

  verifyToken: '', // set to true when user is verified
  verifyExpire: '',

  recoverToken: '',
  recoverExpire: ''
}

/**
 *  Alpha test / Be careful !
 */

 const generateByUsers = db.generate('users')
 const up = db.wrapper(generateByUsers('updateOne'))
 const find = db.wrapper(generateByUsers('findOne'))
 const insert = db.wrapper(generateByUsers('insertOne'))

async function addAsync (newUser, resolve, reject) {
  try {
    const query = { $or: [ { username: newUser.username }, {  email: newUser.email } ] }
    const user = await find(query)
    if (user !== undefined && user !== null) {
      reject('Username or email already exist!')
    } else {
      newUser.verifyToken = uuidV4()
      newUser.verifyExpire = Date.now()
      newUser.seen = []
      newUser.local = 'en'
      await insert(newUser)
      if (newUser.facebookId === undefined && newUser.fortytwoId === undefined) {
        await Mail.activate(newUser)
        resolve('An email has been sent to activate!')
      } else {
        resolve('Successfully linked account!')
      }
    }
  } catch (e) {
    reject('An error occured! Please try again!')
  }
}

const add2 = db.wrapper(addAsync)

/**
 *  Add a new user wrapped within a promise
 */

function added (newUser, resolve, reject) {
  return function (db) {
    const collection = db.collection('users')
    collection.findOne({$or: [ { username: newUser.username}, {  email: newUser.email } ] }, function(err, user) {
      if (err) reject('Creat User failed at fn:addUser on find!')
      else if (user !== undefined && user !== null) reject('Username or email already exist!')
      else {
        newUser.verifyToken = uuidV4()
        newUser.verifyExpire = Date.now()
        collection.insertOne(newUser, (err, data) => {
          if (err) reject('An error occured at creating the new user! Please try again!')
          else Mail.activate(newUser)
                .then(() => resolve('An email has been sent to activate!'))
                .catch(() => reject('An error occured at sending email! Please try again!'))
        })
      }
    })
  }
}

/**
 *  Get a user following his ID wrapped within a promise
 *  Need to be logged
 */

function got (idUser, resolve, reject) {
  return function (db) {
    const collection = db.collection('users')
    collection.findOne(ObjectId(idUser), function (err, data){
      if (err) reject(err)
      else resolve(data)
    })
  }
}

/**
 *  Update a user wrapped within a promise
 *  Need to be logged and owner
 */

function updated (updatedUser, resolve, reject) {
  return function (db) {
    const collection = db.collection('users')
    get(ObjectId(updatedUser._id))
    .then(user => {
      delete updatedUser._id;
        collection.updateOne({ username: user.username}, {$set: updatedUser}, function(err, data) {
          if (err) reject(err)
          else resolve(data)
        })
    })
    .catch(reject)
  }
}


/**
 *  Wrapping !
 */

const get = db.wrapper(got)
const add = db.wrapper(added)
const update = db.wrapper(updated)

/**
 *  Update a user wrapped within a promise
 *  Need to be logged and owner
 */

function activated (verifyToken, resolve, reject) {
  return function (db) {
    const collection = db.collection('users')
    collection.findOne({ verifyToken }, function (err, user) {
      if (err || user === undefined || user === null) reject('User activation failed!')
      else {
        user.verifyToken = true
        update(user)
          .then(() => resolve('User activated!'))
          .catch(() => reject('User activation failed!'))
      }
    })
  }
}

function saved ({ recoverToken, password }, resolve, reject) {
  return function (db) {
    const collection = db.collection('users')
    collection.findOne({ recoverToken }, function (err, user) {
      if (err || user === undefined || user === null) reject('A new password has been set using this token!')
      else {
        user.password = password
        user.recoverToken = uuidV4()
        update(user)
          .then(() => resolve('New password set!'))
          .catch(() => reject('New password set failed!'))
      }
    })
  }
}

function recovered (email, resolve, reject) {
  return function (db) {
    const collection = db.collection('users')
    collection.findOne({ email }, function (err, user) {
      if (err || user === undefined || user === null) reject('Couldn\'t find anyone associated with this email!')
      else {
        user.recoverToken = uuidV4()
        user.recoverExpire = Date.now()
        update(user)
          .then(() => {
              Mail.recover(user)
                    .then(() => resolve('An email has been sent to recover!'))
                    .catch(() => reject('An error occured at sending email! Please try again!'))
          })
          .catch(() => reject('An error occured! Please try again!'))
      }
    })
  }
}

function existed ({ username, password }, resolve, reject) {
  return function (db) {
    const collection = db.collection('users')
    collection.findOne({ username }, function (err, user) {
      if (err || user === undefined || user === null) reject('Auth failed!')
      else {
        bcrypt.compare(password, user.password, function(err, res) {
          if (res !== true) reject('Auth failed!')
          else resolve(user)
        })
      }
    })
  }
}

const activation = db.wrapper(activated)
const recover = db.wrapper(recovered)
const save = db.wrapper(saved)
const exist = db.wrapper(existed)

async function getByUsernameAsync ({ username, cpt }, resolve, reject) {
  try {
    const user = await find({ username })
    if (user) {
      ++cpt
      getByUsernameAsync({ username, cpt }, resolve, reject)
    } else {
      resolve(username + cpt)
    }
  } catch (e) {
    reject('An error occured!')
  }
}

const getByUsername = db.wrapper(getByUsernameAsync)

/**
 *  Exemple: some testing
 */

/*
add({username: 'test8', email: 'test8'})
  .then(res => console.log(res))
  .catch(console.log)
*/
/*
get('59192efe653b5927140ddd2a')
  .then(res => console.log(res))
  .catch(console.log)

update(:id)
  .then(res => console.log(res))
  .catch(console.log)
*/

module.exports = {
  db: db.db,
  exist,

  add: add2,
  get,
  getByUsername,
  update,

  activation,
  recover,

  save
}
