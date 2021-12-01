#include "../aoc.h"

struct Cell {
  char originalState;
  char curState;
  char nextState;

  Cell (char value) {
    originalState = value;
    curState = value;
    nextState = value;
  }
};

class Automata {
public:
  Automata(std::ifstream input) {
    if (input.is_open()) {
      std::string line;

      while(getline(input, line)) {
        std::vector<Cell> row;
        row.reserve(line.length());
        for (char value : line) {
          row.emplace_back(Cell(value));
          if (value == active) { ++activeCount; }
        }
        matrix.emplace_back(row);
      }

      input.close();
    }

    height = matrix.size();
    width = height ? matrix.at(0).size() : 0;
  }

  int activeCells() { return activeCount; }

  void stabilize(bool viewNeighborsOnly) {
    bool cellsChanged;
    int minActiveVisible = viewNeighborsOnly ? 4 : 5;

    do {
      cellsChanged = false;
      updateState();

      for (int i = 0; i < height; ++i) {
        for (int j = 0; j < width; ++j) {
          char curState = matrix[i][j].curState;

          if (curState == inactive && countOccupied(i, j, viewNeighborsOnly) == 0) {
            matrix[i][j].nextState = active;
            cellsChanged = true;
            ++activeCount;
          } else if (curState == active && countOccupied(i, j, viewNeighborsOnly) >= minActiveVisible) {
            matrix[i][j].nextState = inactive;
            cellsChanged = true;
            --activeCount;
          } else {
            matrix[i][j].nextState = curState;
          }
        }
      }
    } while (cellsChanged);
  }

  void reset() {
    for (int i = 0; i < height; ++i) {
      for (int j = 0; j < width; ++j) {
        if (matrix[i][j].curState == active && matrix[i][j].originalState == inactive) { --activeCount; }
        else if (matrix[i][j].curState == inactive && matrix[i][j].originalState == active) { ++activeCount; }
        matrix[i][j].curState = matrix[i][j].originalState;
        matrix[i][j].nextState = matrix[i][j].originalState;
      }
    }
  }

private:
  std::vector<std::vector<Cell>> matrix;
  char active = '#';
  char inactive = 'L';
  int activeCount = 0;
  int height, width;

  void updateState() {
    for (int i = 0; i < height; ++i) {
      for (int j = 0; j < width; ++j) {
        matrix[i][j].curState = matrix[i][j].nextState;
      }
    }
  }

  int countOccupied(int i, int j, bool viewNeighborsOnly) {
    return viewNeighborsOnly ? countOccupiedNeighbors(i, j) : countOccupiedVisible(i, j);
  }

  int countOccupiedNeighbors(int i, int j) {
    int occupiedNeighbors = 0;

    // check above
    if (i > 0) {
      if (matrix.at(i-1).at(j).curState == active) ++occupiedNeighbors;
      if (j > 0 && matrix.at(i-1).at(j-1).curState == active) ++occupiedNeighbors;
      if (j < width - 1 && matrix.at(i-1).at(j+1).curState == active) ++occupiedNeighbors;
    }

    // check below
    if (i < height - 1) {
      if (matrix.at(i+1).at(j).curState == active) ++occupiedNeighbors;
      if (j > 0 && matrix.at(i+1).at(j-1).curState == active) ++occupiedNeighbors;
      if (j < width - 1 && matrix.at(i+1).at(j+1).curState == active) ++occupiedNeighbors;
    }

    // check left and right
    if (j > 0 && matrix.at(i).at(j-1).curState == active) ++occupiedNeighbors;
    if (j < width - 1 && matrix.at(i).at(j+1).curState == active) ++occupiedNeighbors;

    return occupiedNeighbors;
  }

  int countOccupiedVisible(int I, int J) {
    int occupiedVisible = 0;

    // check above
    for (int i = I - 1, j = J; i >= 0; --i) {
      if (matrix.at(i).at(j).curState == inactive) { break; }
      if (matrix.at(i).at(j).curState == active) { ++occupiedVisible; break; }
    }
    // check below
    for (int i = I + 1, j = J; i < height; ++i) {
      if (matrix.at(i).at(j).curState == inactive) { break; }
      if (matrix.at(i).at(j).curState == active) { ++occupiedVisible; break; }
    }

    // check right
    for (int i = I, j = J + 1; j < width; ++j) {
      if (matrix.at(i).at(j).curState == inactive) { break; }
      if (matrix.at(i).at(j).curState == active) { ++occupiedVisible; break; }
    }

    // check left
    for (int i = I, j = J - 1; j >= 0; --j) {
      if (matrix.at(i).at(j).curState == inactive) { break; }
      if (matrix.at(i).at(j).curState == active) { ++occupiedVisible; break; }
    }

    // check up-right
    for (int i = I - 1, j = J + 1; i >= 0 && j < width; --i, ++j) {
      if (matrix.at(i).at(j).curState == inactive) { break; }
      if (matrix.at(i).at(j).curState == active) { ++occupiedVisible; break; }
    }

    // check up-left
    for (int i = I - 1, j = J - 1; i >= 0 && j >= 0; --i, --j) {
      if (matrix.at(i).at(j).curState == inactive) { break; }
      if (matrix.at(i).at(j).curState == active) { ++occupiedVisible; break; }
    }

    // check down-right
    for (int i = I + 1, j = J + 1; i < height && j < width; ++i, ++j) {
      if (matrix.at(i).at(j).curState == inactive) { break; }
      if (matrix.at(i).at(j).curState == active) { ++occupiedVisible; break; }
    }

    // check down-left
    for (int i = I + 1, j = J - 1; i < height && j >= 0; ++i, --j) {
      if (matrix.at(i).at(j).curState == inactive) { break; }
      if (matrix.at(i).at(j).curState == active) { ++occupiedVisible; break; }
    }

    return occupiedVisible;
  }
};

int main() {
  std::cout << "==================================\nTimer Information\n==================================\n";
  Timer timerParts;
  Timer timerMain;

  Automata automata(std::ifstream("input.txt", std::ios::in));
  std::cout << "Automata Construction:\t" << timerParts.elapsed() << std::endl;

  timerParts.reset();
  automata.stabilize(true);
  std::cout << "Stabilize Part 1:\t" << timerParts.elapsed() << std::endl;

  int p1 = automata.activeCells();

  timerParts.reset();
  automata.reset();
  std::cout << "Reset Automata:\t\t" << timerParts.elapsed() << std::endl;

  timerParts.reset();
  automata.stabilize(false);
  std::cout << "Stabilize Part 2:\t" << timerParts.elapsed() << std::endl;

  int p2 = automata.activeCells();

  std::cout << "Total Runtime:\t\t" << timerMain.elapsed() << std::endl;

  std::cout << "\n==================================\nAoC Answers\n==================================\n";
  std::cout << "Part 1: " << p1 << std::endl;
  std::cout << "Part 2: " << p2 << std::endl;
  return 0;
}
