import React, { Component } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

class NewGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      newGame: false
    };
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateGame = (event, authUser) => {
    const newGameRef = this.props.firebase.db.ref('games').push();
    const key = newGameRef.key;

    newGameRef.set({
      gid: key,
      gameName: this.state.text,
      userId1: authUser.uid,
      username1: authUser.username,
      open: true,
      active: true,
      done: false,
      public: true,
      createdAt: {'.sv': 'timestamp'},
    });

    this.setState({ text: '', newGame: true, route: '/setup/' + key + '/red' });

    event.preventDefault();
    //this.props.history.push('/setup/' + key + '/red');
  };

  render() {
    const { text } = this.state;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          (this.state.newGame ? <Redirect push to={{pathname: this.state.route, state: {authUser: authUser}}}/>
          :
          <div>
            <h3> Create a New Game</h3>
            <form
              onSubmit={event =>
                this.onCreateGame(event, authUser)
              }
            >
              <input
                type="text"
                value={text}
                onChange={this.onChangeText}
              />
              <button type="submit">Send</button>
            </form>
          </div>
          )
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default compose(
  withFirebase,
  withRouter,
  connect(),
)(NewGame);
