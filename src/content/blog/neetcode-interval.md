---
title: "NEETCODE150 - Interval"
description: "区间相关题目"
pubDate: "Sep 5 2024"
---

# [Insert Interval](https://leetcode.com/problems/insert-interval/)

```c++
inline int& left(vector<int> &interval) { return interval[0]; }
inline int& right(vector<int> &interval) { return interval[1]; }

class Solution {
public:
  vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
    vector<vector<int>> res;
    res.push_back(newInterval);
    for (auto &interval : intervals) {
      vector<int> &last_interval = res.back();
      if (right(last_interval) < left(interval)) {
        res.push_back(interval);
      } else if (right(interval) < left(last_interval)) {
        swap(interval, last_interval);
        res.push_back(interval);
      } else {
        left(last_interval) = min(left(last_interval), left(interval));
        right(last_interval) = max(right(last_interval), right(interval));
      }
    }
    return res;
  }
};
```

# [Merge Intervals](https://leetcode.com/problems/merge-intervals)
```c++
inline int &left(vector<int> &interval) { return interval[0]; }
inline int &right(vector<int> &interval) { return interval[1]; }

class Solution {
public:
  vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](vector<int> &a, vector<int> &b) { return left(a) < left(b); });
    vector<vector<int>> res;
    for (auto &interval : intervals) {
      if (res.empty() || right(res.back()) < left(interval)) {
        res.push_back(interval);
      } else if (right(interval) < left(res.back())) {
        swap(res.back(), interval);
        res.push_back(interval);
      } else {
        res.back() = {
          min(left(interval), left(res.back())),
          max(right(interval), right(res.back()))
        };
      }
    }
    return res;
  }
};
```

# [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals)

```c++
inline int &left(vector<int> &interval) { return interval[0]; }
inline int &right(vector<int> &interval) { return interval[1]; }

class Solution {
public:
  int eraseOverlapIntervals(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end(), [](vector<int> &a, vector<int> &b) { return left(a) < left(b); });
    int n = 0;
    vector<int> &prev = intervals[0];
    for (int i = 1; i < intervals.size(); ++i) {
      if (left(intervals[i]) < right(prev)) {
        ++n;
        if (right(intervals[i]) < right(prev)) prev = intervals[i];
      } else {
        prev = intervals[i];
      }
    }
    return n;
  }
};
```

```racket
(define (left interval) (car interval))
(define (right interval) (cadr interval))

(define (merge-intervals l r)
  (list (min (left l) (left r))
        (max (right l) (right r))))

(define/contract (merge intervals)
  (-> (listof (listof exact-integer?)) (listof (listof exact-integer?)))
  (define (acc cur s)
    (if (or (empty? s) (< (right (car s)) (left cur)))
        (cons cur s)
        (cons (merge-intervals (car s) cur) (cdr s))))
  (reverse (foldr acc '() (sort intervals > #:key car))))
```