import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import GameList from './GameList';

class OpenGames extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      loading: false,
      joined: false
    };
  }

  componentDidMount() {
    if (!this.props.games.length) {
      this.setState({ loading: true });
    }

    this.onListenForGames();
  }

  // componentDidUpdate(props) {
  //   this.onListenForGames();
  // }

  onListenForGames = () => {
    this.props.firebase.db.ref('games')
      .orderByChild('open')
      .equalTo(true)
      .on('value', snapshot => {
        const games = snapshot.val();
        const notSelf = {};
        for (let k in games) {
          if (games[k].userId1 !== this.props.authUser.uid) notSelf[k] = games[k];
        }
        this.props.onSetGames(notSelf);
        this.setState({ loading: false });
      });
  };

  onJoinGame = (event, authUser, gId) => {
    const gameRef = this.props.firebase.db.ref('games/' + gId);

    gameRef.update({
      userId2: authUser.uid,
      username2: authUser.username,
      open: false,
    });
    this.setState({ joined: true, route: '/setup/' + gId + '/blue' });
  };

  componentWillUnmount() {
    this.props.firebase.db.ref('games').off();
  }

  render() {
    const { games } = this.props;
    const { loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          (this.state.joined ? <Redirect push to={{pathname: this.state.route, state: {authUser: authUser}}}/>
          :
          <div>
            <h3> Open Games</h3>
            {loading && <div>Loading ...</div>}

            {games && (
              <GameList
                games={games}
                onJoinGame={this.onJoinGame}
                authUser={authUser}
              />
            )}

            {!games && <div>There are no open games ...</div>}

          </div>
          )
        )}
      </AuthUserContext.Consumer>
    );
  }
}

const mapStateToProps = state => ({
  games: Object.keys(state.gameState.games || {}).map(
    key => ({
      ...state.gameState.games[key],
      uid: key,
    }),
  ),
});

const mapDispatchToProps = dispatch => ({
  onSetGames: games =>
    dispatch({ type: 'GAMES_SET', games }),
});

export default compose(
  withFirebase,
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(OpenGames);
