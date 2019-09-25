const INITIAL_STATE = {
  games: null,
};

const applySetGames = (state, action) => ({
  ...state,
  games: action.games,
});

function gameReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'GAMES_SET': {
      return applySetGames(state, action);
    }
    default:
      return state;
  }
}

export default gameReducer;