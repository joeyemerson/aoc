#include "../aoc.h"

int main() {
  std::fstream newfile;
  std::vector<int> nums;
  std::unordered_set<int> seen;

  newfile.open("input.txt", std::ios::in);

  if (newfile.is_open()) {
    std::string line;
    int cur;

    while(getline(newfile, line)) {
      cur = std::stoi(line);
      nums.push_back(cur);
      seen.emplace(cur);
    }

    newfile.close();
  }

  int target;
  bool found = false;

  for (int i = 0; i < nums.size() && !found; i++) {
    for (int j = i + 1; j < nums.size(); j++) {
      target = 2020 - nums[i] - nums[j];

      if (seen.find(target) != seen.end()) {
        int product = nums[i] * nums[j] * target;
        std::cout << nums[i] << " * " << nums[j] << " * " << target << " = " << product << std::endl;
        found = true;
        break;
      }
    }
  }

  return 0;
}