const db = require('./database')

const originMovie = {
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
 *  Generate all services for the movies collection
 */

const generateByMovies = db.generate('movies')
const find = db.wrapper(generateByMovies('find'))
const findOne = db.wrapper(generateByMovies('findOne'))
const insert = db.wrapper(generateByMovies('insertOne'))


/**
 *  Get all movies
 */

async function getAsync (_, resolve, reject) {
  try {
    const movies = await find()
    movies.toArray((err, movies) => {
      if (err) reject('Couldn\'t get all movies!')
      else resolve(movies)
    })
  } catch (e) {
    console.log(e)
    reject('Couldn\'t get all movies!')
  }
}

const get = db.wrapper(getAsync)

/**
 *  Add a movie
 */

async function addAsync (newMovie, resolve, reject) {
  try {
    await insert(newMovie)
    resolve('Movie added')
  } catch (e) {
    reject('Couldn\'t add movie!')
  }
}

const add = db.wrapper(addAsync)

async function getOneAsync (imdb, resolve, reject) {
  try {
    const movie = await findOne({ imdb })
    resolve(movie)
  } catch (e) {
    reject(e)
  }
}

const getOne = db.wrapper(getOneAsync)

module.exports = {
  get,
  add,

  getOne
}
