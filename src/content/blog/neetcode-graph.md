---
title: "NEETCODE150 - Graph"
description: "图相关题目"
pubDate: "Sep 5 2024"
---

# [Number of Islands](https://leetcode.com/problems/number-of-islands/)

```cpp
class Solution {
  bool dfs(const vector<vector<char>> &grid, vector<vector<bool>> &visited, int i, int j) {
    if (i < 0 || i >= grid.size() || j < 0 || j >= grid[0].size()) return false;
    if (visited[i][j] || grid[i][j] == '0') return false;
    visited[i][j] = true;
    dfs(grid, visited, i + 1, j);
    dfs(grid, visited, i - 1, j);
    dfs(grid, visited, i, j - 1);
    dfs(grid, visited, i, j + 1);
    return true;
  }
public:
  int numIslands(vector<vector<char>>& grid) {
    vector<vector<bool>> visited(grid.size(), vector<bool>(grid[0].size(), false));
    int count = 0;
    for (int i = 0; i < grid.size(); ++i) {
      for (int j = 0; j < grid[0].size(); ++j) {
        if (dfs(grid, visited, i, j)) ++count;
      }
    }
    return count;
  }
};
```

# [Max Area of Island](https://leetcode.com/problems/max-area-of-island/)

```cpp
class Solution {
  int dfs(const vector<vector<int>> &grid, vector<vector<char>> &visited, int i, int j) {
    if (i < 0 || i >= grid.size() || j < 0 || j >= grid[0].size()) return 0;
    if (visited[i][j] || grid[i][j] == 0) return 0;
    visited[i][j] = true;
    int area = 1 +
               dfs(grid, visited, i + 1, j) +
               dfs(grid, visited, i - 1, j) +
               dfs(grid, visited, i, j - 1) +
               dfs(grid, visited, i, j + 1);
    return area;
  }
public:
  int maxAreaOfIsland(vector<vector<int>>& grid) {
    vector<vector<char>> visited(grid.size(), vector<char>(grid[0].size(), false));
    int max_area = 0;
    for (int i = 0; i < grid.size(); ++i) {
      for (int j = 0; j < grid[0].size(); ++j) {
        max_area = max(max_area, dfs(grid, visited, i, j));
      }
    }
    return max_area;
  }
};
```

# [Clone Graph](https://leetcode.com/problems/clone-graph/)

```cpp
/*
// Definition for a Node.
class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() {
        val = 0;
        neighbors = vector<Node*>();
    }
    Node(int _val) {
        val = _val;
        neighbors = vector<Node*>();
    }
    Node(int _val, vector<Node*> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
};
*/

class Solution {
  void dfs(Node *original, unordered_map<Node *, Node *> &clone) {
    Node *cloned_node = new Node(original->val);
    clone[original] = cloned_node;
    for (Node *n : original->neighbors) {
      if (clone.find(n) == clone.end()) dfs(n, clone);
      cloned_node->neighbors.push_back(clone[n]);
    }
  }

public:
  Node* cloneGraph(Node* node) {
    if (!node) return nullptr;
    unordered_map<Node *, Node *> clone;
    dfs(node, clone);
    return clone[node];
  }
};
```

# [Islands and Treasure (Walls and Gates)](https://neetcode.io/problems/islands-and-treasure)
比较有意思的一点，先把所有的位置加到队列里，由于使用了 BFS ，只要该位置的距离被更新过了，那么这个距离一定比现在的距离更短，相应的后续节点也不用遍历了。

```cpp
const int INF = 2147483647;

class Solution {
  struct State { int i, j, d; };
public:
  void islandsAndTreasure(vector<vector<int>>& grid) {
    queue<State> pending;

    for (int i = 0; i < grid.size(); ++i) {
      for (int j = 0; j < grid[0].size(); ++j) {
        if (grid[i][j] == 0) pending.push({i, j, 0});
      }
    }

    while (!pending.empty()) {
      auto s = pending.front();
      pending.pop();

      if (s.i < 0 || s.j < 0 || s.i >= grid.size() || s.j >= grid[0].size()) continue;
      if (grid[s.i][s.j] != INF && grid[s.i][s.j] != 0) continue;
      if (grid[s.i][s.j] != 0) grid[s.i][s.j] = s.d;

      pending.push({s.i, s.j + 1, s.d + 1});
      pending.push({s.i, s.j - 1, s.d + 1});
      pending.push({s.i + 1, s.j, s.d + 1});
      pending.push({s.i - 1, s.j, s.d + 1});
    }
  }
};
```

# [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)

注意判断状态是否有效的时机。在将状态加入队列时判断？还是取出状态时判断

```cpp
class Solution {
public:
  struct State { int i, j; };
  int orangesRotting(vector<vector<int>>& grid) {
    int count = 0;
    queue<State> pending;
    for (int i = 0; i < grid.size(); ++i) {
      for (int j = 0; j < grid[0].size(); ++j) {
        if (grid[i][j] == 2) pending.push({i, j});
        if (grid[i][j] == 1) ++count;
      }
    }

    vector<pair<int, int>> didj = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    int time = 0;
    while (!pending.empty() && count > 0) {
      int current_size = pending.size();
      for (int i = 0; i < current_size; ++i) {
        auto s = pending.front();
        pending.pop();
        for (auto [di, dj] : didj) {
          int ni = s.i + di, nj = s.j + dj;
          if (ni < 0 || nj < 0 || ni >= grid.size() || nj >= grid[0].size()) continue;
          if (grid[ni][nj] == 1) {
            grid[ni][nj] = 2;
            --count;
            pending.push({ni, nj});
          }
        }
      }
      ++time;
    }
    return count == 0 ? time : -1;
  }
};
```

# [Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow)
反向思考有时更加高效

```cpp
class Solution {
public:
  vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    vector<vector<char>> pacific(heights.size(), vector<char>(heights[0].size(), false));
    vector<vector<char>> atlantic(heights.size(), vector<char>(heights[0].size(), false));
    vector<vector<int>> res;
    for (int i = 0; i < heights.size(); ++i)
      dfs(heights, pacific, i, 0), dfs(heights, atlantic, i, heights[0].size() - 1);
    for (int j = 0; j < heights[0].size(); ++j)
      dfs(heights, pacific, 0, j), dfs(heights, atlantic, heights.size() - 1, j);
    for (int i = 0; i < heights.size(); ++i)
      for (int j = 0; j < heights[0].size(); ++j)
        if (pacific[i][j] && atlantic[i][j]) res.push_back({i, j});
    return res;
  }

  void dfs(const vector<vector<int>> &grid, vector<vector<char>> &connect, int i, int j) {
    connect[i][j] = true;
    vector<pair<int, int>> didjs = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    for (auto [di, dj] : didjs) {
      int ni = i + di, nj = j + dj;
      if (ni >= 0 && nj >= 0 &&
          ni < grid.size() && nj < grid[0].size() &&
          !connect[ni][nj] &&
          grid[ni][nj] >= grid[i][j]) {
        connect[ni][nj] = true;
        dfs(grid, connect, ni, nj);
      }
    }
  }
};
```


## Wrong Answer
```cpp
class Solution {
public:
  vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    vector<vector<char>> pacific(heights.size(), vector<char>(heights[0].size(), false));
    for (int i = 0; i < heights.size(); ++i) pacific[i][0] = true;
    for (int j = 0; j < heights[0].size(); ++j) pacific[0][j] = true;
    for (int i = 1; i < heights.size(); ++i) {
      for (int j = 1; j < heights[0].size(); ++j) {
        pacific[i][j] = (heights[i - 1][j] <= heights[i][j] && pacific[i - 1][j]) ||
                        (heights[i][j - 1] <= heights[i][j] && pacific[i][j - 1]);
      }
    }

    vector<vector<char>> atlantic(heights.size(), vector<char>(heights[0].size(), false));
    for (int i = 0; i < heights.size(); ++i) atlantic[i][heights[0].size() - 1] = true;
    for (int j = 0; j < heights[0].size(); ++j) atlantic[heights.size() - 1][j] = true;
    for (int i = heights.size() - 2; i >= 0; --i) {
      for (int j = heights[0].size() - 2; j >= 0; --j) {
        atlantic[i][j] = (heights[i + 1][j] <= heights[i][j] && atlantic[i + 1][j]) ||
                         (heights[i][j + 1] <= heights[i][j] && atlantic[j][j + 1]);
      }
    }

    vector<vector<int>> res;
    for (int i = 0; i < heights.size(); ++i) {
      for (int j = 0; j < heights[0].size(); ++j) {
        if (pacific[i][j] && atlantic[i][j]) res.push_back({i, j});
      }
    }
    return res;
  }
};
```

```
1 2 3
8 9 4
7 5 6
```

# [Surrounded Regions](https://leetcode.com/problems/surrounded-regions)
反向思考 + 1
```cpp
class Solution {
public:
  void solve(vector<vector<char>>& board) {
    vector<vector<char>> safe(board.size(), vector<char>(board[0].size(), false));
    for (int i = 0; i < board.size(); ++i) dfs(board, i, (int)board[0].size() - 1, safe), dfs(board, i, 0, safe);
    for (int j = 0; j < board[0].size(); ++j) dfs(board, 0, j, safe), dfs(board, board.size() - 1, j, safe);
    for (int i = 0; i < board.size(); ++i)
      for (int j = 0; j < board[0].size(); ++j)
        if (!safe[i][j]) board[i][j] = 'X';
    }

    void dfs(const vector<vector<char>>& board, int i, int j, vector<vector<char>>& safe) {
      if (i < 0 || j < 0 || i >= board.size() || j >= board[0].size() || board[i][j] == 'X' || safe[i][j]) return;
      safe[i][j] = true;
      vector<pair<int, int>> didjs = { {1, 0}, {-1, 0}, {0, 1}, {0, -1} };
      for (auto [di, dj] : didjs) dfs(board, i + di, j + dj, safe);
    }
};
```