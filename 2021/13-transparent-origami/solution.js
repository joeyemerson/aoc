const fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '');

const foldStartIdx = input.findIndex(line => line.startsWith('fold'));
const points = input.slice(0, foldStartIdx);
const folds = input.slice(foldStartIdx);

const parseInstruction = fold => {
  const [, , instruction] = fold.split(' ');
  const [axis, value] = instruction.split('=');
  return { axis, value: parseInt(value) };
};

const foldPoints = (points, fold) => {
  const { axis, value } = parseInstruction(fold);

  for (const point of points) {
    let [x, y] = point.split(',').map(Number);
    let flipped = false;

    if (axis === 'x' && x > value) {
      x = value - (x - value);
      flipped = true;
    }

    if (axis === 'y' && y > value) {
      y = value - (y - value);
      flipped = true;
    }

    if (flipped) {
      points.delete(point);
      points.add(x + ',' + y);
    }
  }
};

// Part 1: How many dots are visible after completing just the first fold instruction on your transparent paper?
const p1 = (points, folds) => {
  const uniquePoints = new Set(points);
  foldPoints(uniquePoints, folds[0]);
  return uniquePoints.size;
};

// Part 2: What code do you use to activate the infrared thermal imaging camera system?
const p2 = (points, folds) => {
  const uniquePoints = new Set(points);

  // Characters are of height 6 (added extra row for console output padding)
  // Message length is 8, letter width is 4 + single char of padding between each letter
  const messageGrid = Array.from(Array(7), () => Array(39).fill(' '));

  for (const fold of folds) {
    foldPoints(uniquePoints, fold);
  }

  for (const point of uniquePoints) {
    const [x, y] = point.split(',').map(Number);
    messageGrid[y][x] = '#';
  }

  console.log('Your infrared thermal imaging camera system code is below!\n');
  console.log(messageGrid.map(row => row.join('')).join('\n'));

  return uniquePoints.size;
};

console.time('Part 1 Time');
console.log('Part 1:', p1(points, folds));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(points, folds));
console.timeEnd('Part 2 Time');
