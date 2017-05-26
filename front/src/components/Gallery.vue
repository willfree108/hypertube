<template>
  <div v-infinite-scroll="loadMore" infinite-scroll-distance="10">
    <div class="moviePapa" v-if="$store.getters.GET_DISPLAYED_MOVIES.length > 0">
      <transition-group name="list" tag="div" class="moviePapa" v-if="$store.getters.GET_DISPLAYED_MOVIES.length > 0">
        <el-card :class="getClass(movie.imdb)" v-for="movie in $store.getters.GET_DISPLAYED_MOVIES" :key='movie'>
          <router-link :to='"/Movie/" + movie.imdb'>
            <span><h2>{{ movie.year }}</h2></span>
            <img class="miniature" :src="movie.cover" alt="">
            <el-rate
              class="rating"
              v-model="movie.rate"
              disabled
              show-text
              text-color="#ff9900"
              text-template="">
            </el-rate>
            <h1>{{ movie.title }}</h1>
          </router-link>
        </el-card>
      </transition-group>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    loadMore () {
      const len = this.$store.getters.GET_LEN
      this.$store.dispatch('updateLen', { newLen: len + 20 })
      this.$store.dispatch('updateDisplayedMovies', { loading: true })
    },
    getClass (imdb) {
      const user = this.$store.getters.GET_USER
      if (Object.keys(user).length !== 0 && user.seen && user.seen.length > 0 && user.seen.indexOf(imdb) > -1) {
        return 'box-card movie relative seen'
      } else {
        return 'box-card movie relative'
      }
    }
  },
  mounted () {
    this.$store.dispatch('updateLen', { newLen: 20 })
    this.$store.dispatch('updateDisplayedMovies', { loading: true })
    if (Object.keys(this.$store.getters.GET_USER).length === 0) {
      this.$store.dispatch('setUser', { id: this.$store.getters.GET_ID, ctx: this })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .relative{
    position: relative;
  }

  .movie {
    margin: 20px;
    width: 200px;
    max-width: 200px;
    height: 400px;
    box-sizing: border-box;
    flex: 1;
    flex-basis:200px;
    cursor: pointer;
  }

  .moviePapa {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    max-height: 100%;
    justify-content: space-around;
    max-width: 1280px;
    margin: auto;
  }

  .miniature {
    width: 100%;
    height: 100%;
  }

  .rating {
    position: absolute;
    top: 5px;
    right: 5px;
  }

  .movie h1 {
    position: absolute;
    bottom: 0px;
    text-align: center;
    left:0px;
    right: 0px;
    height: 30px;
    color: rgba(255, 255, 255, 0.7);
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000000+0,000000+54,000000+100&0+0,0.65+100 */
    background: -moz-linear-gradient(top, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 54%, rgba(0,0,0,0.65) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.35) 54%,rgba(0,0,0,0.65) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0.35) 54%,rgba(0,0,0,0.65) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00000000', endColorstr='#a6000000',GradientType=0 ); /* IE6-9 */
  }

  .movie span {
    position: absolute;
    text-align: left;
    left: 0px;
    right: 0px;
    height: 50px;
    color: white;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#000000+0,000000+46,000000+100&0.65+0,0+100 */
    background: -moz-linear-gradient(top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 46%, rgba(0,0,0,0) 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(top, rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.35) 46%,rgba(0,0,0,0) 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to bottom, rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.35) 46%,rgba(0,0,0,0) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#a6000000', endColorstr='#00000000',GradientType=0 ); /* IE6-9 */
  }

  .movie h2 {
    margin-left: 15px;
    margin-top: 10px;
  }

  .movie:hover {
    border-width: 2px;
    transition: all 0.2s;
  }

  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  .list-enter-active, .list-leave-active {
    transition: all 0.4s;
  }
  .list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
    opacity: 0;
    transform: translateX(-15px);
  }
  .seen {
    border: 1px dashed rgba(0, 0, 0, 0.4);
  }
</style>
