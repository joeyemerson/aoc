import run from "aocrunner";

const parseInput = (rawInput) => {
    return rawInput.split("\n").map((row) => row.split(",").map(Number));
};

const part1 = (rawInput) => {
    const points = parseInput(rawInput);
    let maxArea = 0;
    for (let i = 0; i < points.length; ++i) {
        const [x1, y1] = points[i];
        for (let j = i + 1; j < points.length; ++j) {
            const [x2, y2] = points[j];
            maxArea = Math.max(
                maxArea,
                (Math.abs(x1 - x2) + 1) * (Math.abs(y1 - y2) + 1),
            );
        }
    }
    return maxArea.toString();
};

const updateProperty = (map, key, propName, value) => {
    map.get(key)[propName] = value;
};

const updateBounds = (map) => {
    map.forEach((v, k) => {
        v.newMin = v.min;
        v.newMax = v.max;
    });
    const sorted = [...map.entries()].sort((a, b) => a[0] - b[0]);
    for (let i = 0; i < sorted.length; ++i) {
        const [_, v1] = sorted[i];
        for (let j = sorted.length - 1; j > i; --j) {
            const [_, v2] = sorted[j];
            if (v1.min === v2.min) {
                for (let mid = i; mid <= j; ++mid) {
                    const midKey = sorted[mid][0];
                    const curVal = map.get(midKey)["newMin"];
                    const curMin = curVal === undefined ? v1.min : curVal;
                    updateProperty(map, midKey, 'newMin', Math.min(curMin, v1.min)); //prettier-ignore
                }
            }
            if (v1.max === v2.max) {
                for (let mid = i; mid <= j; ++mid) {
                    const midKey = sorted[mid][0];
                    const curVal = map.get(midKey)["newMax"];
                    const curMax = curVal === undefined ? v1.max : curVal;
                    updateProperty(map, midKey, 'newMax', Math.max(curMax, v1.max)); //prettier-ignore
                }
            }
        }
    }
};

const part2 = (rawInput) => {
    const points = parseInput(rawInput);
    const Xs = new Map();
    const Ys = new Map();
    for (const [x, y] of points) {
        if (!Xs.has(x)) Xs.set(x, { min: Infinity, max: -Infinity });
        if (!Ys.has(y)) Ys.set(y, { min: Infinity, max: -Infinity });
        const xMap = Xs.get(x);
        const yMap = Ys.get(y);
        xMap.min = Math.min(xMap.min, y);
        xMap.max = Math.max(xMap.max, y);
        yMap.min = Math.min(yMap.min, x);
        yMap.max = Math.max(yMap.max, x);
    }
    updateBounds(Xs);
    updateBounds(Ys);
    // console.log(Xs);
    let maxArea = 0;
    for (let i = 0; i < points.length; ++i) {
        const [x1, y1] = points[i];
        for (let j = i + 1; j < points.length; ++j) {
            const [x2, y2] = points[j];
            const [l, r] = x1 < x2 ? [x1, x2] : [x2, x1];
            const [t, b] = y1 < y2 ? [y1, y2] : [y2, y1];
            if (
                Ys.get(t).newMin <= l &&
                Ys.get(t).newMax >= r &&
                Ys.get(b).newMin <= l &&
                Ys.get(b).newMax >= r &&
                Xs.get(l).newMin <= t &&
                Xs.get(l).newMax >= b &&
                Xs.get(r).newMin <= t &&
                Xs.get(r).newMax >= b
            ) {
                maxArea = Math.max(maxArea, (r - l + 1) * (b - t + 1));
            }
        }
    }
    return maxArea.toString();
};

run({
    part1: {
        tests: [
            {
                input: `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`,
                expected: "50",
            },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            {
                input: `7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3`,
                expected: "24",
            },
        ],
        solution: part2,
    },
    trimTestInputs: true,
    onlyTests: false,
});
