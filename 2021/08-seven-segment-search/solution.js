const fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '')
  .map(line => line.split(' | '));

const digitSegments = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'];

const getSegmentMap = signalPatterns => {
  const byLen = [, , [], [], [], [], [], []];
  const map = { a: '', b: '', c: '', d: '', e: '', f: '', g: '' };

  for (const pattern of signalPatterns.split(' ')) {
    byLen[pattern.length].push(pattern);
  }

  let cf = byLen[2][0];
  let bd = [...byLen[4][0]].filter(char => !cf.includes(char)).join('');

  // get a
  const a = [...byLen[3][0]].filter(char => !cf.includes(char))[0];
  map[a] = 'a';

  // get cf and bd
  for (const len6 of byLen[6]) {
    let sameCF = '';
    let sameBD = '';

    for (const char of len6) {
      if (cf.includes(char)) sameCF += char;
      if (bd.includes(char)) sameBD += char;
    }

    if (sameCF.length === 1) {
      const f = sameCF;
      const c = sameCF === cf[0] ? cf[1] : cf[0];
      map[f] = 'f';
      map[c] = 'c';
    }

    if (sameBD.length === 1) {
      const b = sameBD;
      const d = sameBD === bd[0] ? bd[1] : bd[0];
      map[b] = 'b';
      map[d] = 'd';
    }
  }

  // get g
  for (const len6 of byLen[6]) {
    let unfound = '';

    for (const char of len6) {
      if (!map[char]) unfound += char;
    }

    if (unfound.length === 1) {
      map[unfound] = 'g';
      break;
    }
  }

  // get e
  const e = [...byLen[7][0]].filter(char => !map[char])[0];
  map[e] = 'e';

  return map;
};

// Part 1: In the output values, how many times do digits 1, 4, 7, or 8 appear?
const p1 = input => {
  const targetLengths = [2, 3, 4, 7];
  let result = 0;

  for (const [_, outputValues] of input) {
    for (const value of outputValues.split(' ')) {
      result += targetLengths.includes(value.length);
    }
  }

  return result;
};

// Part 2: For each entry, determine all of the wire/segment connections and decode the four-digit
// output values. What do you get if you add up all of the output values?
const p2 = input => {
  let result = 0;

  for (const [signalPatterns, outputValues] of input) {
    const segmentMap = getSegmentMap(signalPatterns);
    let digitString = '';

    for (const mismatchedSegments of outputValues.split(' ')) {
      const segments = mismatchedSegments.replace(/./g, m => segmentMap[m]);
      const sortedSegments = [...segments].sort().join('');
      digitString += digitSegments.indexOf(sortedSegments).toString();
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
