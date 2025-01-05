# aoc
Practice for AOC.

My main goals
- clarity of expression
- correctness thru simplicity

Things I am learning
- Always view your transformed/parsed input data before running (you might have not got it transformed correctly)
- Simplify input data when possible.
- It is easy to miss one word in the problem definition and get stuck, e.g. 'most' in 2024/day14. Better read it twice.
- Sometimes you need to put your eyes directly on the data. Instead of theorizing about what it means for an image to "look like a Christmas tree" look at some images and think "What would make this image look (more) like a Christmas tree"?
- The problem might be simpler than you think.
- You don't have to generate all the solution instances at the same time in order to count them.
- Try memoize ... even if you think there are too many arg combos ... maybe there are fewer than you think.
- Twists in second part
    - Determine effect of small changes to data
    - Determine effect of much more or larger data
    - Tighten/loosen allowed path rules
    - Determine all the solutions instead of one solution
- Use a heavy dose of asserts to find the places where you code is not behaving the way you expect.