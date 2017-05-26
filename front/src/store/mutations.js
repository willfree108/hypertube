import axios from 'axios'

const asc = (a, b) => {
  if (a < b) return -1
  if (a > b) return 1
  return 0
}

const desc = (a, b) => {
  if (a > b) return -1
  if (a < b) return 1
  return 0
}

const genreReference = ['', '', 'action', 'adventure', 'animation', 'biography', 'comedy', 'crime', 'documentary', 'drama', 'family', 'fantasy', 'game-show', 'history', 'horror', 'music', 'musical', 'mystery', 'news', 'reality-tv', 'romance', 'sci-fi', 'sitcom', 'sport', 'talk-show', 'thriller', 'war', 'western']
genreReference

const mutations = {
  INIT: (state) => {
    const id = localStorage.getItem('id')
    const token = localStorage.getItem('token')

    if (token && id) {
      state.id = id
      state.token = token
      state.authentificated = true
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
    }
  },
  SET_AUTH: (state, { token, id }) => {
    state.authentificated = true
    state.token = token
    state.id = id
    localStorage.setItem('token', token)
    localStorage.setItem('id', id)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
  },
  DEL_AUTH: (state) => {
    state.id = null
    state.token = null
    state.authentificated = false

    localStorage.removeItem('id')
    localStorage.removeItem('token')
    axios.defaults.headers.common['Authorization'] = ''
  },
  UPDATE_DISPLAYED_MOVIES: (state, { loading }) => {
    const direction = state.direction ? asc : desc

    if (loading === false) {
      let myDiv = document.getElementById('appFixed')
      myDiv.scrollTop = 0
      state.len = 20
    }

    state.displayedMovies = state.originMovies
      .filter(m => m.title.toLowerCase().includes(state.search.toLowerCase()))
      .filter(m => m.rate >= state.rangeRate[0] && m.rate <= state.rangeRate[1])
      .filter(m => m.year >= state.rangeYear[0] && m.year <= state.rangeYear[1])
      .filter(m => {
        if (state.genre.length === 0) return true
        return state.genre.filter(i => m.genre.indexOf(genreReference[i]) > -1).length > 0
      })
      .sort((a, b) => direction(a[state.sort], b[state.sort]))
      .slice(0, state.len)
  },
  LOAD_ON: (state) => { state.loading = true },
  LOAD_OFF: (state) => { state.loading = false },
  LOAD_ORIGIN_MOVIES: (state, { newOriginMovies }) => { state.originMovies = newOriginMovies },
  UPDATE_SEARCH: (state, { newSearch }) => { state.search = newSearch },
  UPDATE_DIRECTION: (state, { newDirection }) => { state.direction = newDirection },
  UPDATE_SORT: (state, { newSort }) => { state.sort = newSort },
  UPDATE_LEN: (state, { newLen }) => { state.len = newLen },
  UPDATE_RANGE_RATE: (state, { newRangeRate }) => { state.rangeRate = newRangeRate },
  UPDATE_RANGE_YEAR: (state, { newRangeYear }) => { state.rangeYear = newRangeYear },
  UPDATE_GENRE: (state, { newGenre }) => { state.genre = newGenre },
  UPDATE_CHANGE: (state, { newChange }) => { state.change = newChange },
  UPDATE_USER: (state, { newUser }) => { state.user = newUser }
}

export default mutations
