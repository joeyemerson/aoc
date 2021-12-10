const fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '');

const rowOffsets = [-1, 0, 1, 0];
const colOffsets = [0, 1, 0, -1];

const pointInGrid = (r, c, height, width) => r >= 0 && c >= 0 && r < height && c < width;

const getNeighbors = (r, c, height, width, grid) => {
  const neighbors = [];

  for (let i = 0; i < 4; ++i) {
    const rr = r + rowOffsets[i];
    const cc = c + colOffsets[i];
    if (pointInGrid(rr, cc, height, width)) neighbors.push(grid[rr][cc]);
  }

  return neighbors;
};

// Part 1: Find all of the low points on your heightmap. What is the sum of the risk levels of all
// low points on your heightmap?
const p1 = grid => {
  const height = grid.length;
  const width = grid[0].length;
  let sum = 0;

  for (let r = 0; r < height; ++r) {
    for (let c = 0; c < width; ++c) {
      const neighbors = getNeighbors(r, c, height, width, grid);
      if (neighbors.every(neighbor => neighbor > grid[r][c])) {
        sum += parseInt(grid[r][c]) + 1;
      }
    }
  }

  return sum;
};

// Part 2: What do you get if you multiply together the sizes of the three largest basins?
const p2 = grid => {
  const height = grid.length;
  const width = grid[0].length;
  const visited = Array.from(Array(height), () => Array(width).fill(false));
  const basins = [];

  for (let r = 0; r < height; ++r) {
    for (let c = 0; c < width; ++c) {
      const queue = [[r, c]];
      let size = 0;

      while (queue.length) {
        const [r, c] = queue.shift();
        if (grid[r][c] === '9' || visited[r][c]) continue;
        ++size;
        visited[r][c] = true;
        for (let i = 0; i < 4; ++i) {
          const rr = r + rowOffsets[i];
          const cc = c + colOffsets[i];
          if (pointInGrid(rr, cc, height, width)) queue.push([rr, cc]);
        }
      }

      if (size) basins.push(size);
    }
  }

  return basins
    .sort((a, b) => a - b)
    .slice(-3)
    .reduce((acc, cur) => acc * cur, 1);
};

console.time('Part 1 Time');
console.log('Part 1:', p1(input));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(input));
console.timeEnd('Part 2 Time');
