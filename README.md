# Welcome to Hypertube

Hypertube is a 42 project which consists of streaming in real-time a movie directly from his torrent.

## Front

Made with the Vue eco-system: Vue.js (like React), Vue-routeur, VueX (like Redux), Vue-i18n, elements.js and axios.
### Part 1: Sign Up
![](https://media.giphy.com/media/xUPGcLnn2JDo1eqCwU/giphy.gif)
### Part 2: Gallery
![](https://media.giphy.com/media/3ohzdVT9GF42KHA8zm/giphy.gif)
### Part 3: Viewer
![](https://media.giphy.com/media/3o7btOhUeg7W5jdeM0/giphy.gif)

Translation script which convert an object to any language in front/src/api/translate.js thanks to google API.

```
node translate.js
Succesfully Created! => File: ../lang/en.json
Succesfully Created! => File: ../lang/it.json
Succesfully Created! => File: ../lang/ko.json
Succesfully Created! => File: ../lang/es.json
Succesfully Created! => File: ../lang/fr.json
Succesfully Created! => File: ../lang/ja.json
```

## Back

Made with node.js/express/mongodb following a REST architecture with a tiny system of hooks and services wrapped within a promise.
Authentification are handled by passport and respond with a jwt.

```js
const fieldPost = ['email']

router

/**
 *  Guard for sending an email to recover
 */

.post('/', h.required(...fieldPost))
.post('/', h.pickBefore(...fieldPost))
.post('/', h.valid)

.post('/', function(req, res) {
  User.recover(req.body.email)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(err))
})

module.exports = router

```

```js
/**
 *  Add a comment
 */
 
async function addAsync (newComment, resolve, reject) {
  try {
    const creat = new Date()
    newComment.unixstamp = creat.getTime()
    newComment.created = creat.toISOString().slice(0, 10)
    await insert(newComment)
    resolve('Comment has been added!')
  } catch (e) {
    reject('An error occured!')
  }
}

const add = db.wrapper(addAsync) // wrap in a promise
```

## Scraper

Get torrent from yts and RARGB and then format.
(extratorrent died during the process, may you RIP)

# GIF
Because sometimes it doesn't render well.

[Part 1: Sign Up](https://media.giphy.com/media/xUPGcLnn2JDo1eqCwU/giphy.gif)

[Part 2: Gallery](https://media.giphy.com/media/3ohzdVT9GF42KHA8zm/giphy.gif)

[Part 3: Viewer](https://media.giphy.com/media/3o7btOhUeg7W5jdeM0/giphy.gif)

Have a nice day.

