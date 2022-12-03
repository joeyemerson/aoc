import run from 'aocrunner';

const parseInput = (rawInput) => rawInput.split('\n');

const values = ' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    let sum = 0;
    for (const line of input) {
        const half = line.length / 2;
        const left = new Set([...line.slice(0, half)]);
        const match = [...line.slice(half)].find((char) => left.has(char));
        sum += values.indexOf(match);
    }
    return sum;
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    let sum = 0;
    for (let i = 0; i < input.length; i += 3) {
        const first = new Set([...input[i]]);
        const second = new Set();
        const third = new Set();
        for (const c of input[i + 1]) {
            if (first.has(c)) second.add(c);
        }
        for (const c of input[i + 2]) {
            if (second.has(c)) third.add(c);
        }
        sum += values.indexOf([...third][0]);
    }
    return sum;
};

run({
    part1: {
        tests: [
            {
                input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
                expected: 157,
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg
wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
ttgJtRGJQctTZtZT
CrZsJsPPZsGzwwsLwLmpwMDw`,
                expected: 70,
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
