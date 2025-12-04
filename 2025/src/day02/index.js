import run from "aocrunner";

const generateRepeats1 = (cur = "", result = []) => {
    if (cur.length) result.push(cur + cur);
    if (cur.length < 5) {
        for (let i = 0; i < 10; ++i) {
            if (i === 0 && !cur) continue;
            generateRepeats1(cur + i, result);
        }
    }
    return result;
};

const repeats1 = generateRepeats1()
    .map(Number)
    .sort((a, b) => a - b);

const generateRepeats2 = (cur = "", result = new Set()) => {
    if (cur.length) {
        let repeat = cur + cur;
        while (repeat.length <= 10) {
            result.add(repeat);
            repeat += cur;
        }
    }
    if (cur.length < 5) {
        for (let i = 0; i < 10; ++i) {
            if (i === 0 && !cur) continue;
            generateRepeats2(cur + i, result);
        }
    }
    return result;
};

const repeats2 = [...generateRepeats2()].map(Number).sort((a, b) => a - b);

const parseInput = (rawInput) => rawInput;

const solution = (rawInput, repeats) => {
    const input = parseInput(rawInput);
    let result = 0;
    for (const line of input.split(",")) {
        const [start, end] = line.split("-").map(Number);
        for (const n of repeats) {
            if (n >= start && n <= end) {
                result += n;
            }
        }
    }
    return result.toString();
};

const part1 = (rawInput) => {
    return solution(rawInput, repeats1);
};

const part2 = (rawInput) => {
    return solution(rawInput, repeats2);
};

run({
    part1: {
        tests: [
            {
                input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`,
                expected: "1227775554",
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`,
                expected: "4174379265",
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
