import run from 'aocrunner';

const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // prettier-ignore
const EMPTY = '.';
const WALL = '#';
const NOGO = ' ';

const parseInput = (rawInput) => {
    const [mapString, commandString] = rawInput.split('\n\n');
    const commands = commandString.match(/[LR]|\d+/g);
    const mapRows = mapString.split('\n');
    const maxWidth = Math.max(...mapRows.map((row) => row.length));
    const map = mapRows.map((row) => [...row.padEnd(maxWidth, ' ')]);
    return [map, commands];
};

const move = (r, c, d, cmd, map, rowBounds, colBounds) => {
    if (cmd === 'L') return [r, c, (4 + d - 1) % 4];
    if (cmd === 'R') return [r, c, (d + 1) % 4];
    const steps = parseInt(cmd);
    for (let i = 0; i < steps; ++i) {
        let nextR = r + DIRS[d][0];
        let nextC = c + DIRS[d][1];
        if (d & 1) {
            // moving vertically
            if (nextR > colBounds[nextC][1]) nextR = colBounds[nextC][0];
            else if (nextR < colBounds[nextC][0]) nextR = colBounds[nextC][1];
        } else {
            // moving horizontally
            if (nextC > rowBounds[nextR][1]) nextC = rowBounds[nextR][0];
            else if (nextC < rowBounds[nextR][0]) nextC = rowBounds[nextR][1];
        }
        if (map[nextR][nextC] === WALL) break;
        r = nextR;
        c = nextC;
    }
    return [r, c, d];
};

const getInitialPosition = (map) => {
    for (let c = 0; c < map[0].length; ++c) {
        if (map[0][c] === EMPTY) {
            return [0, c];
        }
    }
};

const getRowBounds = (h, w, map) => {
    const bounds = [];
    for (let r = 0; r < h; ++r) {
        let loBound, hiBound;
        for (let c = 0; c < w; ++c) {
            if (map[r][c] !== NOGO) {
                if (loBound === undefined) loBound = c;
                else hiBound = c;
            }
        }
        bounds.push([loBound, hiBound]);
    }
    return bounds;
};

const getColBounds = (h, w, map) => {
    const bounds = [];
    for (let c = 0; c < w; ++c) {
        let loBound, hiBound;
        for (let r = 0; r < h; ++r) {
            if (map[r][c] !== NOGO) {
                if (loBound === undefined) loBound = r;
                else hiBound = r;
            }
        }
        bounds.push([loBound, hiBound]);
    }
    return bounds;
};

const part1 = (rawInput) => {
    const [map, commands] = parseInput(rawInput);
    const H = map.length;
    const W = map[0].length;
    const rowBounds = getRowBounds(H, W, map);
    const colBounds = getColBounds(H, W, map);
    let [r, c] = getInitialPosition(map);
    let d = 0;
    for (const cmd of commands) {
        [r, c, d] = move(r, c, d, cmd, map, rowBounds, colBounds);
    }
    return (r + 1) * 1000 + (c + 1) * 4 + d;
};

// for test input
const getFaces = (map, faceHeight, faceWidth) => {
    const front = map.slice(0, faceHeight).map((row) => row.slice(faceWidth * 2, faceWidth * 3));
    const back = map.slice(faceHeight * 2).map((row) => row.slice(faceWidth * 2, faceWidth * 3));
    const left = map.slice(faceHeight, faceHeight * 2).map((row) => row.slice(faceWidth, faceWidth * 2));
    const right = map.slice(faceHeight * 2).map((row) => row.slice(faceWidth * 3));
    const top = map.slice(faceHeight, faceHeight * 2).map((row) => row.slice(faceWidth * 2, faceWidth * 3));
    const bottom = map.slice(faceHeight, faceHeight * 2).map((row) => row.slice(0, faceWidth));
    return { front, back, left, right, top, bottom };
};

/*
front: [faceHeight, faceWidth],
back: [3 * faceHeight, 0],
left: [2 * faceHeight, 0],
right: [0, 2 * faceWidth],
top: [2* faceHeight, faceWidth],
bottom: [0, faceWidth],
*/
const getFaces2 = (map, faceHeight, faceWidth) => {
    const front = map.slice(faceHeight, faceHeight * 2).map((row) => row.slice(faceWidth, faceWidth * 2));
    const back = map.slice(faceHeight * 3).map((row) => row.slice(0, faceWidth));
    const left = map.slice(faceHeight * 2, faceHeight * 3).map((row) => row.slice(0, faceWidth));
    const right = map.slice(0, faceHeight).map((row) => row.slice(faceWidth * 2));
    const top = map.slice(faceHeight * 2, faceHeight * 3).map((row) => row.slice(faceWidth, faceWidth * 2));
    const bottom = map.slice(0, faceHeight).map((row) => row.slice(faceWidth, faceWidth * 2));
    return { front, back, left, right, top, bottom };
};

// for test input
const getStateTransitionMap = (h, w, faces) => {
    const map = Array.from(Array(h), () => {
        return Array.from(Array(w), () => {
            return Array.from(Array(4), () => ({}));
        });
    });
    // simple transitions for inner cells
    for (let r = 0; r < h; ++r) {
        for (let c = 0; c < w; ++c) {
            for (let d = 0; d < 4; ++d) {
                const [rr, cc] = DIRS[d];
                if (r + rr < 0 || r + rr === h || c + cc < 0 || c + cc === w) continue;
                for (const face in faces) {
                    map[r][c][d][face] = [r + rr, c + cc, d, face];
                }
            }
        }
    }
    // Edge transitions
    // DIRS: 0-right, 1-down, 2-left, 3-up
    // top and bottom rows
    for (let c = 0; c < w; ++c) {
        map[0][c][3].front = [0, w - c - 1, 1, 'bottom'];
        map[h - 1][c][1].front = [0, c, 1, 'top'];
        map[0][c][3].back = [h - 1, c, 3, 'top'];
        map[h - 1][c][1].back = [h - 1, w - c - 1, 3, 'bottom'];
        map[0][c][3].left = [c, 0, 0, 'front'];
        map[h - 1][c][1].left = [w - c - 1, 0, 0, 'back'];
        map[0][c][3].right = [w - c - 1, w - 1, 2, 'top'];
        map[h - 1][c][1].right = [w - c - 1, 0, 0, 'bottom'];
        map[0][c][3].top = [h - 1, c, 3, 'front'];
        map[h - 1][c][1].top = [0, c, 1, 'back'];
        map[0][c][3].bottom = [0, w - c - 1, 1, 'front'];
        map[h - 1][c][1].bottom = [h - 1, w - c - 1, 3, 'back'];
    }
    // right and left cols
    for (let r = 0; r < h; ++r) {
        map[r][0][2].front = [0, r, 1, 'left'];
        map[r][w - 1][0].front = [h - r - 1, w - 1, 2, 'right'];
        map[r][0][2].back = [h - 1, w - r - 1, 3, 'left'];
        map[r][w - 1][0].back = [r, 0, 0, 'right'];
        map[r][0][2].left = [r, w - 1, 2, 'bottom'];
        map[r][w - 1][0].left = [r, 0, 0, 'top'];
        map[r][0][2].right = [r, w - 1, 2, 'back'];
        map[r][w - 1][0].right = [h - r - 1, w - 1, 2, 'front'];
        map[r][0][2].top = [r, w - 1, 2, 'left'];
        map[r][w - 1][0].top = [0, w - r - 1, 1, 'right'];
        map[r][0][2].bottom = [h - 1, w - r - 1, 3, 'right'];
        map[r][w - 1][0].bottom = [r, 0, 0, 'left'];
    }
    return map;
};

const getStateTransitionMap2 = (h, w, faces) => {
    const map = Array.from(Array(h), () => {
        return Array.from(Array(w), () => {
            return Array.from(Array(4), () => ({}));
        });
    });
    // simple transitions for inner cells
    for (let r = 0; r < h; ++r) {
        for (let c = 0; c < w; ++c) {
            for (let d = 0; d < 4; ++d) {
                const [rr, cc] = DIRS[d];
                if (r + rr < 0 || r + rr === h || c + cc < 0 || c + cc === w) continue;
                for (const face in faces) {
                    map[r][c][d][face] = [r + rr, c + cc, d, face];
                }
            }
        }
    }
    // Edge transitions
    // DIRS: 0-right, 1-down, 2-left, 3-up
    // top and bottom rows
    for (let c = 0; c < w; ++c) {
        map[0][c][3].front = [h - 1, c, 3, 'bottom'];
        map[h - 1][c][1].front = [0, c, 1, 'top'];
        map[0][c][3].back = [h - 1, c, 3, 'left'];
        map[h - 1][c][1].back = [0, c, 1, 'right'];
        map[0][c][3].left = [c, 0, 0, 'front'];
        map[h - 1][c][1].left = [0, c, 1, 'back'];
        map[0][c][3].right = [h - 1, c, 3, 'back'];
        map[h - 1][c][1].right = [c, w - 1, 2, 'front'];
        map[0][c][3].top = [h - 1, c, 3, 'front'];
        map[h - 1][c][1].top = [c, w - 1, 2, 'back'];
        map[0][c][3].bottom = [c, 0, 0, 'back'];
        map[h - 1][c][1].bottom = [0, c, 1, 'front'];
    }
    // right and left cols
    for (let r = 0; r < h; ++r) {
        map[r][0][2].front = [0, r, 1, 'left'];
        map[r][w - 1][0].front = [h - 1, r, 3, 'right'];
        map[r][0][2].back = [0, r, 1, 'bottom'];
        map[r][w - 1][0].back = [h - 1, r, 3, 'top'];
        map[r][0][2].left = [h - r - 1, 0, 0, 'bottom'];
        map[r][w - 1][0].left = [r, 0, 0, 'top'];
        map[r][0][2].right = [r, w - 1, 2, 'bottom'];
        map[r][w - 1][0].right = [h - r - 1, w - 1, 2, 'top'];
        map[r][0][2].top = [r, w - 1, 2, 'left'];
        map[r][w - 1][0].top = [h - r - 1, w - 1, 2, 'right'];
        map[r][0][2].bottom = [h - r - 1, 0, 0, 'left'];
        map[r][w - 1][0].bottom = [r, 0, 0, 'right'];
    }
    return map;
};

const move2 = (r, c, d, face, cmd, faces, stateTransitionMap) => {
    if (cmd === 'L') return [r, c, (4 + d - 1) % 4, face];
    if (cmd === 'R') return [r, c, (d + 1) % 4, face];
    const steps = parseInt(cmd);
    for (let i = 0; i < steps; ++i) {
        const [nextR, nextC, nextD, nextFace] = stateTransitionMap[r][c][d][face];
        if (faces[nextFace][nextR][nextC] === WALL) break;
        r = nextR;
        c = nextC;
        d = nextD;
        face = nextFace;
    }
    return [r, c, d, face];
};

const part2 = (rawInput) => {
    const [map, commands] = parseInput(rawInput);
    const faceHeight = map.length > map[0].length ? map.length / 4 : map.length / 3; // size of a face
    const faceWidth = map.length > map[0].length ? map[0].length / 3 : map[0].length / 4;
    // const faceOffsets = { // for test input
    //     front: [0, 2 * faceWidth],
    //     back: [2 * faceHeight, 2 * faceWidth],
    //     left: [faceHeight, faceWidth],
    //     right: [2 * faceHeight, 3 * faceWidth],
    //     top: [faceHeight, 2 * faceWidth],
    //     bottom: [faceHeight, 0],
    // };
    const faceOffsets = {
        front: [faceHeight, faceWidth],
        back: [3 * faceHeight, 0],
        left: [2 * faceHeight, 0],
        right: [0, 2 * faceWidth],
        top: [2 * faceHeight, faceWidth],
        bottom: [0, faceWidth],
    };
    const faces = getFaces2(map, faceHeight, faceWidth);
    const stateTransitionMap = getStateTransitionMap2(faceHeight, faceWidth, faces);
    let face = 'front';
    let d = 0;
    let [r, c] = getInitialPosition(faces[face]);
    for (const cmd of commands) {
        [r, c, d, face] = move2(r, c, d, face, cmd, faces, stateTransitionMap);
    }
    return (r + faceOffsets[face][0] + 1) * 1000 + (c + faceOffsets[face][1] + 1) * 4 + d;
};

// prettier-ignore
const testInput = `        ...#
        .#..
        #...
        ....
...#.......#
........#...
..#....#....
..........#.
        ...#....
        .....#..
        .#......
        ......#.

10R5L5R10L4R5L5`;

run({
    part1: {
        tests: [
            // {
            //     input: testInput,
            //     expected: 6032,
            // },
        ],
        solution: part1,
    },
    part2: {
        tests: [
            // {
            //     input: testInput,
            //     expected: 5031,
            // },
        ],
        solution: part2,
    },
    trimTestInputs: false,
    onlyTests: false,
});
