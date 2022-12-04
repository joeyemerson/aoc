import run from 'aocrunner';

const parseInput = (rawInput) => {
    return rawInput.split('\n').map((row) => {
        return row.split(',').map((part) => {
            return part.split('-').map(Number);
        });
    });
};

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    let overlaps = 0;
    for (const [[s, e], [ss, ee]] of input) {
        if ((s >= ss && e <= ee) || (ss >= s && ee <= e)) ++overlaps;
    }
    return overlaps;
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    let overlaps = 0;
    for (const [[s, e], [ss, ee]] of input) {
        if ((s >= ss && s <= ee) || (e >= ss && e <= ee) || (ss >= s && ss <= e) || (ee >= s && ee <= e)) ++overlaps;
    }
    return overlaps;
};

run({
    part1: {
        tests: [
            {
                input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
                expected: 2,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8`,
                expected: 4,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
