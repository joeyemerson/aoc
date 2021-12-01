#include "../aoc.h"

int main() {
  std::fstream newfile;
  std::vector<int> nums;
  std::unordered_set<int> seen;

  newfile.open("input.txt", std::ios::in);

  if (newfile.is_open()) {
    std::string line;

    while(getline(newfile, line)) {
      nums.push_back(std::stoi(line));
    }

    newfile.close();
  }

  int target;
  for (int n: nums) {
    target = 2020 - n;

    if (seen.find(target) != seen.end()) {
      std::cout << n << " * " << target << " = " << n * target << std::endl;
      break;
    }

    seen.emplace(n);
  }

  return 0;
}