import run from "aocrunner";

const parseInput = (rawInput) => rawInput;

const part1 = (rawInput) => {
    const input = parseInput(rawInput);
    const [rangesString, ingredientsString] = input.split("\n\n");
    const ranges = rangesString
        .split("\n")
        .map((str) => str.split("-").map(Number));
    const ingredients = ingredientsString.split("\n").map(Number);
    let result = 0;
    for (const ing of ingredients) {
        for (const [start, end] of ranges) {
            if (ing >= start && ing <= end) {
                ++result;
                break;
            }
        }
    }
    return result.toString();
};

const part2 = (rawInput) => {
    const input = parseInput(rawInput);
    const [rangesString, _] = input.split("\n\n");
    const ranges = rangesString
        .split("\n")
        .map((str) => str.split("-").map(Number))
        .sort((a, b) => b[0] - a[0] || b[1] - a[1]);
    const merged = [ranges.pop()];
    while (ranges.length) {
        const [rs, re] = ranges.pop();
        const [ms, me] = merged.at(-1);
        if (rs <= me) merged.at(-1)[1] = Math.max(merged.at(-1)[1], re);
        else merged.push([rs, re]);
    }
    return merged.reduce((acc, cur) => acc + cur[1] - cur[0] + 1, 0).toString();
};

run({
    part1: {
        tests: [
            {
                input: `3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
                expected: "3",
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `3-5
10-14
16-20
12-18

1
5
8
11
17
32`,
                expected: "14",
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
