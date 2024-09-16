---
title: "Acwing - 排序"
description: "快速排序/归并排序"
pubDate: "Sep 6 2024"
---

# 快速排序

[Sort an Array](https://leetcode.com/problems/sort-an-array/)

```cpp
class Solution {
  std::random_device seed;
  std::mt19937 gen{seed()};

  void quick_sort(vector<int>& q, int l, int r) {
    if (l >= r) return;
    std::uniform_int_distribution<int> dist{l, r - 1};
    int x = q[dist(gen)], i = l - 1, j = r + 1;
    while (i < j) {
      do ++i; while (q[i] < x);
      do --j; while (q[j] > x);
      if (i < j) swap(q[i], q[j]);
    }
    quick_sort(q, l, j);
    quick_sort(q, j + 1, r);
  }

public:
  vector<int> sortArray(vector<int>& nums) {
    quick_sort(nums, 0, nums.size() - 1);
    return nums;
  }
};
```

# 归并排序

[Sort an Array](https://leetcode.com/problems/sort-an-array/)

```cpp
class Solution {
  void merge_sort(vector<int>& q, int l, int r, vector<int> &tmp) {
    if (l >= r) return;
    int mid = (l + r) / 2;
    merge_sort(q, l, mid, tmp), merge_sort(q, mid + 1, r, tmp);

    int k = 0, i = l, j = mid + 1;
    while (i <= mid && j <= r)
      if (q[i] <= q[j]) tmp[k++] = q[i++];
      else tmp[k++] = q[j++];

    while (i <= mid) tmp[k++] = q[i++];
    while (j <= r) tmp[k++] = q[j++];

    for (int i = l, j = 0; i <= r; ++i, ++j) q[i] = tmp[j];
  }

public:
  vector<int> sortArray(vector<int>& nums) {
    vector<int> tmp(nums.size());
    merge_sort(nums, 0, nums.size() - 1, tmp);
    return nums;
  }
};
```