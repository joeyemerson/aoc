fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '');

const pairMap = { '(': ')', '[': ']', '{': '}', '<': '>' };
const openingBraces = '([{<';

// Part 1: Find the first illegal character in each corrupted line of the navigation subsystem.
// What is the total syntax error score for those errors?
const p1 = input => {
  const scoreMap = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
  let result = 0;

  for (const line of input) {
    const stack = [];
    for (const char of line) {
      if (openingBraces.includes(char)) stack.push(char);
      else if (pairMap[stack.pop()] !== char) {
        result += scoreMap[char];
        break;
      }
    }
  }

  return result;
};

// Part 2: Find the completion string for each incomplete line, score the completion strings,
// and sort the scores. What is the middle score?
const p2 = input => {
  const scoreMap = { ')': 1, ']': 2, '}': 3, '>': 4 };
  const scores = [];

  for (const line of input) {
    const stack = [];
    let isValid = true;

    for (const char of line) {
      if (openingBraces.includes(char)) stack.push(char);
      else if (pairMap[stack.pop()] !== char) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      let score = 0;
      while (stack.length) {
        score *= 5;
        score += scoreMap[pairMap[stack.pop()]];
      }
      scores.push(score);
    }
  }

  scores.sort((a, b) => a - b);

  return scores[Math.floor(scores.length / 2)];
};

console.time('Part 1 Time');
console.log('Part 1:', p1(input));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(input));
console.timeEnd('Part 2 Time');
