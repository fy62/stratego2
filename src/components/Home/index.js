import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withAuthorization, AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import Messages from '../Messages';
import NewGame from '../NewGame';
import OpenGames from '../OpenGames';

class HomePage extends Component {

  componentDidMount() {
    this.props.firebase.users().on('value', snapshot => {
      this.props.onSetUsers(snapshot.val());
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, history } = this.props;
    return (
      <AuthUserContext.Consumer>
        {authUser => (
        <div>
          <h1>Home Page</h1>
          <p>The Home Page is accessible by every signed in user.</p>

          <OpenGames history={history} authUser={authUser}/>
          <NewGame history={history}/>
          <br/>
          <Messages users={users} />
        </div>
        )}
      </AuthUserContext.Consumer>
      );
  }
}

const mapStateToProps = state => ({
  users: state.userState.users,
});

const mapDispatchToProps = dispatch => ({
  onSetUsers: users => dispatch({ type: 'USERS_SET', users }),
});

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withAuthorization(condition),
)(HomePage);
