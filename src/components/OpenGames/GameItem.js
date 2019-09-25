import React, { Component } from 'react';

class GameItem extends Component {

  render() {
    const { name, id, onJoinGame, authUser } = this.props;

    return (
      <li>
        <span>
          <strong>
            {name}
          </strong>
          <button onClick={event => onJoinGame(event, authUser, id)}>Join</button>
        </span>
      </li>
    );
  }
}

export default GameItem;
