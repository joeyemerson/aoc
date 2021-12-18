const fs = require('fs');

const input = fs
  .readFileSync('./input')
  .toString()
  .split('\n')
  .filter(line => line !== '');

const TreeNode = function (val, parent = null) {
  this.val = val;
  this.parent = parent;
  this.left = null;
  this.right = null;
};

const constructTree = (str, parent) => {
  const root = new TreeNode(-1, parent);
  let open = 0;
  let leftStr;
  let rightStr;

  // Find the comma separating left and right parts of top level, then split
  for (let i = 0; i < str.length; ++i) {
    if (str[i] === '[') ++open;
    else if (str[i] === ']') --open;
    else if (str[i] === ',' && open === 1) {
      leftStr = str.slice(1, i); // take everything except the first opening
      rightStr = str.slice(i + 1, -1); // and last closing braces
      break;
    }
  }

  if (leftStr.length > 1) root.left = constructTree(leftStr, root);
  else root.left = new TreeNode(parseInt(leftStr), root);

  if (rightStr.length > 1) root.right = constructTree(rightStr, root);
  else root.right = new TreeNode(parseInt(rightStr), root);

  return root;
};

const mergeTrees = (a, b) => {
  const newRoot = new TreeNode(-1);
  newRoot.left = a;
  newRoot.right = b;
  a.parent = newRoot;
  b.parent = newRoot;
  return newRoot;
};

const getExplodeNode = (node, depth = 0) => {
  if (!node) return null;
  if (depth >= 4 && node.val === -1 && node.left.val !== -1 && node.right.val !== -1) return node;
  return getExplodeNode(node.left, depth + 1) || getExplodeNode(node.right, depth + 1);
};

const explode = node => {
  const _explode = (node, prevNode, addVal, dir, traversingUp) => {
    if (!node[dir]) return;

    if (node[dir] !== prevNode) {
      if (traversingUp && node[dir].val === -1)
        _explode(node[dir], null, addVal, dir === 'left' ? 'right' : 'left', false);
      else if (node[dir].val === -1) _explode(node[dir], null, addVal, dir, traversingUp);
      else node[dir].val += addVal;
    } else if (node.parent) {
      _explode(node.parent, node, addVal, dir, traversingUp);
    }
  };

  const leftVal = node.left.val;
  const rightVal = node.right.val;
  node.val = 0;
  node.left = null;
  node.right = null;
  _explode(node.parent, node, leftVal, 'left', true);
  _explode(node.parent, node, rightVal, 'right', true);
};

const getSplitNode = node => {
  if (!node) return null;
  if (node.val > 9) return node;
  return getSplitNode(node.left) || getSplitNode(node.right);
};

const split = node => {
  const val = node.val;
  node.val = -1;
  node.left = new TreeNode(Math.floor(val / 2));
  node.right = new TreeNode(Math.ceil(val / 2));
  node.left.parent = node;
  node.right.parent = node;
};

const reduce = root => {
  while (true) {
    const explodeNode = getExplodeNode(root);
    if (explodeNode) {
      explode(explodeNode);
      continue;
    }

    const splitNode = getSplitNode(root);
    if (splitNode) {
      split(splitNode);
      continue;
    }

    break; // no more exploding or splitting to be done!
  }

  return root;
};

const calculateMagnitude = node => {
  if (!node) return 0;
  if (node.val !== -1) return node.val;
  return 3 * calculateMagnitude(node.left) + 2 * calculateMagnitude(node.right);
};

// Part 1: Add up all of the snailfish numbers from the homework assignment in the order they appear.
// What is the magnitude of the final sum?
const p1 = input => {
  let root = constructTree(input[0]);

  for (let i = 1; i < input.length; ++i) {
    root = mergeTrees(root, constructTree(input[i], null));
    reduce(root);
  }

  return calculateMagnitude(root);
};

// Part 2: What is the largest magnitude of any sum of two different snailfish numbers from the homework assignment?
const p2 = input => {
  let maxMagnitude = 0;

  for (let i = 0; i < input.length; ++i) {
    for (let j = i + 1; j < input.length; ++j) {
      // Addition is not commutative, so we have to try adding with the terms on both sides (so to speak)
      const rootA = mergeTrees(constructTree(input[i], null), constructTree(input[j], null));
      const rootB = mergeTrees(constructTree(input[j], null), constructTree(input[i], null));
      maxMagnitude = Math.max(maxMagnitude, calculateMagnitude(reduce(rootA)), calculateMagnitude(reduce(rootB)));
    }
  }

  return maxMagnitude;
};

console.time('Part 1 Time');
console.log('Part 1:', p1(input));
console.timeEnd('Part 1 Time');
console.log();

console.time('Part 2 Time');
console.log('Part 2:', p2(input));
console.timeEnd('Part 2 Time');
