import run from "aocrunner";

const parseInput = (rawInput) => {
    const rows = rawInput.split("\n");
    const startPos = rows.shift().indexOf("S");
    return [rows, startPos];
};

const part1 = (rawInput) => {
    const [rows, startPos] = parseInput(rawInput);
    const beams = new Set([startPos]);
    let splits = 0;
    for (const row of rows) {
        for (const beamIdx of [...beams]) {
            if (row[beamIdx] === "^") {
                beams.delete(beamIdx);
                beams.add(beamIdx - 1);
                beams.add(beamIdx + 1);
                ++splits;
            }
        }
    }
    return splits.toString();
};

const part2 = (rawInput) => {
    const [rows, startCol] = parseInput(rawInput);
    const cache = Array.from(Array(rows.length), () => Array(rows[0].length));
    const dfs = (row, col) => {
        if (row === rows.length) return 1;
        if (cache[row][col] === undefined) {
            if (rows[row][col] === "^") {
                cache[row][col] = dfs(row + 1, col - 1) + dfs(row + 1, col + 1); //prettier-ignore
            } else {
                cache[row][col] = dfs(row + 1, col);
            }
        }
        return cache[row][col];
    };
    return dfs(0, startCol).toString();
};

run({
    part1: {
        tests: [
            {
                input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
                expected: "21",
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............`,
                expected: "40",
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
