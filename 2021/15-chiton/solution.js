const fs = require('fs');

const { PriorityQueue } = require('../utils/PriorityQueue');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '')
  .map(row => [...row].map(Number));

const height = input.length;
const width = input[0].length;

const shortestPath = (height, width, grid) => {
  const tileHeight = grid.length;
  const tileWidth = grid[0].length;
  const dirs = [[-1, 0], [0, 1], [1, 0], [0, -1]]; //prettier-ignore
  const costs = Array.from(Array(height), () => Array(width).fill(Infinity));
  const pq = new PriorityQueue((a, b) => a[2] < b[2]);

  pq.enqueue([0, 0, 0]); // start at top-left corner

  while (!pq.isEmpty()) {
    const [r, c, prevCost] = pq.dequeue();

    if (r < 0 || c < 0 || r === height || c === width) continue;

    let cost = grid[r % tileHeight][c % tileWidth] + Math.floor(r / tileHeight) + Math.floor(c / tileWidth);
    if (cost > 9) cost -= 9;

    if (prevCost + cost < costs[r][c]) costs[r][c] = prevCost + cost;
    else continue;

    if (r === height - 1 && c === width - 1) break; // we found bottom-right corner

    for (const [rr, cc] of dirs) {
      pq.enqueue([r + rr, c + cc, costs[r][c]]);
    }
  }

  return costs[height - 1][width - 1] - grid[0][0];
};

// Part 1: What is the lowest total risk of any path from the top left to the bottom right?
console.time('Part 1 Time');
console.log('Part 1:', shortestPath(height, width, input));
console.timeEnd('Part 1 Time');
console.log();

// Part 2: Using the full map, what is the lowest total risk of any path from the top left to the bottom right?
console.time('Part 2 Time');
console.log('Part 2:', shortestPath(height * 5, width * 5, input));
console.timeEnd('Part 2 Time');
