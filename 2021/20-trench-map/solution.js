const fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '')
  .map(row => [...row].map(val => (val === '#' ? 1 : 0)));

const enhancer = input.shift();

const expand = (grid, iteration, toggleBit) => {
  const padBit = iteration & toggleBit;
  const expandedGrid = grid.map(row => [padBit, ...row, padBit]);
  expandedGrid.unshift(Array(expandedGrid[0].length).fill(padBit));
  expandedGrid.push(Array(expandedGrid[0].length).fill(padBit));
  return expandedGrid;
};

const getSubgridValue = (row, col, iteration, toggleBit, grid) => {
  let value = 0;
  for (let r = row - 1; r <= row + 1; ++r) {
    for (let c = col - 1; c <= col + 1; ++c) {
      value *= 2;
      if (r < 0 || c < 0 || r === grid.length || c === grid[0].length) value += iteration & toggleBit;
      else value += grid[r][c];
    }
  }
  return value;
};

const enhance = (grid, enhancer, iterations) => {
  const toggleBit = enhancer[0] & 1;
  for (let i = 0; i < iterations; ++i) {
    grid = expand(grid, i, toggleBit).map((row, r, originalArr) => {
      return row.map((_, c) => {
        const subgridValue = getSubgridValue(r, c, i, toggleBit, originalArr);
        return enhancer[subgridValue];
      });
    });
  }
  return grid;
};

const sumBits2d = grid => {
  return grid.reduce((outerAcc, row) => outerAcc + row.reduce((innerAcc, cur) => innerAcc + cur, 0), 0);
};

// Part 1: Start with the original input image and apply the image enhancement algorithm twice,
// being careful to account for the infinite size of the images. How many pixels are lit in the resulting image?
console.time('Part 1 Time');
console.log('Part 1:', sumBits2d(enhance(input, enhancer, 2)));
console.timeEnd('Part 1 Time');
console.log();

// Part 2: Start again with the original input image and apply the image enhancement algorithm 50 times. How many pixels are lit in the resulting image?
console.time('Part 2 Time');
console.log('Part 2:', sumBits2d(enhance(input, enhancer, 50)));
console.timeEnd('Part 2 Time');
