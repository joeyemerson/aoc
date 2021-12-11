const fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '')
  .map(row => [...row].map(Number));

const OctopusCavern = function (initialState) {
  const size = initialState.length;
  const rowOffsets = [-1, -1, 0, 1, 1, 1, 0, -1];
  const colOffsets = [0, 1, 1, 1, 0, -1, -1, -1];
  const flashesPerState = [0];

  let curState = initialState.map(row => [...row]);

  const stepForward = () => {
    const nextState = Array.from(Array(size), () => Array(size));
    const flashed = Array.from(Array(size), () => Array(size).fill(false));
    const queue = [];
    let flashes = 0;

    // Increment all cells and add flash cells to the queue
    for (let r = 0; r < size; ++r) {
      for (let c = 0; c < size; ++c) {
        nextState[r][c] = curState[r][c] + 1;
        if (nextState[r][c] > 9) queue.push([r, c]);
      }
    }

    while (queue.length) {
      const [r, c] = queue.shift();
      if (flashed[r][c]) continue; // only one flash per step for you, buddy
      flashed[r][c] = true;
      ++flashes;

      // visit and update all adjacent neighbor cells
      // add them to queue if they become flash cells
      for (let i = 0; i < 8; ++i) {
        const rr = r + rowOffsets[i];
        const cc = c + colOffsets[i];
        if (rr >= 0 && cc >= 0 && rr < size && cc < size) {
          ++nextState[rr][cc];
          if (nextState[rr][cc] > 9) queue.push([rr, cc]);
        }
      }
    }

    // Reset all cells that flashed to 0
    for (let r = 0; r < size; ++r) {
      for (let c = 0; c < size; ++c) {
        if (flashed[r][c]) nextState[r][c] = 0;
      }
    }

    flashesPerState.push(flashes);
    curState = nextState;
  };

  const getTotalFlashCount = () => {
    return flashesPerState.reduce((acc, cur) => acc + cur, 0);
  };

  const getLastStepFlashCount = () => {
    return flashesPerState[flashesPerState.length - 1];
  };

  return { stepForward, getTotalFlashCount, getLastStepFlashCount };
};

// Part 1: Given the starting energy levels of the dumbo octopuses in your cavern, simulate 100 steps.
// How many total flashes are there after 100 steps?
const p1 = (input, steps) => {
  const octo = new OctopusCavern(input);
  while (steps--) octo.stepForward();
  return octo.getTotalFlashCount();
};

// Part 2: If you can calculate the exact moments when the octopuses will all flash simultaneously,
// you should be able to navigate through the cavern. What is the first step during which all octopuses flash?
const p2 = input => {
  const octo = new OctopusCavern(input);
  const target = input.length ** 2;
  let steps = 0;

  while (octo.getLastStepFlashCount() !== target) {
    octo.stepForward();
    ++steps;
  }

  return steps;
};

console.time('Part 1 Time');
console.log('Part 1:', p1(input, 100));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(input));
console.timeEnd('Part 2 Time');
