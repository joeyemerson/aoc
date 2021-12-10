const fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(el => el !== '')
  .map(Number);

const countIncreases = arr => {
  return arr.reduce((acc, cur, idx) => {
    return acc + (cur > arr[idx - 1] ? 1 : 0);
  }, 0);
};

// Part 1: How many measurements are larger than the previous measurement?
const p1 = arr => {
  return countIncreases(arr);
};

// Part 2: Consider sums of a three-measurement sliding window. How many sums are larger than the previous sum?
const p2 = arr => {
  const threeSums = arr.slice(2).map((el, idx) => el + arr[idx] + arr[idx + 1]);
  return countIncreases(threeSums);
};

console.time('Part 1 Time');
console.log('Part 1:', p1(input));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(input));
console.timeEnd('Part 2 Time');
