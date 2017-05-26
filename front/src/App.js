import vueSlider from 'vue-slider-component'
import { mapMutations, mapActions } from 'vuex'
import store from './store'
import axios from 'axios'
store.dispatch('init')

var toggle = function (a, b, classA, classB) {
  a.classList.remove(classA)
  a.classList.add(classB)
  b.classList.remove(classB)
  b.classList.add(classA)
}

export default {
  components: {
    vueSlider
  },
  data () {
    return {
      genre: [],
      data2: [
        { id: 2, label: this.$t('action') },
        { id: 3, label: this.$t('adventure') },
        { id: 4, label: this.$t('animation') },
        { id: 5, label: this.$t('biography') },
        { id: 6, label: this.$t('comedy') },
        { id: 7, label: this.$t('crime') },
        { id: 8, label: this.$t('documentary') },
        { id: 9, label: this.$t('drama') },
        { id: 10, label: this.$t('family') },
        { id: 11, label: this.$t('fantasy') },
        { id: 12, label: this.$t('history') },
        { id: 13, label: this.$t('horror') },
        { id: 14, label: this.$t('music') },
        { id: 15, label: this.$t('musical') },
        { id: 16, label: this.$t('mystery') },
        { id: 17, label: this.$t('news') },
        { id: 18, label: this.$t('realityTv') },
        { id: 19, label: this.$t('romance') },
        { id: 20, label: this.$t('sciFi') },
        { id: 21, label: this.$t('sitcom') },
        { id: 22, label: this.$t('sport') },
        { id: 23, label: this.$t('talkShow') },
        { id: 24, label: this.$t('thriller') },
        { id: 25, label: this.$t('war') },
        { id: 26, label: this.$t('western') }
      ],
      menuIndex: 'SignIn',
      menu: true,
      subIndex: '1',
      modeRouter: true,
      sliderRangeRate: {
        value: [0, 5],
        width: '100%',
        height: 4,
        dotSize: 14,
        min: 0,
        max: 5,
        interval: 0.2,
        disabled: false,
        show: true,
        tooltip: 'always',
        piecewise: true
      },
      sliderRangeYear: {
        value: [1900, 2017],
        width: '100%',
        height: 4,
        dotSize: 14,
        min: 1900,
        max: 2017,
        interval: 1,
        disabled: false,
        show: true,
        tooltip: 'always',
        piecewise: true
      }
    }
  },
  methods: {
    toggleSidebar () {
      let sidebar = document.getElementById('sidebar')
      let appFixed = document.getElementById('appFixed')
      if (sidebar.classList.contains('menuSideRight')) {
        sidebar.classList.remove('menuSideRight')
        sidebar.classList.add('menuSideLeft')
        appFixed.classList.remove('appFixedRight')
        appFixed.classList.add('appFixedLeft')
      } else {
        this.$router.push('/Gallery')
        sidebar.classList.remove('menuSideLeft')
        sidebar.classList.add('menuSideRight')
        appFixed.classList.remove('appFixedLeft')
        appFixed.classList.add('appFixedRight')
      }
    },
    delog () {
      let sidebar = document.getElementById('sidebar')
      let appFixed = document.getElementById('appFixed')

      sidebar.classList.remove('menuSideRight')
      sidebar.classList.add('menuSideLeft')
      appFixed.classList.remove('appFixedRight')
      appFixed.classList.add('appFixedLeft')
      this.$store.dispatch('signOut')
      this.$notify({
        showClose: true,
        message: '😖',
        type: 'info'
      })
      this.$router.push('/')
    },
    changeLang (lang) {
      this.$i18n.locale = lang
      this.data2 = [
        { id: 2, label: this.$t('action') },
        { id: 3, label: this.$t('adventure') },
        { id: 4, label: this.$t('animation') },
        { id: 5, label: this.$t('biography') },
        { id: 6, label: this.$t('comedy') },
        { id: 7, label: this.$t('crime') },
        { id: 8, label: this.$t('documentary') },
        { id: 9, label: this.$t('drama') },
        { id: 10, label: this.$t('family') },
        { id: 11, label: this.$t('fantasy') },
        { id: 12, label: this.$t('history') },
        { id: 13, label: this.$t('horror') },
        { id: 14, label: this.$t('music') },
        { id: 15, label: this.$t('musical') },
        { id: 16, label: this.$t('mystery') },
        { id: 17, label: this.$t('news') },
        { id: 18, label: this.$t('realityTv') },
        { id: 19, label: this.$t('romance') },
        { id: 20, label: this.$t('sciFi') },
        { id: 21, label: this.$t('sitcom') },
        { id: 22, label: this.$t('sport') },
        { id: 23, label: this.$t('talkShow') },
        { id: 24, label: this.$t('thriller') },
        { id: 25, label: this.$t('war') },
        { id: 26, label: this.$t('western') }
      ]
      let eng = document.getElementById('en')
      let fr = document.getElementById('fr')
      if (lang === 'fr') {
        toggle(eng, fr, 'langSelect')
      } else {
        toggle(fr, eng, 'langSelect')
      }
      this.genre = []
      this.$store.dispatch('updateGenre', { newGenre: this.genre})
      if (this.$store.getters.GET_CHANGE === false) {
        this.$store.dispatch('updateChange', { newChange: true })
      }
      // this.$store.dispatch('updateDisplayedMovies', { loading: false })
    },
    sortBy (newSort) {
      this.$router.push('/Gallery')
      this.$store.dispatch('updateSort', { newSort })
      if (this.$store.getters.GET_CHANGE === false) {
        this.$store.dispatch('updateChange', { newChange: true })
      }
      // this.$store.dispatch('updateDisplayedMovies', { loading: false })
    },
    handleCheckChange (data, checked, indeterminate) {
      this.$router.push('/Gallery')
      if (checked) this.genre.push(data.id)
      else {
        var index = this.genre.indexOf(data.id)
        this.genre.splice(index, 1)
      }
      this.$store.dispatch('updateGenre', { newGenre: this.genre})
      if (this.$store.getters.GET_CHANGE === false) {
        this.$store.dispatch('updateChange', { newChange: true })
      }
      // this.$store.dispatch('updateDisplayedMovies', { loading: false })
    }
  },
  computed: {
    isAuth () {
      return this.$store.getters.GET_AUTH
    },
    isLoading () {
      return this.$store.getters.GET_LOADING
    },
    search: {
      get () {
        return this.$store.getters.GET_SEARCH
      },
      set (value) {
        this.$router.push('/Gallery')
        this.$store.dispatch('updateSearch', { newSearch: value })
        if (this.$store.getters.GET_CHANGE === false) {
          this.$store.dispatch('updateChange', { newChange: true })
        }
        // this.$store.dispatch('updateDisplayedMovies', { loading: false })
      }
    },
    direction: {
      get () {
        return this.$store.getters.GET_DIRECTION
      },
      set (newDirection) {
        this.$router.push('/Gallery')
        this.$store.dispatch('updateDirection', { newDirection })
        if (this.$store.getters.GET_CHANGE === false) {
          this.$store.dispatch('updateChange', { newChange: true })
        }
        // this.$store.dispatch('updateDisplayedMovies', { loading: false })
      }
    },
    rangeRate: {
      get () {
        return this.$store.getters.GET_RANGE_RATE
      },
      set (newRangeRate) {
        this.$router.push('/Gallery')
        this.$store.dispatch('updateRangeRate', { newRangeRate })
        if (this.$store.getters.GET_CHANGE === false) {
          this.$store.dispatch('updateChange', { newChange: true })
        }
        // this.$store.dispatch('updateDisplayedMovies', { loading: false })
      }
    },
    rangeYear: {
      get () {
        return this.$store.getters.GET_RANGE_YEAR
      },
      set (newRangeYear) {
        this.$router.push('/Gallery')
        this.$store.dispatch('updateRangeYear', { newRangeYear })
        if (this.$store.getters.GET_CHANGE === false) {
          this.$store.dispatch('updateChange', { newChange: true })
        }
        // this.$store.dispatch('updateDisplayedMovies', { loading: false })
      }
    }
  },
  mounted () {
    axios.get('movies')
      .then(res => {
        let newOriginMovies = res.data.movies.sort((a, b) => {
          if(a.title < b.title) return -1
          if(a.title > b.title) return 1
          return 0
        })
        this.$store.dispatch('loadMovies', { newOriginMovies })

        setInterval((store) => {
          if (store.getters.GET_CHANGE) {
            store.dispatch('updateDisplayedMovies', { loading: false })
            store.dispatch('updateChange', { newChange: false })
          }
        }, 200, this.$store)
      })
      .catch(err => err)
  }
}
