const fs = require('fs');

const input = fs
    .readFileSync('./input')
    .toString()
    .split('\n')
    .filter(line => line !== '')
    .map(line => [...line]);

// Part 1: Find somewhere safe to land your submarine. What is the first step on which no sea cucumbers move?
const p1 = input => {
    const EMPTY = '.';
    const height = input.length;
    const width = input[0].length;
    let grid = input.map(row => [...row]);
    let moved = true;
    let turns = 0;
    while (moved) {
        let newGrid = grid.map(row => [...row]);
        moved = false;
        ++turns;
        for (let r = 0; r < height; ++r) {
            for (let c = 0; c < width; ++c) {
                if (grid[r][c] === '>') {
                    if (grid[r][(c + 1) % width] === EMPTY) {
                        newGrid[r][(c + 1) % width] = grid[r][c];
                        newGrid[r][c] = EMPTY;
                        moved = true;
                    }
                }
            }
        }
        grid = newGrid;
        newGrid = grid.map(row => [...row]);
        for (let r = 0; r < height; ++r) {
            for (let c = 0; c < width; ++c) {
                if (grid[r][c] === 'v') {
                    if (grid[(r + 1) % height][c] === EMPTY) {
                        newGrid[(r + 1) % height][c] = grid[r][c];
                        newGrid[r][c] = EMPTY;
                        moved = true;
                    }
                }
            }
        }
        grid = newGrid;
    }
    return turns;
};

// Part 2:
const p2 = input => {
    return 'There is no part 2! Merry Christmas!';
};

console.time('Part 1 Time');
console.log('Part 1:', p1(input));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(input));
console.timeEnd('Part 2 Time');
