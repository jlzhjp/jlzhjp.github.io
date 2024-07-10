---
title: "简单的二分查找实现"
description: "避免在编写二分查找代码的时候受到整数除法的困扰"
pubDate: "Jul 10 2024"
---

# 简介

编写二分查找的代码总是一件痛苦的事情，必须小心地处理边界条件与终止判断才能保证程序不会在特殊情况下出现死循环。最近看 SICP 的时候受到了很大的启发，想到一种比较直观（没有各种 Hack）的写法。

首先，当 $l = h$ 时，作为退出条件。

$$
Search(arr, t, l, h) =
\begin{cases}
    l & ,\ arr[l] = t \\
    -1 & ,\ arr[l] \ne t
\end{cases}
$$

当 $l + h$ 为奇数时，$[l, h]$ 这一下标区间内包含的数组元素有偶数个，数组没有中间元素。这时，我们可以将搜索区间减少一个，来使下一次搜索可以获得中间元素。

$$
Search(arr, t, l, h) =
\begin{cases}
    Search(arr, t, l + 1, h) &,\ t > arr[l] \\
    -1 &,\ t < arr[l] \\
    l &,\ t = arr[l]
\end{cases}
$$

当 $l + h$ 为偶数时，$[l, h]$ 这一下标区间内包含的数组元素有奇数个，数组有中间元素。这时，比较中间元素与目标元素的大小确定下一个搜索区间。

$$
Search(arr, t, l, h) =
\begin{cases}
    Search(arr, t, \frac{l + h}{2}, h) & ,\ t > arr[\frac{l + h}{2}] \\
    Search(arr, t, l, \frac{l + h}{2}) & ,\ t < arr[\frac{l + h}{2}] \\
    \frac{l + h}{2} & ,\ t = arr[\frac{l + h}{2}]
\end{cases}
$$

由于二分查找本来就是一种复杂度为 $log_2N$ 的算法，在搜索区间没有中间元素时进行一下小小的修正并不会对整体的运行时间造成很大影响。

# C++ 实现

以[LeetCode 704. Binary Search](https://leetcode.com/problems/binary-search/)为例，C++代码如下：

```cpp
class Solution {
    int search_impl(vector<int> &nums, int target, int l, int h) {
        if (l == h) {
            if (target == nums[l]) return l;
            return -1;
        }

        if ((l + h) % 2 != 0) {
            if (target > nums[l]) return search_impl(nums, target, l + 1, h);
            if (target < nums[l]) return -1;
            return l;
        }

        int m = (l + h) / 2;
        if (target < nums[m]) return search_impl(nums, target, l, m - 1);
        if (target > nums[m]) return search_impl(nums, target, m + 1, h);
        return m;
    }

public:
    int search(vector<int>& nums, int target) {
        return search_impl(nums, target, 0, nums.size() - 1);
    }
};
```

# Racket 的实现

可能使用函数式语言会更清楚一些？

```racket
(define (search* nums target l h)
  (cond [(= l h)
         (cond [(= (list-ref nums l) target) l]
               [else -1])]
        [(not (= (remainder (+ l h) 2) 0))
         (let ([lv (list-ref nums l)])
           (cond [(> target lv) (search* nums target (add1 l) h)]
                 [(< target lv) -1]
                 [(= target lv) l]))]
        [else
         (let* ([m (/ (+ l h) 2)]
                [mv (list-ref nums m)])
           (cond [(> target mv) (search* nums target (add1 m) h)]
                 [(< target mv) (search* nums target l (sub1 m))]
                 [(= target mv) m]))]))

(define/contract (search nums target)
  (-> (listof exact-integer?) exact-integer? exact-integer?)
  (search* nums target 0 (sub1 (length nums))))
```
