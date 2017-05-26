const cookieParser = require('cookie-parser')
const database = require('./models/database')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const config = require('./config/config')
const passport = require('passport')
const express = require('express')
const logger = require('morgan')
const path = require('path')
const schedule = require('node-schedule')
var exec = require('child_process').exec;
const app = express()

schedule.scheduleJob('0 0 23 * * *', function(){
  let child = exec('sh ../scraper/limit_remove.sh', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  })
})


schedule.scheduleJob({hour: 2, minute: 30, dayOfWeek: 0}, function(){
  let child = exec('node ../scraper/scraper.js', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  })
})

/**
 *  Config Server
 */

let server = require('http').createServer(app)

/**
 *  Set Response Header
 */

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Credentials", "true")
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})

/**
 *  Middlewares
 */

app.use(logger('dev'))
app.use(errorhandler())
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({ extended: false , limit: '5mb' }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize());

/**
 *  Collections
 */
app.get('/success', function(req ,res) {
  res.send('success api')
})

app.get('/error', function(req ,res) {
  res.send('error api')
})

app.use('/api/users', require('./routes/users'))
app.use('/api/movies', require('./routes/movies'))
app.use('/api/comments', require('./routes/comments'))
/**
 *  Services
 */
app.use('/api/auth', require('./routes/auth'))
app.use('/api/activate', require('./routes/activate'))
app.use('/api/recover', require('./routes/recover'))
app.use('/api/save', require('./routes/save'))

/**
 *  Handle 404 Error
 */

app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
});

/**
 *  Handle Error
 */

app.use(function(err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500).send()
});

/**
 *  Listening port on config/config.port
 */

server.listen(config.port, () => console.log(`Server launched on ${config.port}.`))

/**
 *  Cleanup: close db ...
 */

const cleanup = require('./config/cleanup')
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
