fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '')
  .map(line => line.split(' | '));

const permutations = (function permute(str, perm = '', arr = []) {
  if (!str) {
    arr.push(perm);
    return arr;
  }

  for (let i = 0; i < str.length; ++i) {
    const strWithRemovedChar = str.slice(0, i) + str.slice(i + 1);
    permute(strWithRemovedChar, perm + str[i], arr);
  }

  return arr;
})('abcdefg');

const segmentMap = ['012456', '25', '02346', '02356', '1235', '01356', '013456', '025', '0123456', '012356'];

// Take in list of signalPatterns defining each digit of a seven segment display and return a map
// of the form { sorted pattern string : digit represented on display }
const getPatternMap = signalPatterns => {
  signalPatterns = signalPatterns.split(' ');

  for (const perm of permutations) {
    let isValid = true;

    for (const pattern of signalPatterns) {
      const candidate = [...pattern.replace(/[abcdefg]/g, m => perm.indexOf(m))].sort().join('');

      if (!segmentMap.some(segment => candidate === segment)) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      const map = {};

      for (const idx in segmentMap) {
        const key = [...segmentMap[idx].replace(/\d/g, m => perm[m])].sort().join('');
        map[key] = idx.toString();
      }

      return map;
    }
  }
};

// Part 1: In the output values, how many times do digits 1, 4, 7, or 8 appear?
const p1 = input => {
  const targetLengths = [2, 3, 4, 7];
  let result = 0;

  for (const [_, outputValues] of input) {
    for (const value of outputValues.split(' ')) {
      if (targetLengths.includes(value.length)) ++result;
    }
  }

  return result;
};

// Part 2: For each entry, determine all of the wire/segment connections and decode the four-digit
// output values. What do you get if you add up all of the output values?
const p2 = input => {
  let result = 0;

  for (const [signalPatterns, outputValues] of input) {
    const patternMap = getPatternMap(signalPatterns);
    let digitString = '';

    for (const value of outputValues.split(' ')) {
      const sortedValue = [...value].sort().join('');
      digitString += patternMap[sortedValue];
    }

    result += parseInt(digitString);
  }

  return result;
};

console.time('Part 1 Time');
console.log('Part 1:', p1(input));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(input));
console.timeEnd('Part 2 Time');
