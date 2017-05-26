const h = require('../models/hooks')
const express = require('express')
const router = express.Router()
const Movies = require('../models/Movies')
const path = require('path')

const torrentStream = require('torrent-stream')
const pump = require('pump')
const ffmpeg = require('fluent-ffmpeg')
const OS = require('opensubtitles-api')
const fs = require('fs')
const srt2vtt = require('srt-to-vtt')
const request = require('request')
const slug = require('slug')

router

/**
 *  Guard for add user / signUp
 */

.get('/', function(req, res, next) {
  Movies.get()
  .then(data => res.status(200).json({ movies: data.map(m => h.pickAfter(m, 'title', 'rate', 'year', 'cover', 'imdb', 'genre')) }))
  .catch(err => res.status(500).send(err))
})

.get('/', h.auth)

.get('/:imdb', function(req, res, next) {
    Movies.getOne(req.params.imdb)
    .then(m => {
      return new Promise((resolve, reject) => {
          if (m.subtitles && Object.keys(m.subtitles).length > 0)
            return resolve(m)
          else
          {
            m.subtitles = {}
            let OpenSubtitles = new OS('OSTestUserAgentTemp')
            OpenSubtitles
            .search({
              sublanguageid: ['eng', 'fre'].join(),    // Can be an array.join, 'all', or be omitted.
              imdbid: req.params.imdb,              // 'tt528809' is fine too.
              extensions: 'srt'             // Accepted extensions, defaults to 'srt'.
            })
            .then(subtitles => {
              if (!fs.existsSync(path.join(__dirname, '..', 'public', 'subtitles')))
                fs.mkdirSync(path.join(__dirname, '..', 'public', 'subtitles'))
              if (!fs.existsSync(path.join(__dirname, '..', 'public', 'subtitles', m.imdb)))
                fs.mkdirSync(path.join(__dirname, '..', 'public', 'subtitles', m.imdb))
              let i = 0
              for (let k in subtitles)
              {
                ++i
                request(subtitles[k].url, function(err, response, body) {
                  fs.writeFile(path.join(__dirname, '..', 'public', 'subtitles', m.imdb,slug(`${m.title}`) + `-(${m.year}).${k}${path.extname(subtitles[k].filename)}`), body, (err) => {
                    if (err) throw err;
                    console.log()
                    fs.createReadStream(path.join(__dirname, '..','public', 'subtitles', m.imdb, slug(`${m.title}`) + `-(${m.year}).${k}${path.extname(subtitles[k].filename)}`))
                    .pipe(srt2vtt())
                    .pipe(fs.createWriteStream(path.join(__dirname, '..','public', 'subtitles', m.imdb, slug(`${m.title}`) + `-(${m.year}).${k}.vtt`)))
                    fs.unlink(path.join(__dirname, '..','public', 'subtitles', m.imdb, slug(`${m.title}`) + `-(${m.year}).${k}${path.extname(subtitles[k].filename)}`))
                    console.log("The file was succesfully saved!")
                  })
                })
                m.subtitles[k] = `http://localhost:8080/subtitles/${m.imdb}/${slug(`${m.title}`)}-(${m.year}).${k}.vtt`
              }
              if (Object.keys(m.subtitles).length === i)
                return resolve(m)
            })
            .catch(err => {
              console.log(err)
              reject(err)
            })
        }
      })
    })
    .then(movie => res.status(200).json(movie))
    .catch(err => {
      console.log(err)
      res.status(500).send(err)
    })
})

.get('/play/:resolution/:hash', function(req, res, next) {
    if (!(['720', '480', '360'].includes(req.params.resolution)))
    		res.end()
    	let options = {
    	    connections: 100,     // Max amount of peers to be connected to.
    	    uploads: 10,          // Number of upload slots.
    	    tmp: '/tmp',          // Root folder for the files storage.
    	                          // Defaults to '/tmp' or temp folder specific to your OS.
    	                          // Each torrent will be placed into a separate folder under /tmp/torrent-stream/{infoHash}
    	    path: '/tmp/hypertube', // Where to save the files. Overrides `tmp`.
    	    verify: true,         // Verify previously stored data before starting
    	                          // Defaults to true
    	    dht: true,            // Whether or not to use DHT to initialize the swarm.
    	                          // Defaults to true
    	    tracker: true,        // Whether or not to use trackers from torrent file or magnet link
    	                          // Defaults to true
    	    trackers: [
    	        'udp://tracker.openbittorrent.com:80',
    	        'udp://tracker.ccc.de:80',
    			"udp://glotorrents.pw:6969/announce",
    			"udp://tracker.opentrackr.org:1337/announce",
    			"udp://torrent.gresille.org:80/announce",
    			"udp://tracker.openbittorrent.com:80",
    			"udp://tracker.coppersurfer.tk:6969",
    			"udp://tracker.leechers-paradise.org:6969",
    			"udp://p4p.arenabg.ch:1337",
    			"udp://tracker.internetwarriors.net:1337",
    			"http://tracker.tfile.me/announce",
    			"udp://fr33domtracker.h33t.com:3310/announce",
          "udp://eddie4.nl:6969/announce",
          "udp://public.popcorn-tracker.org:6969/announce",
          "http://182.176.139.129:6969/announce",
          "http://5.79.83.193:2710/announce",
          "http://91.218.230.81:6969/announce",
          "http://atrack.pow7.com/announce",
          "http://bt.henbt.com:2710/announce",
          "http://mgtracker.org:2710/announce",
          "http://mgtracker.org:6969/announce",
          "http://open.touki.ru/announce.php",
          "http://p4p.arenabg.ch:1337/announce",
          "http://pow7.com:80/announce",
          "http://retracker.krs-ix.ru:80/announce",
          "http://secure.pow7.com/announce ",
          "http://t1.pow7.com/announce",
          "http://t2.pow7.com/announce",
          "http://thetracker.org:80/announce",
          "http://torrentsmd.com:8080/announce",
          "http://tracker.bittor.pw:1337/announce",
          "http://tracker.dutchtracking.com:80/announce",
          "http://tracker.dutchtracking.nl:80/announce",
          "http://tracker.edoardocolombo.eu:6969/announce",
          "http://tracker.ex.ua:80/announce",
          "http://tracker.kicks-ass.net:80/announce",
          "http://tracker1.wasabii.com.tw:6969/announce",
          "http://tracker2.itzmx.com:6961/announce",
          "http://www.wareztorrent.com:80/announce",
          "udp://62.138.0.158:6969/announce",
          "udp://eddie4.nl:6969/announce",
          "udp://explodie.org:6969/announce",
          "udp://shadowshq.eddie4.nl:6969/announce",
          "udp://shadowshq.yi.org:6969/announce",
          "udp://tracker.eddie4.nl:6969/announce",
          "udp://tracker.mg64.net:2710/announce",
          "udp://tracker.sktorrent.net:6969",
          "udp://tracker2.indowebster.com:6969/announce",
          "udp://tracker4.piratux.com:6969/announce",
          "http://atrack.pow7.com/announce",
          "http://bt.henbt.com:2710/announce",
          "http://mgtracker.org:2710/announce",
          "http://mgtracker.org:6969/announce",
          "http://open.touki.ru/announce.php",
          "http://p4p.arenabg.ch:1337/announce",
          "http://pow7.com:80/announce",
          "http://retracker.krs-ix.ru:80/announce",
          "http://secure.pow7.com/announce",
          "http://t1.pow7.com/announce",
          "http://t2.pow7.com/announce",
          "http://thetracker.org:80/announce",
          "http://torrentsmd.com:8080/announce",
          "http://tracker.bittor.pw:1337/announce",
          "http://tracker.dutchtracking.com/announce",
          "http://tracker.dutchtracking.com:80/announce",
          "http://tracker.dutchtracking.nl:80/announce",
          "http://tracker.edoardocolombo.eu:6969/announce",
          "http://tracker.ex.ua:80/announce",
          "http://tracker.kicks-ass.net:80/announce",
          "http://tracker.mg64.net:6881/announce",
          "http://tracker.tfile.me/announce",
          "http://tracker1.wasabii.com.tw:6969/announce",
          "http://tracker2.itzmx.com:6961/announce",
          "http://tracker2.wasabii.com.tw:6969/announce",
          "http://www.wareztorrent.com:80/announce",
          "udp://bt.xxx-tracker.com:2710/announce",
          "udp://eddie4.nl:6969/announce",
          "udp://shadowshq.eddie4.nl:6969/announce",
          "udp://shadowshq.yi.org:6969/announce",
          "udp://tracker.eddie4.nl:6969/announce",
          "udp://tracker.mg64.net:2710/announce",
          "udp://tracker.mg64.net:6969/announce",
          "udp://tracker.opentrackr.org:1337/announce",
          "udp://tracker.sktorrent.net:6969",
          "udp://tracker2.indowebster.com:6969/announce",
          "udp://tracker4.piratux.com:6969/announce",
          "udp://tracker.coppersurfer.tk:6969/announce",
          "http://tracker.opentrackr.org:1337/announce",
          "udp://zer0day.ch:1337/announce",
          "http://explodie.org:6969/announce",
          "udp://tracker.leechers-paradise.org:6969/announce",
          "udp://9.rarbg.com:2710/announce",
          "udp://p4p.arenabg.com:1337/announce",
          "udp://tracker.sktorrent.net:6969/announce",
          "http://p4p.arenabg.com:1337/announce",
          "udp://tracker.aletorrenty.pl:2710/announce",
          "http://tracker.aletorrenty.pl:2710/announce",
          "http://tracker.bittorrent.am/announce",
          "udp://tracker.kicks-ass.net:80/announce",
          "http://tracker.kicks-ass.net/announce",
          "http://tracker.baravik.org:6970/announce",
          "udp://tracker.piratepublic.com:1337/announce",
          "udp://torrent.gresille.org:80/announce",
          "http://torrent.gresille.org/announce",
          "http://tracker.skyts.net:6969/announce",
          "http://tracker.internetwarriors.net:1337/announce",
          "udp://tracker.skyts.net:6969/announce",
          "http://tracker.dutchtracking.nl/announce",
          "udp://tracker.yoshi210.com:6969/announce",
          "udp://tracker.tiny-vps.com:6969/announce",
          "udp://tracker.internetwarriors.net:1337/announce",
          "udp://mgtracker.org:2710/announce",
          "http://tracker.yoshi210.com:6969/announce",
          "http://tracker.tiny-vps.com:6969/announce",
          "udp://tracker.filetracker.pl:8089/announce",
          "udp://tracker.ex.ua:80/announce",
          "udp://91.218.230.81:6969/announce",
          "https://www.wareztorrent.com/announce",
          "http://www.wareztorrent.com/announce",
          "http://tracker.filetracker.pl:8089/announce",
          "http://tracker.ex.ua/announce",
          "http://tracker.calculate.ru:6969/announce",
          "udp://tracker.grepler.com:6969/announce",
          "udp://tracker.flashtorrents.org:6969/announce",
          "udp://tracker.bittor.pw:1337/announce",
          "http://tracker.tvunderground.org.ru:3218/announce",
          "http://tracker.grepler.com:6969/announce",
          "http://tracker.flashtorrents.org:6969/announce",
          "http://retracker.gorcomnet.ru/announce",
          "http://bt.pusacg.org:8080/announce",
          "http://87.248.186.252:8080/announce",
          "udp://tracker.kuroy.me:5944/announce",
          "udp://182.176.139.129:6969/announce",
          "http://tracker.kuroy.me:5944/announce",
          "http://retracker.krs-ix.ru/announce",
          "http://open.acgtracker.com:1096/announce",
          "udp://open.stealth.si:80/announce",
          "udp://208.67.16.113:8000/announce",
          "http://tracker.dler.org:6969/announce",
          "http://bt2.careland.com.cn:6969/announce",
          "http://open.lolicon.eu:7777/announce",
          "http://tracker.opentrackr.org:1337/announce",
          "http://explodie.org:6969/announce",
          "http://p4p.arenabg.com:1337/announce",
          "http://tracker.aletorrenty.pl:2710/announce",
          "http://tracker.bittorrent.am/announce",
          "http://tracker.kicks-ass.net/announce",
          "http://tracker.baravik.org:6970/announce",
          "http://torrent.gresille.org/announce",
          "http://tracker.skyts.net:6969/announce",
          "http://tracker.internetwarriors.net:1337/announce",
          "http://tracker.dutchtracking.nl/announce",
          "http://tracker.yoshi210.com:6969/announce",
          "http://tracker.tiny-vps.com:6969/announce",
          "http://www.wareztorrent.com/announce",
          "http://tracker.filetracker.pl:8089/announce",
          "http://tracker.ex.ua/announce",
          "http://tracker.calculate.ru:6969/announce",
          "http://tracker.tvunderground.org.ru:3218/announce",
          "http://tracker.grepler.com:6969/announce",
          "http://tracker.flashtorrents.org:6969/announce",
          "http://retracker.gorcomnet.ru/announce",
          "http://bt.pusacg.org:8080/announce",
          "http://87.248.186.252:8080/announce",
          "http://tracker.kuroy.me:5944/announce",
          "http://retracker.krs-ix.ru/announce",
          "http://open.acgtracker.com:1096/announce",
          "http://bt2.careland.com.cn:6969/announce",
          "http://open.lolicon.eu:7777/announce",
          "https://www.wareztorrent.com/announce",
          "udp://213.163.67.56:1337/announce",
          "http://213.163.67.56:1337/announce",
          "udp://185.86.149.205:1337/announce",
          "http://74.82.52.209:6969/announce",
          "udp://94.23.183.33:6969/announce",
          "udp://74.82.52.209:6969/announce",
          "udp://151.80.120.114:2710/announce",
          "udp://109.121.134.121:1337/announce",
          "udp://168.235.67.63:6969/announce",
          "http://109.121.134.121:1337/announce",
          "udp://178.33.73.26:2710/announce",
          "http://178.33.73.26:2710/announce",
          "http://85.17.19.180/announce",
          "udp://85.17.19.180:80/announce",
          "http://210.244.71.25:6969/announce",
          "http://85.17.19.180/announce",
          "http://213.159.215.198:6970/announce",
          "udp://191.101.229.236:1337/announce",
          "http://178.175.143.27/announce",
          "udp://89.234.156.205:80/announce",
          "http://91.216.110.47/announce",
          "http://114.55.113.60:6969/announce",
          "http://195.123.209.37:1337/announce",
          "udp://114.55.113.60:6969/announce",
          "http://210.244.71.26:6969/announce",
          "udp://107.150.14.110:6969/announce",
          "udp://5.79.249.77:6969/announce",
          "udp://195.123.209.37:1337/announce",
          "udp://37.19.5.155:2710/announce",
          "http://107.150.14.110:6969/announce",
          "http://5.79.249.77:6969/announce",
          "udp://185.5.97.139:8089/announce",
          "udp://194.106.216.222:80/announce",
          "udp://91.218.230.81:6969/announce",
          "https://104.28.17.69/announce",
          "http://104.28.16.69/announce",
          "http://185.5.97.139:8089/announce",
          "http://194.106.216.222/announce",
          "http://80.246.243.18:6969/announce",
          "http://37.19.5.139:6969/announce",
          "udp://5.79.83.193:6969/announce",
          "udp://46.4.109.148:6969/announce",
          "udp://51.254.244.161:6969/announce",
          "udp://188.165.253.109:1337/announce",
          "http://91.217.91.21:3218/announce",
          "http://37.19.5.155:6881/announce",
          "http://46.4.109.148:6969/announce",
          "http://51.254.244.161:6969/announce",
          "http://104.28.1.30:8080/announce",
          "http://81.200.2.231/announce",
          "http://157.7.202.64:8080/announce",
          "http://87.248.186.252:8080/announce",
          "udp://128.199.70.66:5944/announce",
          "udp://182.176.139.129:6969/announce",
          "http://128.199.70.66:5944/announce",
          "http://188.165.253.109:1337/announce",
          "http://93.92.64.5/announce",
          "http://173.254.204.71:1096/announce",
          "udp://195.123.209.40:80/announce",
          "udp://62.212.85.66:2710/announce",
          "udp://208.67.16.113:8000/announce",
          "http://125.227.35.196:6969/announce",
          "http://59.36.96.77:6969/announce",
          "http://87.253.152.137/announce",
          "http://158.69.146.212:7777/announce",
          "udp://tracker.coppersurfer.tk:6969/announce",
          "udp://zer0day.ch:1337/announce",
          "udp://tracker.leechers-paradise.org:6969/announce",
          "udp://9.rarbg.com:2710/announce",
          "udp://p4p.arenabg.com:1337/announce",
          "udp://tracker.sktorrent.net:6969/announce",
          "udp://tracker.aletorrenty.pl:2710/announce",
          "udp://tracker.kicks-ass.net:80/announce",
          "udp://tracker.piratepublic.com:1337/announce",
          "udp://torrent.gresille.org:80/announce",
          "udp://tracker.skyts.net:6969/announce",
          "udp://tracker.yoshi210.com:6969/announce",
          "udp://tracker.tiny-vps.com:6969/announce",
          "udp://tracker.internetwarriors.net:1337/announce",
          "udp://mgtracker.org:2710/announce",
          "udp://tracker.filetracker.pl:8089/announce",
          "udp://tracker.ex.ua:80/announce",
          "udp://91.218.230.81:6969/announce",
          "udp://tracker.grepler.com:6969/announce",
          "udp://tracker.flashtorrents.org:6969/announce",
          "udp://tracker.bittor.pw:1337/announce",
          "udp://tracker.kuroy.me:5944/announce",
          "udp://182.176.139.129:6969/announce",
          "udp://open.stealth.si:80/announce",
          "udp://208.67.16.113:8000/announce",
          "udp://tracker.coppersurfer.tk:6969/announce",
          "http://tracker.opentrackr.org:1337/announce",
          "udp://zer0day.ch:1337/announce",
          "http://explodie.org:6969/announce",
          "udp://tracker.leechers-paradise.org:6969/announce",
          "udp://9.rarbg.com:2710/announce",
          "udp://p4p.arenabg.com:1337/announce",
          "udp://tracker.sktorrent.net:6969/announce",
          "http://p4p.arenabg.com:1337/announce",
          "udp://tracker.aletorrenty.pl:2710/announce",
          "http://tracker.aletorrenty.pl:2710/announce",
          "http://tracker.bittorrent.am/announce",
          "udp://tracker.kicks-ass.net:80/announce",
          "http://tracker.kicks-ass.net/announce",
          "http://tracker.baravik.org:6970/announce",
          "udp://tracker.piratepublic.com:1337/announce",
          "udp://213.163.67.56:1337/announce",
          "http://213.163.67.56:1337/announce",
          "udp://185.86.149.205:1337/announce",
          "http://74.82.52.209:6969/announce",
          "udp://94.23.183.33:6969/announce",
          "udp://74.82.52.209:6969/announce",
          "udp://151.80.120.114:2710/announce",
          "udp://109.121.134.121:1337/announce",
          "udp://168.235.67.63:6969/announce",
          "http://109.121.134.121:1337/announce",
          "udp://178.33.73.26:2710/announce",
          "http://178.33.73.26:2710/announce",
          "http://85.17.19.180/announce",
          "udp://85.17.19.180:80/announce",
          "http://210.244.71.25:6969/announce",
          "http://85.17.19.180/announce"
    	    ]
    	}
    	// let magnet = "magnet:?xt=urn:btih:ecbb13da11e73285940f2a450aa3ccea0f9c7e40&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://coppersurfer.tk:6969/announce&tr=udp://tracker4.piratux.com:6969/announce&tr=udp://eddie4.nl:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.coppersurfer.tk:80&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://open.demonii.com:1337/announce&tr=udp://tracker.pomf.se&tr=udp://tracker.blackunicorn.xyz:6969&tr=udp://tracker.leechers-paradise.org:6969&tr=http://retracker.uln-ix.ru/announce&tr=http://tracker1.infohash.org/announce&tr=udp://p4p.arenabg.ch:1337&tr=udp://p4p.arenabg.com:1337&tr=udp://glotorrents.pw:6969/announce&tr=http://tracker.nwps.ws:6969/announce&tr=http://tracker.dler.org:6969/announce&tr=http://tracker.flashtorrents.org:6969/announce&tr=http://mgtracker.org:2710/announce&tr=http://retracker.adminko.org/announce&tr=http://torrent.fedoraproject.org:6969/announce&tr=http://tracker.best-torrents.net:6969/announce&tr=http://tracker.tfile.me/announce&tr=udp://exodus.desync.com:6969&tr=udp://torrent.gresille.org:80/announce&tr=http://tracker.aletorrenty.pl:2710/announce&tr=http://tracker.pubt.net:2710/announce&tr=http://exodus.desync.com/announce&tr=udp://tracker.publichd.eu:80/announce&tr=http://inferno.demonoid.ph:3389/announce&tr=udp://tracker.publicbt.com:80/announce&tr=http://tracker.ex.ua/announce&tr=udp://exodus.desync.com:6969&tr=http://exodus.desync.com/announce&tr=udp://tracker.istole.it:80/announce&tr=udp://tracker.1337x.org:80/announce&tr=http://fr33dom.h33t.com:3310/announce&tr=udp://tracker.1337x.org:80/announce&tr=http://tracker.torrentbay.to:6969/announce&tr=udp://tracker.publichd.eu:80/announce&tr=http://tracker.trackerfix.com/announce&tr=udp://tracker.ccc.de:80/announce&tr=udp://pow7.com:80/announce&tr=udp://tracker.token.ro:80/announce&tr=udp://ipv4.tracker.harry.lu:80/announce&tr=http://bt.rghost.net/announce&tr=http://cpleft.com:2710/announce&tr=udp://9.rarbg.me:2710/announce&tr=udp://9.rarbg.com:2710/announce&tr=udp://9.rarbg.to:2710/announce&tr=udp://10.rarbg.me:80/announce&tr=udp://12.rarbg.me:80/announce&tr=udp://tracker.zond.org:80/announce&tr=udp://tracker.ilibr.org:6969/announce&tr=http://announce.torrentsmd.com:6969/announce&tr=udp://fr33domtracker.h33t.com:3310/announce"
    	// let magnet = "magnet:?xt=urn:btih:2a796c9d384f552d7dab2dce25661cc56a76ddca&dn=trolls.2016.1080p.web.dl.hevc.x265.rmteam.mkv&xl=287944474&tr=http://explodie.org:6969/announce&tr=http://tracker.tfile.me/announce&tr=http://bigfoot1942.sektori.org:6969/announce&tr=udp://eddie4.nl:6969/announce&tr=udp://tracker4.piratux.com:6969/announce&tr=udp://tracker.trackerfix.com:80/announce&tr=udp://tracker.pomf.se:80/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://9.rarbg.me:2710/announce&tr=udp://tracker.leechers-paradise.org:6969/announce&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://tracker.blackunicorn.xyz:6969/announce&tr=udp://tracker.internetwarriors.net:1337/announce&tr=udp://p4p.arenabg.ch:1337/announce&tr=udp://tracker.coppersurfer.tk:6969/announce&tr=udp://9.rarbg.to:2710/announce&tr=udp://tracker.openbittorrent.com:80/announce&tr=udp://glotorrents.pw:6969/announce&tr=udp://explodie.org:6969/announce&tr=udp://tracker.piratepublic.com:1337/announce&tr=udp://eddie4.nl:6969/announce&tr=udp://9.rarbg.com:2710/announce&tr=udp://9.rarbg.me:2710/announce&tr=udp://p4p.arenabg.ch:1337/announce&tr=udp://9.rarbg.to:2710/announce&tr=udp://p4p.arenabg.com:1337/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://coppersurfer.tk:6969/announce"
    	// let magnet = "magnet:?xt=urn:btih:749e77bbfebd97e689c132e3b663bb89425476dc&dn=Moana+%282016%29+BrRip+720p+x264+MP4&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969"
    	// let magnet = "magnet:?xt=urn:btih:1144427ac7adf534ed9713e2335c6a9ab3d77313" //&dn=Lincoln+2012+FRENCH+BDRiP+XviD+AC3-CARPEDIEM&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Fopen.demonii.com%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fexodus.desync.com%3A6969"
    	// let magnet = "magnet:?xt=urn:btih:11165a8fe9a472a2e3243b77484d2b5e38b23979"
    	// let magnet = "magnet:?xt=urn:btih:1b5ad195a79dfc49da7876bdba4d22274e1bcab7"
    	// let magnet = "magnet:?xt=urn:btih:fc9b4318e4d45ff9b52e60d28177d58bc573cc0d"
    	// let hash = "1F79699E6238306032155285BA20503649EA3CC8" // jumanji mp4
    	// let hash = "ecbb13da11e73285940f2a450aa3ccea0f9c7e40" // moana mp4
    	// let hash = "2a796c9d384f552d7dab2dce25661cc56a76ddca" // trolls mkv
    	// let hash = "1144427ac7adf534ed9713e2335c6a9ab3d77313" // lincoln avi
    	// let hash = "79b3923baf072a0913bda52cfc91946310645775" //
    	// let hash = "0047f203a7e58836eef6aa5aed90a42112195313"
    	const engine = torrentStream(`magnet:?xt=urn:btih:${req.params.hash}`, options)

    	let vids = []
    	engine.on('ready', function() {
    		engine.files.forEach(function(file) {
    			if (['.mkv', '.avi', '.webm', '.mp4'].includes(path.extname(file.name)))
    			{
    				vids.push(file)
    			}
    		})
    		if (vids.length > 0)
    		{
    			let movie = null
    			for (var i = vids.length - 1; i >= 0; i--)
    			{
    				if (vids[i].length === Math.max.apply(Math, vids.map((o) => o.length)))
    				{
    					movie = vids[i]
    					break
    				}
    			}
    			if (movie)
    			{
    				console.log(req.headers)
    				let resolution = {
    					720: '720x?',
    					480: '480x?',
    					360: '360x?'
    				}
    				console.log(`title : ${movie.name}, size : ${movie.length}, path : ${movie.path}`)
    				movie.select()
    				var stream = movie.createReadStream()
            console.log('ok')
    				var command = ffmpeg(stream)
    			    .outputOption('-movflags frag_keyframe+faststart')
         			// .outputOption('-movflags frag_keyframe')
         			.outputOption('-deadline realtime')
         			.outputOption('-cpu-used 2')
         			.outputOption('-threads 4')
           		// .outputOption('-preset ultrafast')
           		.audioCodec('libvorbis')
      				.videoCodec('libvpx')
      				.audioBitrate(128)
      				.videoBitrate(1024)
      				.format('webm')
      				.size(resolution[req.params.resolution])
    				.on('codecData', function(data) {
    				 	console.log('Input is ' + data.audio + ' audio with ' + data.video + ' video');
    				})
    				.on('progress', function(progress) {
    					console.log(progress);
    				})
    				pump(command, res)
    			}
    		}
})})

module.exports = router
