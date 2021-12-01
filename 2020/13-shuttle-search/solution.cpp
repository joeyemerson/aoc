#include "../aoc.h"

std::vector<std::string> splitString(std::string &str, const std::string &delimiter) {
  std::vector<std::string> tokens;
  std::string token;
  size_t pos = 0;

  while ((pos = str.find(delimiter)) != std::string::npos) {
    token = str.substr(0, pos);
    tokens.emplace_back(token);
    str.erase(0, pos + 1);
  }

  tokens.emplace_back(str);
  return tokens;
}

int64_t part1(const int64_t &timestamp, const std::vector<int64_t> &buses) {
  int64_t minDistance = INT64_MAX;
  int64_t closestBus = 0;

  for (int i = 0; i < buses.size(); ++i) {
    int64_t id = buses[i];
    if (id > 0) {
      int64_t distance = id - timestamp % id;
      if (distance < minDistance) {
        minDistance = distance;
        closestBus = id;
      }
    }
  }

  return closestBus * minDistance;
}

// Modulo Inverse taken from:
// https://www.geeksforgeeks.org/multiplicative-inverse-under-modulo-m/
int64_t modInverse(const int64_t a, const int64_t m) {
    int64_t m0 = m;
    int64_t a0 = a;
    int64_t y = 0;
    int64_t x = 1;

    if (m == 1) { return 0; }

    while (a0 > 1) {
        // q is quotient
        int64_t q = a0 / m0;
        int64_t t = m0;

        // m is remainder now, process same as Euclid's algo
        m0 = a0 % m0;
        a0 = t;
        t = y;

        // Update y and x
        y = x - q * y;
        x = t;
    }

    // Make x positive
    if (x < 0) { x += m; }

    return x;
}

// Chinese remainder theorem - CRT
// https://en.wikipedia.org/wiki/Chinese_remainder_theorem
int64_t part2(const std::vector<int64_t> &buses) {
  int64_t MOD = std::accumulate(
    buses.begin(),
    buses.end(),
    1LL,
    [](int64_t acc, int64_t cur) { return cur ? acc * cur : acc; }
  );

  int64_t timestamp = 0;

  for (size_t i = 0; i < buses.size(); ++i) {
    int64_t m = buses[i];

    if (m) {
      int64_t a = (m - i % m) % m;
      int64_t b = MOD / m;
      int64_t b0 = modInverse(b, m);
      timestamp += a * b * b0;
    }
  }

  return timestamp % MOD;
}

int main() {
  std::ifstream input("input.txt", std::ios::in);
  std::string idString;
  int64_t timestamp;

  if (input.is_open()) {
    std::string line;
    getline(input, line);
    timestamp = std::stoi(line); // get current timestamp
    getline(input, idString); // get string of bus ids
    input.close();
  }

  std::vector<std::string> idStrings = splitString(idString, ",");

  //construct buses vector from input id strings
  std::vector<int64_t> buses;
  buses.reserve(idString.size());
  for (std::string idString : idStrings) {
    if (idString == "x") buses.push_back(0); // we'll ignore id values of 0 in all calculations
    else buses.emplace_back(std::stoull(idString));
  }

  std::cout << "Part 1: " << part1(timestamp, buses) << std::endl;
  std::cout << "Part 2: " << part2(buses) << std::endl;

  return 0;
}
