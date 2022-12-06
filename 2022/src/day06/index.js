import run from 'aocrunner';

const parseInput = (rawInput) => rawInput;

const solve = (input, size) => {
    for (let i = 0; i < input.length; ++i) {
        if (new Set(input.slice(i, i + size)).size === size) return i + size;
    }
};

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    return solve(input, 4);
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    return solve(input, 14);
};

run({
    part1: {
        tests: [
            {
                input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
                expected: 7,
            },
            {
                input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
                expected: 5,
            },
            {
                input: `nppdvjthqldpwncqszvftbrmjlhg`,
                expected: 6,
            },
            {
                input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
                expected: 10,
            },
            {
                input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
                expected: 11,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
                expected: 19,
            },
            {
                input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
                expected: 23,
            },
            {
                input: `nppdvjthqldpwncqszvftbrmjlhg`,
                expected: 23,
            },
            {
                input: `nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg`,
                expected: 29,
            },
            {
                input: `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`,
                expected: 26,
            },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
