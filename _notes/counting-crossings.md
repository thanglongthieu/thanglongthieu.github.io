---
title: "Ten sticks, forty-five crossings"
date: 2026-10-02 10:00:00 +0000
track: math
kind: Explainer
summary: "Why n straight sticks can cross at most n(n − 1) / 2 times, when that bound is reached, and what the 3D demo is really showing."
experiments: [stick-intersections]
---

The [Stick Intersections]({{ '/games/stick-intersections/' | relative_url }}) demo asks a competition-style question:
ten straight sticks lie on a table, none parallel and no three through the same point. How many crossings are there?
The answer is 45, and the demo draws every one of them.

## The argument

Two straight sticks can cross **at most once**. Two straight lines that are not parallel meet in exactly one point,
and a stick is just a piece of a line. So every crossing belongs to a pair of sticks, and every pair contributes at most
one crossing.

The number of pairs among *n* sticks is

> C(n, 2) = n (n − 1) / 2

so ten sticks give at most 10 × 9 / 2 = **45** crossings.

## When the bound is reached

The maximum needs two conditions — exactly the two the puzzle states:

- **No two sticks parallel**, so every pair of lines actually meets.
- **No three sticks through one point**, so no two pairs share a crossing and get counted as one.

Long enough sticks then contain every crossing of their lines. The demo builds its ten sticks with distinct angles and
offsets for exactly this reason, then loops over every pair `(i, j)` with `i < j` and drops a marker where they meet.
That loop *is* the proof: it visits C(10, 2) pairs, one marker each.

## Another way to see it

Add the sticks one at a time. The *k*-th stick can cross each of the *k* − 1 sticks already down, so the total is
0 + 1 + 2 + … + 9 = 45 — the same handshake sum as counting pairs.

| Sticks *n* | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Max crossings | 1 | 3 | 6 | 10 | 15 | 21 | 28 | 36 | 45 |

## Open questions

- Does the all-at-once picture (every pair marked) or the one-at-a-time picture (a running sum) make the formula feel
  more inevitable? A version of the demo that adds sticks step by step would let us compare.
- A natural first guess is 10 × 9 = 90 — each stick crosses nine others — which counts every crossing twice. Which
  picture fixes that double-count fastest?
