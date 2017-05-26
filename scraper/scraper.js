// // // // // // // // // // // //
//      Script dependencies      //
// // // // // // // // // // // //

const MongoClient = require("mongodb").MongoClient;
const ObjectID    = require("mongodb").ObjectID;
const getCollection    = require("mongodb").getCollection;
const getJSON     = require('get-json');
const ptn         = require('parse-torrent-name');
const rarbg       = require('rarbg')
const OS          = require('opensubtitles-api');
const imdb        = require('imdb-api');
const mdb         = require('moviedb')('83e6ecd83bb1d77e3da609482a4416f0')
const request     = require("request");
const timer       = require('timers');
const fs          = require('fs');
const debug       = 1;

const db = connect()
let   i  = 0
let   j  = 0
let   k  = 0
let   x  = 0
db.catch(_ => console.log('CONNECTION FAILED'))

function norm (value, min, max) {
  return (value - min) / (max - min)
}

function lerp (norm, min, max) {
  return (max - min) * norm + min
}

// // // // // // // // // // // //
//   Get torrent list from YTS   //
// // // // // // // // // // // //

var params = 'limit=50&sort_by=title&page=';
var url_rq = 'https://yts.ag/api/v2/list_movies.json?' + params;

for (var page = 1; page < 124; page++) {
    getJSON(url_rq + page, function(err, res) {
        if (err) console.log(err);
        else {
            db
            .then(bdd => {
                const collection = bdd.collection("yts")
                const lenYTS = res.data.movies.length
                res.data.movies.map(m => collection.insertOne(m, (err, data) => {
                    if (err) console.log('Adding movie failed!')
                    ++i
                    if (i === lenYTS) ++k
                    if (k === 2) {done()}
                }))
            })
            .catch(console.log)
        }
    })
};


// // // // // // // // // // // //
//  Get torrent list from Rarbg  //
// // // // // // // // // // // //
var cpt = 0;
rarbg
.search({
    search_string: '720p',
    sort: 'seeders',
    limit: 100,
    min_seeders: 40,
    category: 'movies'
})
.then(response => {
    db
    .then(bdd => {
        const collection = bdd.collection('rarbg')
        // const lenRARBG = response.length
        response.map(m => collection.insertOne(m, (err, data) => {
            if (err) console.log('Adding movie failed!')
            ++j
            var title = ptn(m.filename).title; var year  = ptn(m.filename).year
            var codec = ptn(m.filename).codec; var qual  = ptn(m.filename).quality
            var hash = /\burn:btih:([A-F\d]+)\b/i.exec(m.download)
            var url_rq = `https://api.themoviedb.org/3/search/movie?api_key=83e6ecd83bb1d77e3da609482a4416f0&language=en-US&query=${title}&page=1&include_adult=false&year=${year}`
            function noEchec(url_rq) {
                var done = false
                var i = 1
                getJSON(url_rq, (err, res) => {
                    fs.appendFileSync('movies.json', `https://api.themoviedb.org/3/movie/${res.results[0].id}?api_key=83e6ecd83bb1d77e3da609482a4416f0&language=en-US#${title}`+ '\n')
                    done = true
                    x++
                    if (debug === 1) console.log("Creating the .json " + x + " %")
                    if (x === 94) {
                        if (debug === 1) console.log("Creating the .json 100 %\n----- Insert ready! -----")
                        insert()
                    }
                })
                timer.setTimeout(() => {
                    if (!done) noEchec(url_rq)
                }, 2000)
            }
            noEchec(url_rq)
            collection.update({'_id': m._id}, {$set : {"title": title, "year": year, "quality": qual, "codec": codec, "hash": hash[1]}}, (err) => {
                if (err)
                    console.log(err)
            })
        }))
    })
    .catch(console.log)
})
.catch(err => console.error(err))

function insert() {
    db
    .then(bdd => {

        fs.readFile('movies.json', 'utf8', function (err, res) {
            if (err) console.log(err)
            var details = res.split('\n').filter(url => url.length > 3)
            let check = 0
            var end  = false
            for (let i in details) {
                function noEchec() {
                    var d = false
                    getJSON (details[i].split(' ')[0], (error, response) => {
                        const collection = bdd.collection('rarbg')
                        const id = details[i].split('#')[1]
                        if (error) console.log(error)
                        function filter(arr) {
                            var dataArray = new Array;
                            for(var i in  arr) { dataArray.push(arr[i].name) }
                            return dataArray
                        }
                        collection.findOne({ "title": id }, (err, user) => {
                            if (err || user === null || user === undefined) console.log(err)
                            else {
                                var link = "https://image.tmdb.org/t/p/original"
                                let set = {
                                    "backdrop": link + response.backdrop_path,
                                    "genres": filter(response.genres).map(g => g.toLowerCase()),
                                    "imdb_id": response.imdb_id,
                                    "plot": response.overview,
                                    "rating": response.vote_average,
                                    "language": response.original_language,
                                    "cover": link + response.poster_path,
                                    "runtime": response.runtime}
                                collection.updateOne({_id: user._id}, {$set: set},  (err, res) => {
                                    if (err) console.log('User wasn\'t inserted!')
                                })
                            }
                        })
                        check++
                        d = true
                        if (debug === 1) console.log("Checking the whole requests " + check + " %")
                        if (check === details.length) {
                            end = true
                            if (debug === 1) console.log('Checking the whole requests 100 %\n----- DONE ! Go to done() -----')
                            if (end === true) done()
                        }
                    })
                    timer.setTimeout(() => {
                        if (!d) noEchec()
                    }, 1000)
                }
                noEchec()
            }
        })
    })
    .catch(console.log)
}

function done () {
    db
    .then(bdd => {
        const movies = bdd.collection('movies')
        const rarbg  = bdd.collection('rarbg')
        const yts    = bdd.collection('yts')
        var   end    = 0

        deadline()
        function deadline() {
        rarbg.find().toArray((err, rarbg_res) => {
                rarbg_res = rarbg_res.filter(m => Object.keys(m).length === 17)
                rarbg_res.forEach(e => {
                  yts.findOne({ imdb_code: e.imdb_id }, (err, mov) => {
                    if (!mov) {
                      movies.insertOne({
                          imdb: e.imdb_id,
                          title: e.title,
                          year: e.year,
                          rate: Math.floor(e.rating * 5) / 10,
                          runtime: e.runtime,
                          genre: e.genres,
                          description: e.plot,
                          lang: e.language,
                          background: e.backdrop,
                          cover: e.cover,
                          hash: e.hash
                      }, err => {if (err && debug === 1) console.error(err)});
                    }
                  })
                })
        })
        yts.find().toArray((err, yts_res) => {
            const len = yts_res.length
            var cpt = 0
            yts_res.forEach(e => {
                if (e.torrents && e.torrents.length > 0)
                {
                  movies.findOne({ imdb: e.imdb_code }, (err, mov) => {
                    if (!mov) {
                      movies.insertOne({
                          imdb: e.imdb_code,
                          title: e.title,
                          year: e.year,
                          rate: Math.floor(e.rating / 10 * 5 * 10) / 10,
                          runtime: e.runtime,
                          genre: e.genres.map(g => g.toLowerCase()),
                          description: e.description_full,
                          lang: e.language,
                          background: e.background_image_original,
                          cover: e.large_cover_image,
                          hash: e.torrents[0].hash,
                          seeds: e.torrents[0].seeds
                      }, err => {
                          ++cpt
                          console.log(`${cpt}/${len}`)
                          if (cpt === len) disconnect(db)
                          if (err && debug === 1) console.error(err)
                      });
                    } else {
                      ++cpt
                    }
                  })
                } else {
                    ++cpt
                }
            })
        })
        }
        fs.unlinkSync('movies.json');

    })
    .catch(console.log)
}


// // // // // // // //
//  Database handler //
// // // // // // // //

/**
 *  Connect to BDD
 */

function connect () {
    return new Promise(function(resolve, reject) {
        console.log('CONNECTED')
        MongoClient.connect('mongodb://localhost:27017/hypertube', function(err, db) {
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


// process.on('SIGINT', () => disconnect (db))
// process.on('SIGTERM', () => disconnect (db))
