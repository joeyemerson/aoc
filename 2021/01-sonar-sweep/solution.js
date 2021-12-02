fs = require('fs');

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

console.log(p1(input));
console.log(p2(input));
