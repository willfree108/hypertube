var MongoClient = require('mongodb').MongoClient;
const config = require('../config/config')

/**
 *  Connect to BDD
 */

function connect () {
  return new Promise(function(resolve, reject) {
    console.log('CONNECTED')
    MongoClient.connect(config.urlDatabase, function(err, db) {
      if (err) reject(err)
      else resolve(db)
    })
  })
}

/**
 *  Disconnect to BDD
 */

function disconnect (db) {
  db
  .then(d => {
    d.close()
    console.log('DISCONNECTED')
    process.exit()
  })
  .catch(err => {
    console.log('DISCONNECTION FAILED')
    process.exit()
  })
}

/**
 *  Make an instance
 */

const db = connect()

/**
 *  Handle error during attempt to connect to BDD
 */

db.catch(_ => console.log('CONNECTION FAILED'))


/**
 *  Alpha test / Be careful !
 */

/**
*  Generate mongodb method for the promisify wrapper
*/

function generate (collectionName) {
  return function (method) {
    return function (query, resolve, reject) {
      return function (db) {
        const collection = db.collection(collectionName)
        collection[method](query, (err, data) => {
          if (err) reject(err)
          else resolve(data)
        })
      }
    }
  }
}

/**
 *  Wrap using db promise and return a new promise
 */

const wrapper = (fn) => {
  return (props) => {
    return new Promise(function(resolve, reject) {
      db
      .then(fn(props, resolve, reject))
      .catch(() => console.log('CONNECTION FAILED INSIDE WRAPPER'))
    })
  }
}

module.exports = {
  db,

  connect,
  disconnect,

  wrapper,
  generate
}
