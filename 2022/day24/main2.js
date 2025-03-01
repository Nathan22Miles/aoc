const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')

// https://adventofcode.com/2022/day/24
process.chdir('/Users/nmiles/source/aoc/2022/day24')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let map = data.split('\n').map(line => line.split(''))
let sts = rng2(map[0].length-2, map.length-2)
    .filter(([c, r]) => map[r+1][c+1] !== '.')
    .map(([c, r]) => ({ c: c+1, r: r+1, dir: map[r+1][c+1] }));

let stsSet = new JSet(sts.map(st => [st.c, st.r]))

let dirToD = { '^': [0, -1], 'v': [0, 1], '<': [-1, 0], '>': [1, 0] }
let dirs = [[0,0], [0, -1], [0, 1], [-1, 0], [1, 0]]

let start = [map[0].findIndex(cc => cc === '.'),0]
let end = [map[map.length - 1].findIndex(cc => cc === '.'), map.length - 1]

function keyFn([c,r]) {
    return `${pad(end.dist([c,r]), 5, '0')}.${c}.${r}`
}

function nextElementsFn(q, round) {
    let nexts = []

    for (let dir of dirs) {
        let next = q.add(dir)
        let [c, r] = next
        if (map[r] === undefined) continue
        if (map[r][c] === undefined) continue
        if (map[r][c] === '#') continue
        if (stsSet.has(next)) continue
        nexts.push(next)
    }

    return nexts
}

function moveStorm(st) {
    let d = dirToD[st.dir]
    c = st.c + d[0]
    r = st.r + d[1]

    if (r === 0) r = map.length-2
    else if (r === map.length-1) r = 1
    
    if (c === 0) c = map[0].length-2
    else if (c === map[0].length-1) c = 1
    
    st.r = r
    st.c = c
}

function moveStorms() {
    sts.forEach(st => moveStorm(st))
    stsSet = new JSet(sts.map(st => [st.c, st.r]))
}

let round = -1

function runBFS(initialElement, keyFn, nextElementsFn, breadth, goal) {
    let todo = new PriorityQueue()
    todo.enqueue(initialElement, keyFn(initialElement))

    while (true) {
        let _todo = new PriorityQueue()                      // Queue for the next minute.
        let processed = 0
        let previousKey = ''
        ++round

        while (processed < breadth && !todo.isEmpty()) {
            let { vertex: element, priority: key } = todo.dequeue()
            if (key === previousKey) { continue }
            previousKey = key

            ++processed
            for (let nextElement of nextElementsFn(element, round)) {
                if (keyFn(nextElement) === keyFn(goal)) { 
                    moveStorms()
                    return 
                }
                _todo.enqueue(nextElement, keyFn(nextElement))
            }
        }

        todo = _todo
        moveStorms()
    }
}

let _breadth = 1000

runBFS(start, keyFn, nextElementsFn, _breadth, end)
runBFS(end, keyFn, nextElementsFn, _breadth, start)
runBFS(start, keyFn, nextElementsFn, _breadth, end)

log('round', round)