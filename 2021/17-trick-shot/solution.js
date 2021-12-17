const fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '');

const [loX, hiX, loY, hiY] = input[0].match(/\-?\d+/g).map(Number);

const inTargetArea = (x, y, loX, hiX, loY, hiY) => x >= loX && x <= hiX && y >= loY && y <= hiY;
const pastTargetArea = (y, loY) => y < loY;
const maxHeight = initialY => (initialY * (initialY + 1)) / 2;

// Part 1: Find the initial velocity that causes the probe to reach the highest y position and still eventually
// be within the target area after any step. What is the highest y position it reaches on this trajectory?
const p1 = (loX, hiX, loY, hiY) => {
  const maxAbxY = Math.max(Math.abs(loY), Math.abs(hiY));

  for (let x = 1; x <= hiX; ++x) {
    for (let y = maxAbxY; y >= -maxAbxY; --y) {
      let curX = 0;
      let curY = 0;
      let velX = x;
      let velY = y;

      while (!pastTargetArea(curY, loY)) {
        if (inTargetArea(curX, curY, loX, hiX, loY, hiY)) return maxHeight(y);
        curX += velX;
        curY += velY;
        velX -= velX === 0 ? 0 : 1;
        velY -= 1;
      }

      if (curX < loX) break;
    }
  }
};

// Part 2: How many distinct initial velocity values cause the probe to be within the target area after any step?
const p2 = (loX, hiX, loY, hiY) => {
  const maxAbsY = Math.max(Math.abs(loY), Math.abs(hiY));
  const distinctVelocities = new Set();

  for (let x = 1; x <= hiX; ++x) {
    for (let y = maxAbsY; y >= -maxAbsY; --y) {
      let curX = 0;
      let curY = 0;
      let velX = x;
      let velY = y;

      while (!pastTargetArea(curY, loY)) {
        if (inTargetArea(curX, curY, loX, hiX, loY, hiY)) distinctVelocities.add(x + ' ' + y);
        curX += velX;
        curY += velY;
        velX -= velX === 0 ? 0 : 1;
        velY -= 1;
      }

      if (curX < loX) break;
    }
  }

  return distinctVelocities.size;
};

console.time('Part 1 Time');
console.log('Part 1:', p1(loX, hiX, loY, hiY));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(loX, hiX, loY, hiY));
console.timeEnd('Part 2 Time');
