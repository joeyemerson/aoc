const fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '');

const polymerTemplate = input.shift();

const insertionRules = input.reduce((acc, cur) => {
  const [key, val] = cur.split(' -> ');
  acc[key] = val;
  return acc;
}, {});

const getPolymer = (template, rules, processIterations) => {
  const singleCounter = { [template[0]]: 1 }; // initialize with first char since we are iterating over pairs
  const pairCounter = {};

  for (let i = 1; i < template.length; ++i) {
    const singleKey = template[i];
    const pairKey = template[i - 1] + template[i];
    singleCounter[singleKey] = singleCounter[singleKey] + 1 || 1;
    pairCounter[pairKey] = pairCounter[pairKey] + 1 || 1;
  }

  for (let i = 0; i < processIterations; ++i) {
    // all insertions happen simultaneously, so we store the new pairs in this temporary map and add
    // them back to the main pairCounter after all insertions have been made for this iteration
    const addedPairs = {};

    for (const pair in rules) {
      if (pairCounter[pair]) {
        // each instance of pair AB get replaced by one each of pairs AC and CB
        // where AB is the original pair and C is the insertion char
        const insertionValue = rules[pair];
        const leftKey = pair[0] + insertionValue;
        const rightKey = insertionValue + pair[1];
        const pairCount = pairCounter[pair];
        pairCounter[pair] = 0;
        singleCounter[insertionValue] = singleCounter[insertionValue] + pairCount || pairCount;
        addedPairs[leftKey] = addedPairs[leftKey] + pairCount || pairCount;
        addedPairs[rightKey] = addedPairs[rightKey] + pairCount || pairCount;
      }
    }

    for (const pair in addedPairs) {
      pairCounter[pair] = pairCounter[pair] + addedPairs[pair] || addedPairs[pair];
    }
  }

  let minCount = Infinity;
  let maxCount = -Infinity;

  for (const char in singleCounter) {
    minCount = Math.min(minCount, singleCounter[char]);
    maxCount = Math.max(maxCount, singleCounter[char]);
  }

  return maxCount - minCount;
};

// Part 1: Apply 10 steps of pair insertion to the polymer template and find the most and least common elements
// in the result. What do you get if you take the quantity of the most common element and subtract the quantity
// of the least common element?
console.time('Part 1 Time');
console.log('Part 1:', getPolymer(polymerTemplate, insertionRules, 10));
console.timeEnd('Part 1 Time');
console.log();

// Part 2: Apply 40 steps of pair insertion to the polymer template and find the most and least common elements
// in the result. What do you get if you take the quantity of the most common element and subtract the quantity
// of the least common element?
console.time('Part 2 Time');
console.log('Part 2:', getPolymer(polymerTemplate, insertionRules, 40));
console.timeEnd('Part 2 Time');
