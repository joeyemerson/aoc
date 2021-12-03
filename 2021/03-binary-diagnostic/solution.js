fs = require('fs');

const BINARY_LENGTH = 12;

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(el => el !== '');

// Part 1: Use the binary numbers in your diagnostic report to calculate the gamma rate and epsilon
// rate, then multiply them together. What is the power consumption of the submarine? (Be sure to
// represent your answer in decimal, not binary.)
const p1 = arr => {
  const bitCounter = Array(BINARY_LENGTH).fill(0);

  for (const binaryString of arr) {
    let n = parseInt(binaryString, 2);
    let idx = 0;

    while (idx < BINARY_LENGTH) {
      if (n & 1) ++bitCounter[idx++];
      else --bitCounter[idx++];
      n >>= 1;
    }
  }

  let gamma = 0;
  let epsilon = 0;

  while (bitCounter.length) {
    const count = bitCounter.pop();
    gamma *= 2;
    epsilon *= 2;
    if (count > 0) ++gamma;
    else if (count < 0) ++epsilon;
  }

  return gamma * epsilon;
};

// Part 2: Use the binary numbers in your diagnostic report to calculate the oxygen generator rating
// and CO2 scrubber rating, then multiply them together. What is the life support rating of the
// submarine? (Be sure to represent your answer in decimal, not binary.)
const p2 = arr => {
  let ONums = [...arr];
  let CO2Nums = [...arr];
  let bitIdx = 0;

  while (ONums.length > 1) {
    let hiBitCount = 0;

    for (const binaryString of ONums) {
      if (binaryString[bitIdx] === '1') ++hiBitCount;
      else --hiBitCount;
    }

    ONums = ONums.filter(b => (hiBitCount < 0 ? b[bitIdx] === '0' : b[bitIdx] === '1'));
    ++bitIdx;
  }

  bitIdx = 0; // reset bitIdx to begin looking at hi bit

  while (CO2Nums.length > 1) {
    let hiBitCount = 0;

    for (const binaryString of CO2Nums) {
      if (binaryString[bitIdx] === '1') ++hiBitCount;
      else --hiBitCount;
    }

    CO2Nums = CO2Nums.filter(b => (hiBitCount < 0 ? b[bitIdx] === '1' : b[bitIdx] === '0'));
    ++bitIdx;
  }

  const oxygenGeneratorRating = parseInt(ONums[0], 2);
  const CO2ScrubberRating = parseInt(CO2Nums[0], 2);

  return oxygenGeneratorRating * CO2ScrubberRating;
};

console.log(p1(input));
console.log(p2(input));
