const PriorityQueue = function (compare) {
  const _heap = [null];

  const _swap = function (a, b) {
    const temp = _heap[a];
    _heap[a] = _heap[b];
    _heap[b] = temp;
  };

  const _siftUp = function (idx) {
    const parent = Math.floor(idx / 2);
    while (parent > 0 && compare(_heap[idx], _heap[parent])) {
      _swap(idx, parent);
      _siftUp(parent);
    }
  };

  const _siftDown = function (idx) {
    const leftChild = idx * 2;
    const rightChild = idx * 2 + 1;

    if (
      leftChild < _heap.length &&
      compare(_heap[leftChild], _heap[idx]) &&
      (rightChild >= _heap.length || compare(_heap[leftChild], _heap[rightChild]))
    ) {
      _swap(idx, leftChild);
      _siftDown(leftChild);
    } else if (rightChild < _heap.length && compare(_heap[rightChild], _heap[idx])) {
      _swap(idx, rightChild);
      _siftDown(rightChild);
    }
  };

  const enqueue = function (value) {
    _heap.push(value);
    _siftUp(_heap.length - 1);
  };

  const dequeue = function () {
    if (isEmpty()) return null;
    const top = _heap[1];
    const end = _heap.pop();

    // check if we removed last item
    if (!isEmpty()) {
      _heap[1] = end;
      _siftDown(1);
    }

    return top;
  };

  const isEmpty = function () {
    return _heap.length === 1;
  };

  return { enqueue, dequeue, isEmpty };
};

module.exports.PriorityQueue = PriorityQueue;
