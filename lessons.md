It is easy to miss one word in the problem definition and get stuck, e.g. 'most' in 2024/day_14

If the problem asks about "a picture of a Christmas tree" you may have to put your eyes on it to know if it is a Christmas tree,
but any image has to have some contiguous pixels, so you can rule those out

The problem might be simpler than you think. The specific data may allow simplification. There might be a solution method you are not thinking of yet.

You don't have to generate all the instances at the same time in order to count them.

When too slow, try memoize ... even if you think there are two many arg combos ... maybe there are not.

Draw more pictures.

Test the most application of the algorithm you can think of ... then work up. Don't assume your code is working for simple cases.

You can use a bit mask as 32 or smaller member set

Reduce the problem to just the decision points and use DFS on them

Floyd–Warshall algorithm for all point pairs shortest distance. O(v**3)

Can parse by splitting into parts and using fixed offsets

If your code makes assumptions about data content, e.g. range values, of input data ... make sure you verify those assumption ... otherwise your code might work for test data but fail for actual data.

To solve an equation paste the following into live.sympy.org
solve(x*x-4)   # x,y,z floats; k,m,n integers

If a search problem has <100000 possible states, bfs may work better than dfs --- because it may be easier to avoid duplicate paths

use MiniZinc for constraint problems

if you have the right data structure / base class ... a medium problem should execute the first time

problems that involve adding/removing things from a ring can use a double linked list data structure
with a map to find each node ... see 2020 day 22. If you use a linear array things get slow if you have 
a large number of items in your ring.

If you need to calculate sums of many slices of an array first calc prefixSums for the array (2019 day 16)