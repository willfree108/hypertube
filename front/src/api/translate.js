let origin = require('./origin')
let axios = require('axios')
let _ = require('lodash')
let fs = require('fs')

function translate (sourceLang, targetLang, path = '../lang/') {
  let promises = []

  _.mapValues(origin, value => {
    let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${value}`
    promises.push(axios.get(url))
    return value
  })

  Promise.all(promises)
    .then(res => {
      var i = -1
      res = res.map(el => el.data[0][0][0])
      res = _.mapValues(origin, () => res[++i])

      fs.writeFile(`${path}${targetLang}.json`, JSON.stringify(res, null, 2), 'utf8', (err, data) => {
        if (err) console.log(`It failed! => File: ${path}${targetLang}.json`)
        else console.log(`Succesfully Created! => File: ${path}${targetLang}.json`)
      })
    })
    .catch(err => console.log('Failed', err))
}

// https://ctrlq.org/code/19899-google-translate-languages#languages

const lang = ['en', 'fr', 'ko', 'es', 'it', 'ja']

lang.map(l => translate('en', l))
