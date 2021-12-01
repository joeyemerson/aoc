#include "../aoc.h"

class Ship {
private:
  int x = 0;
  int y = 0;
  int offsetX = 10;
  int offsetY = 1;
  int direction = 90;
  std::map<int, char> directions { {0, 'N'}, {90, 'E'}, {180, 'S'}, {270, 'W'} };

public:
  int getX() { return x; }
  int getY() { return y; }

  void updatePosition(std::string &instruction, int mode) {
    char action = instruction.at(0);
    int units = std::stoi(instruction.substr(1));

    if (mode == 1) {
      switch(action) {
        case 'N': y += units; break;
        case 'E': x += units; break;
        case 'S': y -= units; break;
        case 'W': x -= units; break;
        case 'L': direction = (direction + (360 - units)) % 360; break;
        case 'R': direction = (direction + units) % 360; break;
        case 'F':
          std::string newInstruction;
          newInstruction += directions.at(direction) + instruction.substr(1);
          updatePosition(newInstruction, 1);
          break;
      }
    } else if (mode == 2) {
      if (action == 'F') {
        x += abs(offsetX * units) * (offsetX < 0 ? -1 : 1);
        y += abs(offsetY * units) * (offsetY < 0 ? -1 : 1);
      } else {
        updateWaypoint(action, units);
      }
    }
  }

  void updateWaypoint(char action, int units) {
    switch(action) {
      case 'N': offsetY += units; break;
      case 'E': offsetX += units; break;
      case 'S': offsetY -= units; break;
      case 'W': offsetX -= units; break;
      case 'L': rotateWaypoint(units / 90, 'L'); break;
      case 'R': rotateWaypoint(units / 90, 'R'); break;
    }
  }

  void rotateWaypoint(int times, char mode) {
    for (int i = 0; i < times; ++i) {
      int tempY;

      if (mode == 'L') {
        tempY = offsetX;
        offsetX = -offsetY;
        offsetY = tempY;
      }

      if (mode == 'R') {
        tempY = -offsetX;
        offsetX = offsetY;
        offsetY = tempY;
      }
    }
  }
};

int main() {
  Ship ship1;
  Ship ship2;

  std::ifstream input("input.txt", std::ios::in);
  if (input.is_open()) {
    std::string instruction;
    enum modes { part1 = 1, part2 = 2 };

    while(getline(input, instruction)) {
      ship1.updatePosition(instruction, part1);
      ship2.updatePosition(instruction, part2);
    }

    input.close();
  }

  std::cout << "Part 1: " << abs(ship1.getX()) + abs(ship1.getY()) << std::endl;
  std::cout << "Part 2: " << abs(ship2.getX()) + abs(ship2.getY()) << std::endl;

  return 0;
}
