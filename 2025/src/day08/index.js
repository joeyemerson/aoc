import run from "aocrunner";

const parseInput = (rawInput) => {
    return rawInput.split("\n").map((row) => row.split(",").map(Number));
};

const getDistance = (p1, p2) => {
    return Math.sqrt(
        (p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2 + (p2[2] - p1[2]) ** 2,
    );
};

const part1 = (rawInput) => {
    const points = parseInput(rawInput);
    const pairs = [];
    for (let i = 0; i < points.length; ++i) {
        for (let j = i + 1; j < points.length; ++j) {
            const dist = getDistance(points[i], points[j]);
            pairs.push([dist, i, j]);
        }
    }
    const uf = Array.from(Array(points.length), (_, i) => i);
    const find = (a) => (a !== uf[a] ? (uf[a] = find(uf[a])) : a);
    const union = (a, b) => (uf[find(a)] = find(b));
    let maxConnections = points.length > 20 ? 1000 : 10;
    pairs.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < maxConnections; ++i) {
        const [dist, idx1, idx2] = pairs[i];
        union(idx1, idx2);
    }
    const counts = new Map();
    uf.forEach((val) => {
        const circuit = find(val);
        counts.set(circuit, (counts.get(circuit) || 0) + 1);
    });
    const threeLargest = [...counts.values()].sort((a, b) => b - a);
    threeLargest.length = 3;
    return threeLargest.reduce((acc, cur) => acc * cur, 1).toString();
};

const part2 = (rawInput) => {
    const points = parseInput(rawInput);
    const pairs = [];
    for (let i = 0; i < points.length; ++i) {
        for (let j = i + 1; j < points.length; ++j) {
            const dist = getDistance(points[i], points[j]);
            pairs.push([dist, i, j]);
        }
    }
    const uf = Array.from(Array(points.length), (_, i) => i);
    const find = (a) => (a !== uf[a] ? (uf[a] = find(uf[a])) : a);
    const union = (a, b) => (uf[find(a)] = find(b));
    pairs.sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < pairs.length; ++i) {
        const [_, idx1, idx2] = pairs[i];
        union(idx1, idx2);
        if (new Set(uf.map((val) => find(val))).size === 1) {
            return (points[idx1][0] * points[idx2][0]).toString();
        }
    }
};

run({
    part1: {
        tests: [
            {
                input: `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`,
                expected: "40",
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`,
                expected: "25272",
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
