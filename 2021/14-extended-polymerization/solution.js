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
  const singleCounter = {};
  let pairCounter = {}; // This will be reassigned after every iteration to reflect new pairs

  for (let i = 0; i < template.length; ++i) {
    const singleKey = template[i];
    const pairKey = template[i - 1] + template[i];
    singleCounter[singleKey] = singleCounter[singleKey] + 1 || 1;
    pairCounter[pairKey] = pairCounter[pairKey] + 1 || 1;
  }

  for (let i = 0; i < processIterations; ++i) {
    // All insertions happen simultaneously, so we store the new pairs in this temporary map and change
    // pairCounter to point to the new map after all insertions have been made for this iteration.
    const newPairCounter = {};

    for (const pair in rules) {
      // If a pair isn't in the rule set, we don't need to keep it, which is why there is no else block below the if.
      // Alternatively, you could iterate through all the current pairs and check if that pair is in the rules.
      // Since I knew the rules length was fixed, I chose to loop through them since the number of pairs will
      // fluctuate on each iteration, and potentially be up to twice the size of the rules length.

      if (pairCounter[pair]) {
        // Each instance of pair AB gets replaced by one each of pairs AC and CB
        // where AB is the original pair and C is the insertion char.
        const insertionValue = rules[pair];
        const newLeftPair = pair[0] + insertionValue;
        const newRightPair = insertionValue + pair[1];
        const pairCount = pairCounter[pair];
        singleCounter[insertionValue] = singleCounter[insertionValue] + pairCount || pairCount;
        newPairCounter[newLeftPair] = newPairCounter[newLeftPair] + pairCount || pairCount;
        newPairCounter[newRightPair] = newPairCounter[newRightPair] + pairCount || pairCount;
      }
    }

    pairCounter = newPairCounter;
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
