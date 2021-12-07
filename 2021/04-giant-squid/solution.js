fs = require('fs');

class GameBoard {
  constructor(boardData) {
    // Making a few assumptions here:
    //  1) boardData is good input
    //  2) Board height and width will be equal
    //  3) All board squares will contain unique values (relative to this GameBoard instance)
    //  4) There will not be duplicate values drawn as numbers are called from the input data

    this.size = boardData.length;
    this.board = {};
    this.rows = Array(this.size).fill(0);
    this.cols = Array(this.size).fill(0);

    for (let r = 0; r < this.size; ++r) {
      for (let c = 0; c < this.size; ++c) {
        const value = boardData[r][c];
        this.board[value] = { row: r, col: c, hasToken: false };
      }
    }
  }

  placeToken(value) {
    if (value in this.board) {
      this.board[value].hasToken = true;
      ++this.rows[this.board[value].row];
      ++this.cols[this.board[value].col];
    }
  }

  isWinner() {
    return this.rows.some(row => row === this.size) || this.cols.some(col => col === this.size);
  }

  sumOfUnplayedValues() {
    let sum = 0;
    for (const square in this.board) {
      if (!this.board[square].hasToken) sum += parseInt(square);
    }
    return sum;
  }
}

const BOARD_SIZE = 5;

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(el => el !== '');

const draws = input.shift().split(',');

const createBoards = (input, size) => {
  const boards = [];
  for (let i = 0; i < input.length; i += size) {
    const boardData = input.slice(i, i + size).map(row => row.match(/\d+/g));
    boards.push(new GameBoard(boardData));
  }
  return boards;
};

// Part 1: To guarantee victory against the giant squid, figure out which board will win first.
// What will your final score be if you choose that board?
const p1 = (draws, input, size) => {
  const boards = createBoards(input, size);
  for (const value of draws) {
    for (const board of boards) {
      board.placeToken(value);
      if (board.isWinner()) return board.sumOfUnplayedValues() * parseInt(value);
    }
  }
};

// Part 2: Figure out which board will win last. Once it wins, what would its final score be?
const p2 = (draws, input, size) => {
  const boards = createBoards(input, size);
  let lastWinner = null;
  let lastValue = -1;

  for (const value of draws) {
    // Iterate backward through array so we can remove winning boards in place.
    for (let i = boards.length - 1; i >= 0; --i) {
      boards[i].placeToken(value);
      if (boards[i].isWinner()) {
        lastWinner = boards.splice(i, 1)[0];
        lastValue = value;
      }
    }
    if (!boards.length) break; // all winners have been found
  }

  return lastWinner.sumOfUnplayedValues() * parseInt(lastValue);
};

console.time('Part 1 Time');
console.log('Part 1:', p1(draws, input, BOARD_SIZE));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(draws, input, BOARD_SIZE));
console.timeEnd('Part 2 Time');
