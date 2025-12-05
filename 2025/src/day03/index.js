import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    let result = 0;
    for (const line of input.split("\n")) {
        let bankMax = 0;
        let max = 0;
        for (const dig of line) {
            bankMax = Math.max(bankMax, max * 10 + parseInt(dig));
            max = Math.max(max, parseInt(dig));
        }
        result += bankMax;
    }
    return result.toString();
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    let result = 0;
    for (const line of input.split("\n")) {
        const max = Array(12).fill(0);
        const nums = [...line].map(Number);
        const size = nums.length;
        for (let i = 0; i < size; ++i) {
            const d = nums[i];
            for (let j = 0, found = false; j < 12; ++j) {
                if (found) {
                    max[j] = 0;
                    continue;
                }
                if (d > max[j] && size - i - 1 >= 12 - j - 1) {
                    max[j] = d;
                    found = true;
                }
            }
        }
        result += parseInt(max.join(""));
    }
    return result.toString();
};

run({
    part1: {
        tests: [
            {
                input: `987654321111111
811111111111119
234234234234278
818181911112111`,
                expected: "357",
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `987654321111111
811111111111119
234234234234278
818181911112111`,
                expected: "3121910778619",
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
