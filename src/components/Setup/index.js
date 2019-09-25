import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import styled from 'styled-components';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';

import HalfBoardSquare from './HalfBoardSquare';
import PieceTable from './PieceTable';
import gameLogic from '../../game-logic/Board';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 8%;
  margin-right: 8%;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  width: 100%;
`;

const pieceArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'B', 'F', 'S'];
const countArray = [8, 5, 4, 4, 4, 3, 2, 1, 1, 6, 1, 1];
const pieceIndex = {
  '1': 0,
  '2': 1,
  '3': 2,
  '4': 3,
  '5': 4,
  '6': 5,
  '7': 6,
  '8': 7,
  '9': 8,
  'B': 9,
  'F': 10,
  'S': 11,
}

class Setup extends Component {
  constructor(props) {
    super(props);
    console.log(props)
    this.state = {
      possibleStart:[],
      errorMessage: '',
      errorDetail: '',
      pieceCounter: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
    this.enterPieceInHalfBoardSquare = this.enterPieceInHalfBoardSquare.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.firebase.db.ref('games/' + this.props.match.params.id)
      .on('value', snapshot => {
        const game = snapshot.val();
        this.setState({ game: game });
        console.log(game)
      });
  }

  componentWillUnmount() {
    this.props.firebase.db.ref('games/' + this.props.match.params.id).off();
  }

  enterPieceInHalfBoardSquare(index, value) {
		const newPossibleStart = [...this.state.possibleStart];
		newPossibleStart[Number(index)] = value;

    const pc = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < newPossibleStart.length; i++) {
      if (newPossibleStart[i]) {
        pc[pieceIndex[newPossibleStart[i]]]++;
      }
    }
    this.setState({ possibleStart: newPossibleStart, pieceCounter: pc });
  }

  handleSubmit(e) {
		e.preventDefault();
		let valid = true;
    const sorted = this.state.possibleStart.sort();
    const allPieces = gameLogic.allPieces;

		if (sorted.length !== 40) {
			valid = false;
			this.setState({ errorMessage: 'Please fill in all 40 fields.' });
		}
		else {
			const pieceCount = {};
			for (let i = 0; i < sorted.length; i++) {
				if (pieceCount[sorted[i]] === undefined) pieceCount[sorted[i]] = 0;
				pieceCount[sorted[i]]++;

				if (sorted[i] !== allPieces[i]) {
					valid = false;
					this.setState({ errorMessage: 'Incorrect input for starting pieces.' });
				}
			}
		}
		// if (valid) {
		// 	if (this.state.playerColor === 'red') {
		// 		this.setState({ errorMessage: '', errorDetail: '' });
		// 		store.dispatch(setRedStart(this.state.possibleStart, this.state.player, true));
		// 		socket.emit('redComplete', this.state.possibleStart, this.state.player, true);
		// 		hashHistory.push(`/waiting`);  //goto app
		// 	}
		// 	else {
		// 		this.setState({ errorMessage: '', errorDetail: '' });
		// 		store.dispatch(setBlueStart(this.state.possibleStart, this.state.player, true));
		// 		socket.emit('blueComplete', this.state.possibleStart, this.state.player, true);
		// 		hashHistory.push(`/waiting`);  //goto app
		// 	}
		// }
  }

  handleRandom() {
		const rand = gameLogic.shuffle(gameLogic.allPieces);
		// if (this.state.playerColor === 'red') {
		// 	store.dispatch(setRedStart(rand));
		// 	socket.emit('redComplete', rand, this.state.player, true);
		// 	hashHistory.push(`/waiting`);  //goto app
		// 	}
		// else {
		// 	store.dispatch(setBlueStart(rand));
		// 	socket.emit('blueComplete', rand, this.state.player, true);
		// 	hashHistory.push(`/waiting`);  //goto app
		// }
	}

  render() {
    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h2> Game Setup {this.state.game ? ' - ' + this.state.game.gameName : null} </h2>
            {this.state.game ? <h4> {'Player 1 (Red): ' + this.state.game.username1} </h4>  : null}
            {this.state.game ? <h4> {'Player 2 (Blue): ' + this.state.game.username2} </h4>  : null}
            <form
              onSubmit={this.handleSubmit}
            >
              <Container>
              {
                gameLogic.halfBoard.map( (row,i) => (
                <Row key={i}>
                  {
                    row.map( (type, j) => (
                      <HalfBoardSquare
                      key={`${i}+${j}`}
                      type={type}
                      index={i * 10 + j - 10}
                      enterPieceInHalfBoardSquare={this.enterPieceInHalfBoardSquare}/>
                    ))
                  }
                </Row>
                ))
              }
              <button type="submit">Send</button>
              { (this.state.errorMessage) && <div className="warning"><h3 style={{color: 'darkred'}}>{this.state.errorMessage}</h3></div> }
              </Container>
            </form>
            <PieceTable pieceArray={pieceArray} pieceCounter={this.state.pieceCounter} countArray={countArray} />
          </div>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default compose(
  withFirebase,
  connect(),
)(Setup);
