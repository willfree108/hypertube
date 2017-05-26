<template>
    <div class="">
        <div class="title-mobile mobile-visible"> <span>{{ movie.title }}</span> </div>
        <el-row class="marginTop">
            <div class="cardContainer">
                <div class="box-card movie">
                    <div class="fixheight">
                        <div class="title">
                            <span>{{ movie.title }}</span>
                        </div>
                        <div class="info">
                            <span class="inline"><h3>{{ $t('year') }}</h3><p>&nbsp;{{ movie.year }}</p></span>
                            <span class="inline"><h3>{{ $t('duration')}}</h3><p>&nbsp;{{ movie.runtime + 'min' }}</p></span>
                            <span class="inline"><h3>{{ $t('genre') }}</h3><p>&nbsp;{{ movie.genre.join(', ') }}</p></span>
                            <span class="inline"><h3>{{ $t('language') }}</h3><p>&nbsp;{{ movie.lang }}</p></span>
                            <span class="inline">
                              <h3>{{ $t('description') }}</h3><p> {{ movie.description.slice(0 , 100) + '...'  }}</p>
                            </span>
                            <span class="rating">
                                <el-rate
                                    v-model="movie.rate"
                                    disabled
                                    show-text
                                    text-color="#ff9900"
                                    :text-template="'{value} '+ $t('points')">
                                </el-rate>
                            </span>
                        </div>
                    </div>

                    <video-player class="trailer" id="video" :options="playerOptions"
                        @ready="playerReadied($event)">
                    </video-player>

                </div>
            </div>
        </el-row>
        <el-col :span="12" :offset="6" class="foot mobile-comments">
            <el-collapse class="mobile-visible">
                <el-collapse-item name="1">
                    <div class="info" style="color: black">
                        <span class="inline"><h3>{{ $t('year') }}</h3><p>&nbsp;{{ movie.year }}</p></span>
                        <span class="inline"><h3>{{ $t('duration')}}</h3><p>&nbsp;{{ movie.runtime + 'min' }}</p></span>
                        <span class="inline"><h3>{{ $t('genre') }}</h3><p>&nbsp;{{ movie.genre.join(', ') }}</p></span>
                        <span class="inline"><h3>{{ $t('language') }}</h3><p>&nbsp;{{ movie.lang }}</p></span>
                        <span class="inline">
                          <h3>{{ $t('description') }}</h3><p> {{ movie.description }}</p>
                        </span>
                        <span class="rating">
                            <el-rate
                                v-model="movie.rate"
                                disabled
                                show-text
                                text-color="#ff9900"
                                :text-template="'{value} '+ $t('points')">
                            </el-rate>
                        </span>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <el-card v-for="message in getComments" :key="message" class="box-card comment box-cardResponsive">
                <span class="inline">
                    <a :href='"http://localhost:3000/#/User/" + message.idUser'><h3>{{ message.username }}</h3></a>
                    <p>{{ message.message }}</p>
                    <div class="comment-date"><span>{{ message.created }}</span></div>
                </span>
            </el-card>
            <el-card class="box-card comment box-cardResponsive">
                <h1>{{ $t('newMessage') + ' :'}}</h1>
                <el-input
                    type="textarea"
                    :placeholder="$t('textArea')"
                    v-model="comment.message">
                </el-input>
                <div class="tright">
                    <el-button type="primary" @click="sendMessage">{{ $t('send') }}</el-button>
                    <el-button>{{ $t('cancel') }}</el-button>
                </div>
            </el-card>
        </el-col>
    </div>
</template>

<script>
  import config from '../api/config'
  import axios from 'axios'
  require('videojs-resolution-switcher')
  require('videojs-resolution-switcher/lib/videojs-resolution-switcher.css')

  export default {
    data () {
      return {
        movie: {
          title: 'Default title',
          description: 'Default plot',
          genre: [],
          rate: 4
        },
        comment: {
          message: ''
        },
        comments: [],
        playerSources: [{
          type: 'video/webm',
          src: `http://${config.host}:8080/api/movies/play/720`,
          label: '720p',
          res: 1
        },
        {
          type: 'video/webm',
          src: `http://${config.host}:8080/api/movies/play/480`,
          label: '480p',
          res: 2
        },
        {
          type: 'video/webm',
          src: `http://${config.host}:8080/api/movies/play/360`,
          label: '360p',
          res: 3
        }],
        playerOptions: {
          plugins: {
            videoJsResolutionSwitcher: {
              ui: true,
              default: 3,
              dynamicLabel: true
            }
          },
          playbackRates: [0.7, 1, 1.3, 1.5, 2],
          poster: 'https://admissions.vanderbilt.edu/insidedores/manage/wp-content/uploads/doge-pattern-27481-2880x1800.jpg'
        }
      }
    },
    methods: {
      playerReadied (player) {
        if (player.updateSrc) {
          axios.get(`movies/${this.$route.params.imdb}`)
            .then(res => {
              this.playerSources[0].src = `http://${config.host}:8080/api/movies/play/720/${res.data.hash}`
              this.playerSources[1].src = `http://${config.host}:8080/api/movies/play/480/${res.data.hash}`
              this.playerSources[2].src = `http://${config.host}:8080/api/movies/play/360/${res.data.hash}`
              this.movie = res.data

              player.poster(res.data.background)
              // let options = this.playerOptions

              setTimeout((player) => {
                if (res.data.subtitles.en) {
                  player.addRemoteTextTrack({
                    label: 'English',
                    language: 'en',
                    kind: 'captions',
                    manualCleanup: false,
                    default: false,
                    src: `${res.data.subtitles.en}`
                  })
                }
                if (res.data.subtitles.fr) {
                  player.addRemoteTextTrack({
                    label: 'Francais',
                    language: 'fr',
                    kind: 'captions',
                    manualCleanup: false,
                    default: false,
                    src: `${res.data.subtitles.fr}`
                  })
                }
              }, 2000, player)

              player.updateSrc(this.playerSources)
              player.on('resolutionchange', function () {
                // console.log('switch the source', player.src())
              })
            })
            .catch(err => err)
        }
      },
      sendMessage () {
        const imdb = this.$route.params.imdb
        const user = this.$store.getters.GET_USER
        const creat = new Date()
        const created = creat.toISOString().slice(0, 10)
        const newMessage = { idUser: user._id, username: user.username, message: this.comment.message, imdb, created }

        if (this.comment.message === '') return false
        axios.get('comments/' + imdb)
          .then(res => {
            this.comments = res.data.comments
            axios.post('comments', newMessage)
              .then(() => {
                this.comments.push(newMessage)
                this.$notify({
                  showClose: true,
                  message: this.$t('messageSuccessComment'),
                  type: 'success'
                })
                this.comment = { message: '' }
              })
              .catch(() => {
                this.$notify({
                  showClose: true,
                  message: this.$t('messageError'),
                  type: 'error'
                })
              })
          })
          .catch(() => {
            this.$notify({
              showClose: true,
              message: this.$t('messageError'),
              type: 'error'
            })
          })
      }
    },
    computed: {
      getComments () {
        return this.comments
      }
    },
    mounted () {
      const imdb = this.$route.params.imdb
      let user = this.$store.getters.GET_USER
      let myDiv = document.getElementById('appFixed')
      myDiv.scrollTop = 0

      if (Object.keys(user).length !== 0) {
        if (user.seen.indexOf(imdb) === -1) {
          user.seen.push(imdb)
          axios.put('users', user)
            .then(res => res)
            .catch(() => {
              const index = user.seen.indexOf(imdb)
              user.seen.splice(index, 1)
            })
        }
      }
      axios.get('comments/' + imdb)
        .then(res => {
          this.comments = res.data.comments
        })
        .catch(() => {
          this.$notify({
            showClose: true,
            message: this.$t('messageError'),
            type: 'error'
          })
        })
    }
  }
</script>





<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .video-js .vjs-custom-skin {
        height: 100%!important;
    }
    .vjs_video_3-dimensions {
        height: 100% !important;
    }
    .vjs_video_513-dimensions {
        height: 100% !important;
    }
    .vjs_video_936-dimensions {
        height: 100% !important;
    }
    .video-js  {
        height: 100%;
    }

    .video-js .vjs-big-play-button {
        position: absolute;
        left:0;
        right:0;
        bottom: 0;
        top:0;
        margin: auto;
        width:70px;
        height:70px;
        border-radius: 1000% !important;
        padding: 20px;
    }
    .video-js .vjs-big-play-button
    {
        line-height: 70px !important;
    }
    .video-js .vjs-control-text{
        display: none !important;
        background-color: yellow !important;
    }



    .marginTop {
        margin-bottom: 20px;
        display: flex;
        justify-content: center;
    }

    .title {
        margin-left: 3%;
        margin-top: 3%;
        font-size: calc(12px + 2vw);
    }

    .title-mobile {
        line-height: 2;
        text-align: center;
        justify-content: center;
        font-size: calc(24px + 2vw);
        width: 100%;
        height: 100%;
        color: white;
        background: black;
    }
    .rating {
        text-align: left;
    }

    .container {
        display: flex;
    }

    .imageMovie {
        height: 400px;
        width: 250px;
        flex: 1;
    }

    .info {
        padding: 20px;
        flex:1;
        color: white;
    }

    .imageMovie img{
        height: 100%;
        width: 100%;
    }

    .video {
        height: 750px;
        width: 100%;
        border: 1px dashed rgba(0, 0, 0, 0.5);
        border-radius: 20px;
        text-align: center;
        background: url('https://media.giphy.com/media/8b29QJQgVwUW4/giphy.gif');
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .video span {
        line-height: 700px;
    }

    .el-rate {
        line-height: 2;
    }

    .inline {
        display: block;
    }
    .inline + .inline {
        padding-top: 10px;
    }
    .inline h3, .inline p{
        display: inline-block;
    }

    .inline h3 {
        font-weight: bolder;
    }

    .inline h3::after {
        content: ' :';
    }

    .inline p {
        font-size: 0.9em;
        /*color: rgba(0, 0, 0, 0.9);*/
    }

    .inline div {
        text-align: left;
    }

    .inline div span {
        font-size: 0.8em;
        font-style: italic;
    }

    /**/
    /*Player part with infos for the Netflix-like render.*/
    /**/

    .cardContainer {
        flex:1;
        margin: 30px;
        height: 32vw;
    }

    .movie {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1;
        overflow: hidden;
    }

    .fixheight {
        background: #000;
        color: white;
        z-index: 2;
        width: 30%;
        position: absolute;
        top: 0;
        bottom: 0;
    }

    /*.fixheight::before {
        content: '';
        position: absolute;
        z-index: 10;
        background-image: -webkit-gradient(linear,left top,right top,from(#000),to(transparent));
        background-image: -webkit-linear-gradient(left,#000,transparent);
        background-image: -moz-linear-gradient(left,#000,transparent);
        background-image: -o-linear-gradient(left,#000,transparent);
        background-image: linear-gradient(to right,#000,transparent);
        top: 0;
        bottom: 0;
        left: 100%;
        width: 275px;
    }*/

    .trailer {
        width: 70%;
        height: 100%;
        right: 0;
        top: 0;
        bottom: 0;
        position: absolute;
        background-size: cover;
        background-position: center 10%;
        transition-duration: 750ms;
        -webkit-transform: translateZ(0);
    }

    .player-button {
        display: inherit;
        position: absolute;
        left:0;
        right:0;
        top:0;
        bottom:0;
        margin:auto;
        width: 20%;
        min-width: 150px;
        cursor: pointer;
        z-index: 30;
        background-image: url('../../static/resources/player.gif');
    }

    /* END */


    .comment + .comment{
        margin-top: 20px;
    }

    .foot {
        margin-bottom: 100px;
    }


    /**/
    /*Querries handler for mobile and responsive vertion.*/
    /**/

    @media (max-width: 900px) {
        .box-cardResponsive {
            border: none;
            background-color: transparent;
            box-shadow: none;
            margin-top: 0px;
            width: 100%;
        }
        .form {
            min-width:100%;
        }
        .box-itemResponsive {
            margin-bottom: 40px;
        }
        .tright {
            text-align: center;
        }
        .fixheight {
            display: none;
        }
        .trailer {
            display: block;
            width: 100%;
        }
        .marginTop {
            margin-top: 0px;
            margin-bottom: 0px;
        }
        .mobile-comments {
            margin-left: inherit;
            width: 100%;
        }
    }
    @media (min-width: 901px) {
        .mobile-visible {
            display: none;
        }
    }

  .comment-date{
    right: 10px;
    position: absolute;
  }
    /* END */
</style>
