import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  // User store
  id: null,
  token: null,
  loading: false,
  authentificated: false,
  user: {},

  // Movies store
  len: 20,
  genre: [],
  search: '',
  rangeYear: [1900, 2017],
  rangeRate: [0, 5],
  sort: 'title',
  direction: true,
  originMovies: [],
  displayedMovies: [],
  change: false
}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})
