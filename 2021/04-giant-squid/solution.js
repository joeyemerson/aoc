fs = require('fs');

class GameBoard {
  constructor(boardData) {
    if (!Array.isArray(boardData)) throw 'GameBoard input must be a 2d array of board data';

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
      if (!this.board[square].hasToken) {
        sum += parseInt(square);
      }
    }
    return sum;
  }

  reset() {
    for (const square in this.board) {
      this.board[square].hasToken = false;
      this.rows.fill(0);
      this.cols.fill(0);
    }
  }
}

const BOARD_SIZE = 5;

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(el => el !== '');

const draws = input.shift().split(',');

const boards = [];

for (let i = 0; i < input.length; i += BOARD_SIZE) {
  const boardData = input.slice(i, i + BOARD_SIZE).map(row => row.match(/\d+/g));
  boards.push(new GameBoard(boardData));
}

// Part 1: To guarantee victory against the giant squid, figure out which board will win first.
// What will your final score be if you choose that board?
const p1 = (draws, boards) => {
  for (const value of draws) {
    for (const board of boards) {
      board.placeToken(value);

      if (board.isWinner()) {
        const sum = board.sumOfUnplayedValues();
        return sum * parseInt(value);
      }
    }
  }
};

// Part 2: Figure out which board will win last. Once it wins, what would its final score be?
const p2 = (draws, boards) => {
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
  }

  return lastWinner.sumOfUnplayedValues() * parseInt(lastValue);
};

console.log('Part 1:', p1(draws, boards));

// Reset play from part 1
boards.forEach(board => board.reset());

console.log('Part 2:', p2(draws, boards));
