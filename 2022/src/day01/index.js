import run from "aocrunner";

const parseInput = (rawInput) => {
    return rawInput.split("\n\n").map((elfString) => {
        return elfString.split("\n").map(Number);
    });
};

const sum = (a, b) => a + b;

const part1 = (rawInput) => {
    const chunks = parseInput(rawInput);
    const totals = chunks.map((chunk) => chunk.reduce(sum, 0));
    return Math.max(...totals);
};

const part2 = (rawInput) => {
    const chunks = parseInput(rawInput);
    const totals = chunks.map((chunk) => chunk.reduce(sum, 0));
    totals.sort((a, b) => b - a);
    return totals[0] + totals[1] + totals[2];
};

run({
    part1: {
        tests: [
            {
                input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
                expected: 24000,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`,
                expected: 45000,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
