import run from 'aocrunner';

const OPEN = undefined; // since x axis is a sparse array, unused cells will be undefined
const ROCK = 1;
const SAND = 2;

const parseInput = (rawInput) => {
    const paths = [];
    let maxY = 0;

    for (const line of rawInput.split('\n')) {
        const path = line.split(' -> ').map((p) => {
            const [x, y] = p.split(',').map(Number);
            maxY = Math.max(maxY, y);
            return [x, y];
        });
        paths.push(path);
    }

    const grid = Array.from(Array(maxY + 1), () => []); // x axis is stored in a sparse array

    // Fill in all rock cells in grid with given input
    for (const path of paths) {
        let [curX, curY] = path.shift();
        for (const [nextX, nextY] of path) {
            grid[curY][curX] = ROCK;
            while (curX !== nextX || curY !== nextY) {
                if (curX < nextX) ++curX;
                else if (curX > nextX) --curX;
                else if (curY < nextY) ++curY;
                else if (curY > nextY) --curY;
                grid[curY][curX] = ROCK;
            }
        }
    }
    return grid;
};

const part1 = (rawInput) => {
    const grid = parseInput(rawInput);
    let result = 0;
    let sandX = 500;
    let sandY = 0;
    while (true) {
        if (sandY + 1 === grid.length) {
            // fall out bottom
            break;
        } else if (grid[sandY + 1][sandX] === OPEN) {
            // move straight down
            ++sandY;
        } else if (grid[sandY + 1][sandX - 1] === OPEN) {
            // move down left
            ++sandY;
            --sandX;
        } else if (grid[sandY + 1][sandX + 1] === OPEN) {
            // move down right
            ++sandY;
            ++sandX;
        } else {
            // settle in place, then move to next grain of sand
            grid[sandY][sandX] = SAND;
            sandX = 500;
            sandY = 0;
            ++result;
        }
    }
    return result;
};

const part2 = (rawInput) => {
    const grid = parseInput(rawInput);
    grid.push([], Array(1000).fill(ROCK));
    let result = 0;
    let sandX = 500;
    let sandY = 0;
    while (true) {
        if (grid[sandY + 1][sandX] === OPEN) {
            // move straight down
            ++sandY;
        } else if (grid[sandY + 1][sandX - 1] === OPEN) {
            // move down left
            ++sandY;
            --sandX;
        } else if (grid[sandY + 1][sandX + 1] === OPEN) {
            // move down right
            ++sandY;
            ++sandX;
        } else {
            // settle in place, then move to next grain of sand
            grid[sandY][sandX] = SAND;
            ++result;
            if (sandX === 500 && sandY === 0) break; // we plugged the source
            sandX = 500;
            sandY = 0;
        }
    }
    return result;
};

run({
    part1: {
        tests: [
            {
                input: `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`,
                expected: 24,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9`,
                expected: 93,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
