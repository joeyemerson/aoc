fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(el => el !== '');

const updatePositionPart1 = (x, y, dir, distance) => {
  const map = {
    forward: [1, 0],
    down: [0, 1],
    up: [0, -1],
  };

  const [offsetX, offsetY] = map[dir];
  const newX = x + offsetX * distance;
  const newY = y + offsetY * distance;

  return [newX, newY];
};

const updatePositionPart2 = (x, y, aim, dir, distance) => {
  const map = {
    forward: [1, 1, 0],
    down: [0, 0, 1],
    up: [0, 0, -1],
  };

  const [offsetX, offsetY, offsetAim] = map[dir];
  const newX = x + offsetX * distance;
  const newY = y + offsetY * aim * distance;
  const newAim = aim + offsetAim * distance;

  return [newX, newY, newAim];
};

// Part 1: Calculate the horizontal position and depth you would have after following the planned
// course. What do you get if you multiply your final horizontal position by your final depth?
const p1 = arr => {
  let x = 0;
  let y = 0;

  for (const line of arr) {
    const parts = line.split(' ');
    const dir = parts[0];
    const distance = parseInt(parts[1]);
    [x, y] = updatePositionPart1(x, y, dir, distance);
  }

  return x * y;
};

// Part 2: Using this new interpretation of the commands, calculate the horizontal position and
// depth you would have after following the planned course. What do you get if you multiply your
// final horizontal position by your final depth?
const p2 = arr => {
  let x = 0;
  let y = 0;
  let aim = 0;

  for (const line of arr) {
    const parts = line.split(' ');
    const dir = parts[0];
    const distance = parseInt(parts[1]);
    [x, y, aim] = updatePositionPart2(x, y, aim, dir, distance);
  }

  return x * y;
};

console.time('Part 1 Time');
console.log('Part 1:', p1(input));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(input));
console.timeEnd('Part 2 Time');
