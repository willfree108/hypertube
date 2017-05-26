const ObjectId = require('mongodb').ObjectID
const db = require('./database')

const generateByComments = db.generate('comments')
const insert = db.wrapper(generateByComments('insertOne'))
const find = db.wrapper(generateByComments('find'))

async function addAsync (newComment, resolve, reject) {
  try {
    const creat = new Date()
    newComment.unixstamp = creat.getTime()
    newComment.created = creat.toISOString().slice(0, 10)
    console.log(newComment)
    await insert(newComment)
    resolve('Comment has been added!')
  } catch (e) {
    reject('An error occured!')
  }
}

const add = db.wrapper(addAsync)

async function getAsync (imdb, resolve, reject) {
  try {
      const comments = await find({ imdb })
      comments.toArray((err, data) => {
        if (err) reject('Couldn\'t get all comment')
        else resolve(data)
      })
  } catch (e) {
    reject('Couldn\'t get all comment')
  }
}

const get = db.wrapper(getAsync)

module.exports = {
  add,
  get
}
