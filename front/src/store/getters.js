const getters = {
  GET_AUTH: (state) => state.authentificated,
  GET_LOADING: (state) => state.loading,
  GET_TOKEN: (state) => state.token,
  GET_ID: (state) => state.id,
  GET_ORIGIN_MOVIES: (state) => state.originMovies,
  GET_DISPLAYED_MOVIES: (state) => state.displayedMovies,
  GET_$T: (state) => state.$t,
  GET_SEARCH: (state) => state.search,
  GET_SORT: (state) => state.sort,
  GET_DIRECTION: (state) => state.direction,
  GET_LEN: (state) => state.len,
  GET_RANGE_RATE: (state) => state.rangeRate,
  GET_RANGE_YEAR: (state) => state.rangeYear,
  GET_GENRE: (state) => state.genre,
  GET_CHANGE: (state) => state.change,
  GET_USER: (state) => state.user
}

export default getters
