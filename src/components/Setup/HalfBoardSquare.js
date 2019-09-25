import React, { Component } from 'react';
import styled from 'styled-components';

const Square = styled.div`
  margin: 2px;
  flex: 1 1 0;
`;
const Sel = styled.div`
  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
    float: left;
  }
`;

export default class HalfBoardSquare extends Component {
	constructor(props) {
		super(props);
    this.handleChange = this.handleChange.bind(this);
	}

  handleChange(e) {
    this.props.enterPieceInHalfBoardSquare(this.props.index, e.target.value);
  }

	render () {
		const type = this.props.type;
    const color = (type === 'W') ? 'blue' : 'limegreen';

		return (
      <Square style={{backgroundColor:color}}>
        {(this.props.index >= 0)
          ?
            <Sel>
              <select name="piece" defaultValue="?" onChange={this.handleChange}>
                <option value="?" hidden disabled>?</option>
                <option value="B">B</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="S">S</option>
                <option value="F">F</option>
              </select>
            </Sel>

          : <Sel/>}
			</Square>
			)
	}

}