import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const grid = input.split("\n").map((row) => row.split(""));
    const h = grid.length;
    const w = grid[0].length;
    const dirs = [-1, 0, 1];
    let result = 0;
    for (let r = 0; r < h; ++r) {
        for (let c = 0; c < w; ++c) {
            if (grid[r][c] !== "@") continue;
            let count = -1;
            for (const or of dirs) {
                const rr = r + or;
                if (rr < 0 || rr === h) continue;
                for (const oc of dirs) {
                    const cc = c + oc;
                    if (cc < 0 || cc === w) continue;
                    if (grid[rr][cc] === "@") ++count;
                }
            }
            if (count < 4) ++result;
        }
    }
    return result.toString();
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    const grid = input.split("\n").map((row) => row.split(""));
    const h = grid.length;
    const w = grid[0].length;
    const dirs = [-1, 0, 1];
    let result = 0;
    let found = true;
    while (found) {
        const positions = [];
        for (let r = 0; r < h; ++r) {
            for (let c = 0; c < w; ++c) {
                if (grid[r][c] !== "@") continue;
                let count = -1;
                for (const or of dirs) {
                    const rr = r + or;
                    if (rr < 0 || rr === h) continue;
                    for (const oc of dirs) {
                        const cc = c + oc;
                        if (cc < 0 || cc === w) continue;
                        if (grid[rr][cc] === "@") ++count;
                    }
                }
                if (count < 4) positions.push([r, c]);
            }
        }
        result += positions.length;
        found = positions.length > 0;
        for (const [r, c] of positions) {
            grid[r][c] = ".";
        }
    }
    return result.toString();
};

run({
    part1: {
        tests: [
            {
                input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
                expected: "13",
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`,
                expected: "43",
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
