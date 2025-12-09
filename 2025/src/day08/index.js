import run from "aocrunner";

class UnionFind {
    constructor(size) {
        this.size = size;
        this.uf = Array.from(Array(this.size), (_, i) => i);
        this.sizes = new Map(this.uf.map((x) => [x, 1]));
    }
    find(a) {
        return a !== this.uf[a] ? (this.uf[a] = this.find(this.uf[a])) : a;
    }
    union(a, b) {
        let bigRoot = this.find(a);
        let smallRoot = this.find(b);
        if (bigRoot === smallRoot) return;
        if (this.sizes.get(bigRoot) < this.sizes.get(smallRoot)) {
            [bigRoot, smallRoot] = [smallRoot, bigRoot];
        }
        this.uf[smallRoot] = bigRoot;
        this.sizes.set(bigRoot, this.sizes.get(bigRoot) + this.sizes.get(smallRoot)); //prettier-ignore
        this.sizes.delete(smallRoot);
    }
}

const getDistance = (p1, p2) => {
    return Math.sqrt(
        (p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2 + (p2[2] - p1[2]) ** 2,
    );
};

const parseInput = (rawInput) => {
    const points = rawInput
        .split("\n")
        .map((row) => row.split(",").map(Number));
    const pairs = [];
    for (let i = 0; i < points.length; ++i) {
        for (let j = i + 1; j < points.length; ++j) {
            const dist = getDistance(points[i], points[j]);
            pairs.push([dist, i, j]);
        }
    }
    pairs.sort((a, b) => a[0] - b[0]);
    return [points, pairs];
};

const part1 = (rawInput) => {
    const [points, pairs] = parseInput(rawInput);
    const uf = new UnionFind(points.length);
    let maxConnections = points.length > 20 ? 1000 : 10;
    for (let i = 0; i < maxConnections; ++i) {
        const [_, idx1, idx2] = pairs[i];
        uf.union(idx1, idx2);
    }
    const sizes = [...uf.sizes.values()].sort((a, b) => b - a);
    return (sizes[0] * sizes[1] * sizes[2]).toString();
};

const part2 = (rawInput) => {
    const [points, pairs] = parseInput(rawInput);
    const uf = new UnionFind(points.length);
    for (const [_, idx1, idx2] of pairs) {
        uf.union(idx1, idx2);
        if (uf.sizes.size === 1) {
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
