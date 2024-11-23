---
title: "NEETCODE150 - Two Pointers"
description: "数组/哈希表相关题目"
pubDate: "Sep 6 2024"
---

# [Valid Palindrome](https://leetcode.com/problems/valid-palindrome)

## C++ (Tail Recursion)
```cpp
class Solution {
  bool is_palindrome(const string &s, int i, int j) {
    if (i >= j) return true;
    if (!isalnum(s[i])) return is_palindrome(s, i + 1, j);
    if (!isalnum(s[j])) return is_palindrome(s, i, j - 1);
    if (tolower(s[i]) != tolower(s[j])) return false;
    return is_palindrome(s, i + 1, j - 1);
  }
public:
  bool isPalindrome(const string &s) {
    return is_palindrome(s, 0, s.size() - 1);
  }
};
```

# [Two Sum II - Input Array Is Sorted](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted)

## C++ (Binary Search)
```cpp
class Solution {
  int bs(vector<int> &nums, int l, int r, int k) {
    int m = (l + r) / 2;
    if (l > r) return -1;
    if (k < nums[m]) return bs(nums, l, m - 1, k);
    if (k > nums[m]) return bs(nums, m + 1, r, k);
    return m;
  }
public:
  vector<int> twoSum(vector<int>& numbers, int target) {
    for (int i = 0; i < numbers.size() - 1; ++i) {
      int t = bs(numbers, i + 1, numbers.size() - 1, target - numbers[i]);
      if (t >= 0) return vector<int>{ i + 1, t + 1 };
    }
    return vector<int>{};
  }
};
```

## C++ (Two Pointers, Recursion)

```cpp
class Solution {
  vector<int> search(vector<int> &nums, int i, int j, int t) {
    if (i == j) return {0, 0};
    int s = nums[i] + nums[j];
    if (s < t) return search(nums, i + 1, j, t);
    if (s > t) return search(nums, i, j - 1, t);
    return {i + 1, j + 1};
  }
public:
  vector<int> twoSum(vector<int>& numbers, int target) {
    return search(numbers, 0, numbers.size() - 1, target);
  }
};
```

# [3Sum](https://leetcode.com/problems/3sum)

## C++

```cpp
TODO
```

# [Container With Most Water](https://leetcode.com/problems/container-with-most-water/)

## C++ (Tail Recursion)

```cpp
class Solution {
  void search(vector<int> &height, int i, int j, int &max_area) {
    if (i >= j) return;
    int area = min(height[i], height[j]) * (j - i);
    max_area = max(max_area, area);
    if (height[i] < height[j]) return search(height, i + 1, j, max_area);
    if (height[i] > height[j]) return search(height, i, j - 1, max_area);
    return search(height, i + 1, j - 1, max_area);
  }
public:
  int maxArea(vector<int>& height) {
    int max_area = 0;
    search(height, 0, height.size() - 1, max_area);
    return max_area;
  }
};
```

# [Trapping Rain Water](https://leetcode.com/problems/trapping-rain-water/)

## C++
```cpp
class Solution {
public:
  int trap(vector<int>& height) {
    if (height.size() == 1) return 0;
    int n = static_cast<int>(height.size());

    vector<int> max_left(n);
    vector<int> max_right(n);
    vector<int> trapping_water(n);

    for (int i = 1; i < n; ++i) {
      max_left[i] = max(max_left[i - 1], height[i - 1]);
    }
    for (int i = n - 2; i >= 0; --i) {
      max_right[i] = max(max_right[i + 1], height[i + 1]);
    }
    for (int i = 0; i < n; ++i) {
      trapping_water[i] = max(0, min(max_left[i], max_right[i]) - height[i]);
    }
    return accumulate(trapping_water.begin(), trapping_water.end(), 0);
  }
};
```