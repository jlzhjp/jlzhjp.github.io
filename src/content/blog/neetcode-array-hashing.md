---
title: "NEETCODE150 - Array & Hashing"
description: "数组/哈希表相关题目"
pubDate: "Sep 6 2024"
---

# [Contains Duplicates](https://leetcode.com/problems/contains-duplicate/)

```cpp
class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
      unordered_map<int, bool> dict;
      for (int n : nums) {
        if (dict.find(n) != dict.end()) return true;
        dict[n] = true;
      }
      return false;
    }
};
```

# [Valid Anagram](https://leetcode.com/problems/valid-anagram/)

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

## Bucket Sort

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

## Heap

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

```cpp
class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        vector<int> prefix(nums.size());
        prefix[0] = nums[0];
        for (int i = 1; i < nums.size(); ++i) prefix[i] = prefix[i - 1] * nums[i];

        vector<int> postfix(nums.size());
        postfix.back() = nums.back();
        for (int i = nums.size() - 2; i >= 0; --i) postfix[i] = postfix[i + 1] * nums[i];

        auto prod_before = [&prefix](int i) {
            if (i == 0) return 1;
            return prefix[i - 1];
        };

        auto prod_after = [&postfix, &nums](int i) {
            if (i == nums.size() - 1) return 1;
            return postfix[i + 1];
        };

        vector<int> result(nums.size());
        for (int i = 0; i < result.size(); ++i) result[i] = prod_before(i) * prod_after(i);
        return result;
    }
};
```

# [Valid Sudoku](https://leetcode.com/problems/valid-sudoku/)

```cpp
```

# [Longest Consecutive Sequence]()
