---
title: 图形学变换
date: 2023/7/16
math: true
---

# 变换（Transformation）

## 缩放变换

缩放倍数s

$$
x'=sx
$$

$$
y'=sy
$$

$$
\begin{bmatrix}
x \\
y
\end{bmatrix}

=

\begin{bmatrix}
s_x & 0 \\
0 & s_y \\
\end{bmatrix}

\begin{bmatrix}
x \\
y
\end{bmatrix}
$$

## 对称变换（Reflection）

$$
x' = -x
$$

$$
y' = y
$$

$$
\begin{bmatrix}
x' \\
y'
\end{bmatrix}

=

\begin{bmatrix}
-1 & 0 \\
0 & 1
\end{bmatrix}

\begin{bmatrix}
x \\
y
\end{bmatrix}
$$

## 切变 （Shear）

纵坐标不变，横坐标发生变化

$$
\begin{bmatrix}
x' \\
y'
\end{bmatrix}
=
\begin{bmatrix}
1 & a \\
0 & 1
\end{bmatrix}

\begin{bmatrix}
x \\
y
\end{bmatrix}
$$

## 旋转（Rotate）

规定绕 $(0,0)$ 点逆时针旋转

$$
R_\theta =
\begin{bmatrix}
cos\theta & -sin\theta \\
sin\theta & cos\theta
\end{bmatrix}
$$
