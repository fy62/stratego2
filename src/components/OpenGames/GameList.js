import React, { Component } from 'react';

import GameItem from './GameItem';

class GameList extends Component {

  render() {
    const { games,
      onJoinGame,
      authUser } = this.props;

    return (
      <ul>
        {games.map(game => (
          <GameItem
            key={game.gid}
            name={game.gameName}
            id={game.gid}
            onJoinGame={onJoinGame}
            authUser={authUser}
          />
        ))}
      </ul>
    );
  }
}

export default GameList;