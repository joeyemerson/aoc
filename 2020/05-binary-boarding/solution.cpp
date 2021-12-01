#include "../aoc.h"

// Using the given formula (row * 8 + col) yields the same value
// as just converting the whole string to binary based on the
// specified set (B, R) and unset (F, L) bit indicators.
int getID(const std::string &boardingPass) {
  std::string binary;
  for (char c : boardingPass)
    binary += c == 'B' || c == 'R' ? '1' : '0';
  return std::stoi(binary, nullptr, 2);
}

int sumNumbersInRange(int min, int max) { return ((max - min) + 1) * (min + max) / 2; }

int main() {
  int minID = std::numeric_limits<int>::max();
  int maxID = std::numeric_limits<int>::min();
  int sumOfInputIDs = 0;

  std::ifstream input("input.txt", std::ios::in);
  if (input.is_open()) {
    std::string line;

    while(getline(input, line)) {
      int curID = getID(line);
      if (maxID < curID) maxID = curID;
      if (curID < minID) minID = curID;
      sumOfInputIDs += curID;
    }

    input.close();
  }

  int targetSum = sumNumbersInRange(minID, maxID); // inclusive range
  int myID = targetSum - sumOfInputIDs;

  // Part 1: Find the max ID in input list
  std::cout << "Part1: " << maxID << std::endl;

  // Part 2: Find the missing ID between minID and maxID
  std::cout << "Part2: " << myID << std::endl;

  return 0;
}
