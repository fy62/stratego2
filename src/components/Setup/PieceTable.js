import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);



const useStyles = {
  root: {
    width: '100%',
    marginTop: '3%',
    marginLeft: '5px',
    marginRight: '5px',
  },
}

const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

class PieceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer = (event, open) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    this.setState({ open: open });
  };

  render() {
    return (
      <div>
        <Button onClick={(e) => {this.toggleDrawer(e, true)}}>Open Left</Button>
        <Drawer open={this.state.open} onClose={(e) => {this.toggleDrawer(e, false)}} PaperProps={{style: {overflow: 'hidden'}}}>
          <Paper style={useStyles.root}>
            <Table style={{ width: "250px" }} size="small" padding="none">
              <colgroup>
                <col style={{width:'20%'}}/>
                <col style={{width:'20%'}}/>
                <col style={{width:'20%'}}/>
              </colgroup>
              <TableHead>
                <TableRow>
                  <StyledTableCell size="small" padding="none">Piece Type</StyledTableCell>
                  <StyledTableCell size="small" padding="none"># to Start</StyledTableCell>
                  <StyledTableCell size="small" padding="none">Current #</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.props.pieceArray.map( (val, i) => (
                  <StyledTableRow key={i}>
                    <StyledTableCell align="left" size="small" padding="none">{val}</StyledTableCell>
                    <StyledTableCell align="left" size="small" padding="none">{this.props.countArray[i]}</StyledTableCell>
                    <StyledTableCell align="left" size="small" padding="none">{this.props.pieceCounter[i]}</StyledTableCell>
                  </StyledTableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Paper>
        </Drawer>
      </div>
    );
  }
}

export default PieceTable;