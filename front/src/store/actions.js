import axios from 'axios'

var toggle = function (a, b, classA, classB) {
  a.classList.remove(classA)
  a.classList.add(classB)
  b.classList.remove(classB)
  b.classList.add(classA)
}

const actions = {
  signIn ({ commit }, { token, id }) {
    commit('SET_AUTH', { token, id })
  },
  signOut ({ commit }) {
    commit('DEL_AUTH')
    commit('UPDATE_USER', { newUser: {} })
  },
  async setUser ({ commit }, { id, ctx }) {
    try {
      const newUser = await axios.get('users/' + id)
      if (ctx) ctx.$i18n.locale = newUser.data.local
      let eng = document.getElementById('en')
      let fr = document.getElementById('fr')
      if (ctx.$i18n.locale === 'fr') {
        toggle(eng, fr, 'langSelect')
      } else {
        toggle(fr, eng, 'langSelect')
      }
      commit('UPDATE_USER', { newUser: newUser.data })
    } catch (e) {
    }
  },
  loadOn ({ commit }) {
    commit('LOAD_ON')
  },
  loadOff ({ commit }) {
    commit('LOAD_OFF')
  },
  init ({ commit }) {
    commit('INIT')
  },
  loadMovies ({ commit }, { newOriginMovies }) {
    commit('LOAD_ORIGIN_MOVIES', { newOriginMovies })
    commit('UPDATE_DISPLAYED_MOVIES', { loading: false })
  },
  updateLen ({ commit }, { newLen }) { commit('UPDATE_LEN', { newLen }) },
  updateDisplayedMovies ({ commit }, { loading }) { commit('UPDATE_DISPLAYED_MOVIES', { loading }) },
  updateSearch ({ commit }, { newSearch }) { commit('UPDATE_SEARCH', { newSearch }) },
  updateSort ({ commit }, { newSort }) { commit('UPDATE_SORT', { newSort }) },
  updateDirection ({ commit }, { newDirection }) { commit('UPDATE_DIRECTION', { newDirection }) },
  updateRangeRate ({ commit }, { newRangeRate }) { commit('UPDATE_RANGE_RATE', { newRangeRate }) },
  updateRangeYear ({ commit }, { newRangeYear }) { commit('UPDATE_RANGE_YEAR', { newRangeYear }) },
  updateGenre ({ commit }, { newGenre }) { commit('UPDATE_GENRE', { newGenre }) },
  updateChange ({ commit }, { newChange }) { commit('UPDATE_CHANGE', { newChange }) }
}

export default actions
