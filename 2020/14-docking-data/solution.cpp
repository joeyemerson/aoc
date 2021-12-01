#include "../aoc.h"

uint64_t part1(const std::vector<std::string> &input) {
  std::unordered_map<std::string, uint64_t> memory;
  std::string address;
  std::string mask;

  for (const std::string &line : input) {
    if (line.substr(0, 4) == "mask") {
      mask = line.substr(7);
    } else {
      address = line.substr(4, line.find(']') - 4);
      std::bitset<64> bits(std::stoull(line.substr(line.find('=') + 2)));

      for (size_t i = 0; i < 36; ++i) {
        if (mask[35-i] == '1') { bits.set(i); }
        else if (mask[35-i] == '0') { bits.reset(i); }
      }

      memory[address] = bits.to_ullong();
    }
  }

  uint64_t sum = std::accumulate(
    memory.begin(),
    memory.end(),
    0ULL,
    [](auto value, const auto &it) { return value + it.second; }
  );

  return sum;
}

std::string intToBinary(uint64_t n) {
  std::string binary;

  while (n) {
    if (n & 1) binary += '1';
    else binary += '0';
    n >>= 1;
  }

  std::reverse(binary.begin(), binary.end());
  return binary;
}

void setAddressCombinations(std::string &address, std::vector<std::string> &cache) {
  size_t idx = address.find('X');

  if (idx == std::string::npos) {
    cache.emplace_back(address);
    return;
  }

  std::string a = address.substr(0, idx) + "0" + address.substr(idx + 1);
  std::string b = address.substr(0, idx) + "1" + address.substr(idx + 1);
  setAddressCombinations(a, cache);
  setAddressCombinations(b, cache);
}

std::vector<std::string> getAddressCombinations(std::string &address) {
  std::vector<std::string> cache;
  setAddressCombinations(address, cache);
  return cache;
}

std::string addHugeNumbers(std::string &a, std::string &b) {
  std::string sum;
  int i = a.length() - 1;
  int j = b.length() - 1;
  int carry = 0;
  int curSum = 0;
  int curDigit;

  while (i >= 0 || j >= 0) {
    if (i >= 0) curSum += a[i] - '0';
    if (j >= 0) curSum += b[j] - '0';
    curSum += carry;
    sum += std::to_string(curSum % 10);
    carry = curSum / 10;
    curSum = 0;
    i--;
    j--;
  }

  if (carry) sum += std::to_string(carry);
  std::reverse(sum.begin(), sum.end());
  return sum;
}

std::string part2(const std::vector<std::string> &input) {
  std::unordered_map<std::string, uint64_t> memory;
  std::string mask;
  std::string address;
  uint64_t value;
  size_t len;

  for (const std::string &line : input) {
    if (line.substr(0, 4) == "mask") {
      mask = line.substr(7);
    } else {
      address = intToBinary(std::stoull(line.substr(4, line.find(']') - 4)));
      value = std::stoull(line.substr(line.find('=') + 2));
      size_t len = address.length();

      for (size_t i = 0; i < len; ++i) {
        if (mask[35 - i] == '1') { address[len - i - 1] = '1'; }
        else if (mask[35 - i] == 'X') { address[len - i - 1] = 'X'; }
      }

      std::vector<std::string> addresses = getAddressCombinations(address);
      for (std::string addr : addresses) {
        std::string pad(36 - addr.length(), '0');
        memory[pad + addr] = value;
      }
    }
  }
  size_t i = 0;
  std::string sum = "0";
  for (auto &it : memory) {
    std::string digits = std::to_string(it.second);
    if (i++ < 10) std::cout << sum << " + " << it.second << " = ";
    sum = addHugeNumbers(sum, digits);
    if (i++ < 10) std::cout << sum << "\n";
  }

  return sum;
}

int main() {
  std::vector<std::string> inputRows;

  std::ifstream input("input.txt", std::ios::in);
  if (input.is_open()) {
    std::string line;
    while(getline(input, line)) { inputRows.push_back(line); }
    input.close();
  }

  std::cout << "Part 1: " << part1(inputRows) << std::endl;
  std::cout << "Part 2: " << part2(inputRows) << std::endl;
  std::cout << "180770034726 is too low\n";
  return 0;
}
