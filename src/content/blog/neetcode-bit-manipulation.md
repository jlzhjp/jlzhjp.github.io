---
title: "NEETCODE150 - Bit Manipulation"
description: "位操作相关题目"
pubDate: "Sep 5 2024"
---

# [Single Number](https://leetcode.com/problems/single-number)

异或运算满足以下性质：

```
a xor b = b xor a
(a xor b) xor c = a xor (b xor c)
x xor x = 0
0 xor x = x
```

将所有数字进行异或运算，最终得到的就是只出现一次的数字

## C++
```cpp
class Solution {
public:
  int singleNumber(vector<int>& nums) {
  return accumulate(
    nums.begin(),
    nums.end(),
    0,
    [](int acc, int x) { return acc ^ x; });
  }
};
```

# [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits)

## C++

```cpp
class Solution {
  int count(unsigned int n) {
    if (n == 0) return 0;
    if ((n & 0x1) == 0) return count(n >> 1);
    return count(n >> 1) + 1;
  }
public:
  int hammingWeight(int n) {
    return count(static_cast<unsigned int>(n));
  }
};
```

```cpp
class Solution {
public:
  int hammingWeight(int n) {
    int nums = 0;
    for (uint32_t mask = 0x1; mask != 0x8000'0000; mask <<= 1) {
      if ((n & mask) != 0) ++nums;
    }
    return nums;
  }
};
```

# [Counting Bits](https://leetcode.com/problems/counting-bits)
```
0 => 0000
1 => 0001
2 => 0010
3 => 0011
4 => 0100
5 => 0101
6 => 0110
7 => 0111
8 => 1000
...
```

当前数字中 1 的数量 = 当前数字右移一位后 1 的数量 + 被移出去的数字

## C++

```cpp
class Solution {
public:
  vector<int> countBits(int n) {
    vector<int> dp(n + 1);
    for (int i = 1; i <= n; ++i) {
      dp[i] = dp[i >> 1] + (i & 1);
    }
    return dp;
  }
};
```

# [Reverse Bits](https://leetcode.com/problems/reverse-bits)

## C++

```cpp
class Solution {
public:
  uint32_t reverseBits(uint32_t n) {
    uint32_t res = 0;
    for (int i = 0; i < 31; ++i) {
      res |= n & 1;
      n = n >> 1;
      res = res << 1;
    }
    res |= n & 1;
    return res;
  }
};
```

# [Missing Number](https://leetcode.com/problems/missing-number)

如果把 `[0, n]` 与 `nums` 两个数组合并的话，这个问题就等同于 [Single Number](#single-number) 了

## C++
```cpp
class Solution {
public:
  int missingNumber(vector<int>& nums) {
    int x = 0;
    int n = nums.size();
    for (int i = 0; i <= n; ++i) x ^= i;
    for (int n : nums) x ^= n;
    return x;
  }
};

```

# [Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/)

## 模拟全加器运算
全加器的逻辑表达式

```
s_i = a_i xor b_i xor c_i-1
c_i = (a_i and b_i) or (c_i-1 and (x_i xor b_i))
```

```cpp
class Solution {
public:
  int getSum(int a, int b) {
    uint32_t ur = 0;
    uint32_t c = 0;
    uint32_t ua = static_cast<uint32_t>(a);
    uint32_t ub = static_cast<uint32_t>(b);

    for (int i = 0; i < 32; ++i) {
      int ai = (ua >> i) & 1, bi = (ub >> i) & 1;
      int si = ai ^ bi ^ c;
      c = (ai & bi) | (c & (ai ^ bi));
      ur |= si << i;
    }

    return static_cast<int>(ur);
  }
};
```

需要注意的是 C++ 在将负数向 无符号数转换时，不会做额外的处理，会直接将补码表示复制到新的变量中。

## 对整体计算进位

两数相加时每位的结果为 `a ^ b`，每位所产生的进位为 `a & b`（需要左移一位得到正确的位置）

这样就得到了两个新的加数 `a ^ b` 和 `a & b << 1`，重复这个过程，直到进位全部为 0 为止。

```cpp
class Solution {
public:
  int getSum(int a, int b) {
    if (b == 0) return a;
    return getSum(a ^ b, (a & b) << 1);
  }
};
```

# [Reverse Integer](https://leetcode.com/problems/reverse-integer)

在将新的数位加到结果上时，先判断操作后是否会发生溢出。

## C++

```cpp
class Solution {
private:
  const int MAX = numeric_limits<int>::max();
  const int MIN = numeric_limits<int>::min();

  int rev(int x, int r) {
    if (x == 0) return r;
    int d = x % 10;
    if (r > MAX / 10 || (r == MAX / 10 && d > MAX % 10)) return 0;
    if (r < MIN / 10 || (r == MIN / 10 && d < MIN % 10)) return 0;
    return rev(x / 10,  r * 10 + d);
  }
public:
  int reverse(int x) {
    return rev(x, 0);
  }
};
```