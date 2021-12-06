fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(el => el !== '');

const fish = input[0].split(',').map(Number);

const simulate = (fish, days) => {
  let states = Array(9).fill(0);

  for (const f of fish) ++states[f];

  while (days--) {
    const nextStates = Array(9).fill(0);
    nextStates[8] = states[0];
    nextStates[6] = states[0];

    for (let i = 1; i < 9; ++i) {
      nextStates[i - 1] += states[i];
    }

    states = nextStates;
  }

  return states.reduce((acc, cur) => acc + cur, 0);
};

// Part 1: Find a way to simulate lanternfish. How many lanternfish would there be after 80 days?
console.log('Part 1:', simulate(fish, 80));

// Part 2: How many lanternfish would there be after 256 days?
console.log('Part 2:', simulate(fish, 256));
