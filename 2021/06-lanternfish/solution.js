fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(el => el !== '');

const fish = input[0].split(',').map(Number);

const simulate = (fish, days) => {
  const states = Array(9).fill(0);

  for (const f of fish) ++states[f];

  for (let day = 0; day < days; ++day) {
    states.push(states[day]);
    states[day + 7] += states[day];
  }

  return states.slice(-9).reduce((acc, cur) => acc + cur, 0);
};

// Part 1: Find a way to simulate lanternfish. How many lanternfish would there be after 80 days?
console.log('Part 1:', simulate(fish, 80));

// Part 2: How many lanternfish would there be after 256 days?
console.log('Part 2:', simulate(fish, 256));
