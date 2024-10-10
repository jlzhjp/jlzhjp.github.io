---
title: "NEETCODE150 - Array & Hashing"
description: "数组/哈希表相关题目"
pubDate: "Sep 6 2024"
---

# [Contains Duplicates](https://leetcode.com/problems/contains-duplicate/)

## C++

```cpp
class Solution {
public:
  bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> set;
    for (int n : nums) {
      if (set.find(n) != set.end()) return true;
      set.insert(n);
    }
    return false;
  }
};
```

# [Valid Anagram](https://leetcode.com/problems/valid-anagram/)

## C++

```cpp
class Solution {
public:
  bool isAnagram(string s, string t) {
    unordered_map<char, int> word_count;

    for (auto ch : s) {
      auto it = word_count.find(ch);
      if (it == word_count.end()) word_count[ch] = 1;
      else ++it->second;
    }

    for (auto ch : t) {
      auto it = word_count.find(ch);
      if (it == word_count.end()) return false;
      --it->second;
      if (it->second == 0) word_count.erase(it);
    }

    return word_count.empty();
  }
};
```

# [Two Sum](https://leetcode.com/problems/two-sum)

## C++

```cpp
class Solution {
public:
  vector<int> twoSum(vector<int>& nums, int target) {
    std::unordered_map<int, int> dict;

    for (int i = 0; i < nums.size(); ++i) dict[target - nums[i]] = i;

    for (int i = 0; i < nums.size(); ++i) {
      auto pair = dict.find(nums[i]);
      if (pair != dict.end() && pair->second != i) return {i, pair->second};
    }

    return {};
  }
};
```

# [Group Anagram](https://leetcode.com/problems/group-anagrams/)

## C++

```cpp
class Solution {
public:
  vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> dict;
    for (const string &str : strs) dict[sorted(str)].push_back(str);
    vector<vector<string>> res;
    for (auto &kv : dict) res.push_back(std::move(kv.second));
    return res;
  }

  string sorted(const string &str) {
    int count[26] = {};
    for (char ch : str) ++count[ch - 'a'];
    string res(str.size(), '\0');
    auto it = res.begin();
    for (int i = 0; i < 26; ++i) {
      for (int j = 0; j < count[i]; ++j) {
        *(it++) = 'a' + i;
      }
    }
    return res;
  }
};
```

# [Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

## Bucket Sort (C++)

C++ 的 `unordered_map` 中，如果元素不存在，使用 `[]` 运算符时会自动创建一个新的元素

```cpp
class Solution {
public:
  vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> count;
    for (auto n : nums) ++count[n];
    vector<vector<int>> buckets(nums.size() + 1);
    for (auto [n, c] : count) buckets[c].push_back(n);

    vector<int> res;
    for (int freq = nums.size(); freq > 0; --freq) {
      for (int n : buckets[freq]) {
        if (k == 0) return res;
        res.push_back(n);
        --k;
      }
    }
    return res;
  }
};
```

## Heap (C++)

```cpp
class Solution {
public:
  vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> count;

    for (auto n : nums) ++count[n];

    priority_queue<pair<int, int>, vector<pair<int, int>>, std::less<pair<int, int>>> heap;
    for (auto p : count) heap.push({p.second, p.first});

    vector<int> result(k);
    auto iter = result.begin();
    for (int i = 0; i < k; ++i) {
      *(iter++) = heap.top().second;
      heap.pop();
    }

    return result;
  }
};
```

# [String Encode and Decode](https://neetcode.io/problems/string-encode-and-decode)

## C++

```cpp
class Solution {
  string pad_number(int num, int n) {
    string str = to_string(num);
    string result = "";
    for (int i = 0; i < n - str.size(); ++i) result.push_back('0');
    result.append(to_string(num));
    return result;
  }

  template <typename InputIt>
  int read_three(InputIt &iter) {
    int result = 0;
    result += (*(iter++) - '0') * 100;
    result += (*(iter++) - '0') * 10;
    result += *(iter++) - '0';
    return result;
  }
public:
  string encode(vector<string>& strs) {
    string result = "";

    result.append(pad_number(strs.size(), 3));

    for (const auto &str: strs) {
      result.append(pad_number(str.size(), 3));
      result.append(str);
    }

    return result;
  }

  vector<string> decode(string s) {
    vector<string> result;
    auto it = s.begin();
    int str_count = read_three(it);

    for (int i = 0; i < str_count; ++i) {
      int str_size = read_three(it);
      result.push_back(string(it, it + str_size));
      it += str_size;
    }

    return result;
  }
};
```

# [Product of Array Except Self](https://leetcode.com/problems/product-of-array-except-self/)

由于数组中的元素可能存在 0，所以需要不能用整个数组的积除以当前位置的元素

## C++

```cpp
class Solution {
public:
  vector<int> productExceptSelf(vector<int>& nums) {
    vector<int> prod_before(nums.size());
    prod_before[0] = 1;
    for (int i = 1; i < nums.size(); ++i) {
      prod_before[i] = prod_before[i - 1] * nums[i - 1];
    }

    vector<int> prod_after(nums.size());
    prod_after[nums.size() - 1] = 1;
    for (int i = nums.size() - 2; i >= 0; --i) {
      prod_after[i] = prod_after[i + 1] * nums[i + 1];
    }

    vector<int> res(nums.size());
    for (int i = 0; i < nums.size(); ++i) {
      res[i] = prod_before[i] * prod_after[i];
    }

    return res;
  }
};
```

# [Valid Sudoku](https://leetcode.com/problems/valid-sudoku/)

## C++

```cpp
class Solution {
  int n_boxes(int i, int j) {
    return (i / 3) * 3 + (j / 3);
  }
public:
  bool isValidSudoku(vector<vector<char>>& board) {
    vector<unordered_set<char>> rows(9);
    vector<unordered_set<char>> cols(9);
    vector<unordered_set<char>> boxes(9);

    for (int i = 0; i < 9; ++i) {
      for (int j = 0; j < 9; ++j) {
        if (board[i][j] == '.') continue;
        if (rows[i].find(board[i][j]) != rows[i].end()) return false;
        rows[i].insert(board[i][j]);
        if (cols[j].find(board[i][j]) != cols[j].end()) return false;
        cols[j].insert(board[i][j]);
        auto &box = boxes[n_boxes(i, j)];
        if (box.find(board[i][j]) != box.end()) return false;
        box.insert(board[i][j]);
      }
    }

    return true;
  }
};
```

# [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/)

## 排序 (C++)

```c++
class Solution {
  struct SearchResult { int next, len; };
  SearchResult search(vector<int> &nums, int j, int len) {
    if (j >= nums.size() - 1) return {j + 1, len};
    if (nums[j] + 1 == nums[j + 1]) return search(nums, j + 1, len + 1);
    if (nums[j] == nums[j + 1]) return search(nums, j + 1, len);
    return {j + 1, len};
  }
public:
  int longestConsecutive(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    int max_len = 0, i = 0;
    while (i != nums.size()) {
      auto res = search(nums, i, 1);
      max_len = max(max_len, res.len);
      i = res.next;
    }
    return max_len;
  }
};
```

## Hash Map (C++)

```cpp
class Solution {
public:
  int longestConsecutive(vector<int>& nums) {
    unordered_set<int> set;
    int max_len = 0;
    for (int n : nums) set.insert(n);
    for (int n : nums) {
      if (set.find(n - 1) == set.end()) { // is the start of a seq
        int len = 0;
        while (set.find(n++) != set.end()) ++len;
        max_len = max(max_len, len);
      }
    }
    return max_len;
  }
};
```