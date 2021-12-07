fs = require('fs');

const input = fs.readFileSync('./input').toString().split(',').map(Number);

const getMedian = nums => {
  const sorted = [...nums].sort((a, b) => a - b);
  return sorted[Math.floor(nums.length / 2)];
};

const getMeans = nums => {
  const sum = nums.reduce((acc, cur) => acc + cur, 0);
  const loMean = Math.floor(sum / nums.length);
  const hiMean = Math.ceil(sum / nums.length);
  return [loMean, hiMean];
};

// Part 1: Determine the horizontal position that the crabs can align to using the least fuel possible
// How much fuel must they spend to align to that position?
const p1 = nums => {
  const median = getMedian(nums);
  let cost = 0;

  for (const n of nums) {
    cost += Math.abs(n - median);
  }

  return cost;
};

// Part 2: Determine the horizontal position that the crabs can align to using the least fuel possible
// so they can make you an escape route! How much fuel must they spend to align to that position?
const p2 = nums => {
  const [loMean, hiMean] = getMeans(nums);
  let loMeanCost = 0;
  let hiMeanCost = 0;

  for (const n of nums) {
    const loMeanDist = Math.abs(n - loMean);
    const hiMeanDist = Math.abs(n - hiMean);
    loMeanCost += (loMeanDist * (loMeanDist + 1)) / 2;
    hiMeanCost += (hiMeanDist * (hiMeanDist + 1)) / 2;
  }

  return Math.min(loMeanCost, hiMeanCost);
};

console.log('Part 1:', p1(input));
console.log('Part 2:', p2(input));
