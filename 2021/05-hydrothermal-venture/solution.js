fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(el => el !== '');

const lineData = input.map(line => {
  const [start, end] = line.split(' -> ');
  const [startX, startY] = start.split(',').map(Number);
  const [endX, endY] = end.split(',').map(Number);
  return { startX, startY, endX, endY };
});

const getIntersections = (lineData, ignoreDiagonal) => {
  const grid = Array.from(Array(1000), () => Array(1000).fill(0));

  for (const { startX, startY, endX, endY } of lineData) {
    if (ignoreDiagonal && startX !== endX && startY !== endY) continue;

    const incrementX = startX < endX ? 1 : startX > endX ? -1 : 0;
    const incrementY = startY < endY ? 1 : startY > endY ? -1 : 0;

    let curX = startX;
    let curY = startY;

    while (curX !== endX || curY !== endY) {
      ++grid[curY][curX];
      curX += incrementX;
      curY += incrementY;
    }

    ++grid[curY][curX]; // this is the end point of the line
  }

  let intersections = 0;

  for (const row of grid) {
    for (const cell of row) {
      if (cell > 1) ++intersections;
    }
  }

  return intersections;
};

// Part 1: Consider only horizontal and vertical lines. At how many points do at least two lines overlap?
console.log('Part 1:', getIntersections(lineData, true));

// Part 2: Consider all of the lines. At how many points do at least two lines overlap?
console.log('Part 2:', getIntersections(lineData, false));
