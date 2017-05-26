const database = require('../models/database')

const cleanup = () => {
  console.log('CLEANING DONE')
  database.disconnect(database.db)
}

module.exports = cleanup
