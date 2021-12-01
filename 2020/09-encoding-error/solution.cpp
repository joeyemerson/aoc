#include "../aoc.h"

// For every num from index 25 -> end, check if any 2 nums within
// the previous 25 nums add up to the current value. If not, return that value.
uint32_t part1(const std::vector<uint32_t> &nums) {
  size_t preambleSize = 25;
  std::unordered_set<uint32_t> seen;

  for (size_t i = 0; i < preambleSize; ++i) { seen.emplace(nums[i]); }

  for (size_t i = preambleSize; i < nums.size(); ++i) {
    uint32_t target = nums[i];
    bool valid = false;

    for (size_t j = i - preambleSize; j < i; ++j) {
      uint32_t difference = abs(target - nums[j]);
      if (seen.find(difference) != seen.end() && difference != nums[j]) {
        valid = true;
        break;
      }
    }

    if (!valid) { return nums[i]; }

    seen.erase(nums[i - preambleSize]);
    seen.emplace(nums[i]);
  }

  return 0;
}

// Find a contiguous subarray (size >= 2) of nums that equals the target value.
// Once found, return the sum of the min and max numbers in that subarray.
uint32_t part2(uint32_t target, const std::vector<uint32_t> &nums) {
  size_t i = 0;
  size_t j = 1;
  uint32_t curSum = nums[i] + nums[j];

  while (curSum != target) {
    if (curSum < target || i == j - 1) { ++j; curSum += nums[j]; }
    else { curSum -= nums[i]; ++i; }
  }

  uint32_t subArrMin = 0xFFFFFFFF;
  uint32_t subArrMax = 0;

  for (size_t k = i; k <= j; ++k) {
    subArrMin = std::min(subArrMin, nums[k]);
    subArrMax = std::max(subArrMax, nums[k]);
  }

  return subArrMin + subArrMax;
}

int main() {
  std::vector<uint32_t> nums;

  std::ifstream input("input.txt", std::ios::in);
  if (input.is_open()) {
    std::string line;
    while(getline(input, line)) { nums.push_back(std::stoul(line)); }
    input.close();
  }

  uint32_t p1 = part1(nums);
  uint32_t p2 = part2(p1, nums);

  std::cout << "Part 1: " << p1 << std::endl;
  std::cout << "Part 2: " << p2 << std::endl;

  return 0;
}
