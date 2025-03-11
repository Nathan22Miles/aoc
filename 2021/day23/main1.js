const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2021/day/23
process.chdir('/Users/nmiles/source/aoc/2021/day23')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData


let cost = [0,1,10,100,1000]
let home = [0,2,4,6,8]

let pts = [
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0],
    [2, 1], [2, 2], // 11, 12
    [4, 1], [4, 2], // 13, 14
    [6, 1], [6, 2], // 15, 16
    [8, 1], [8, 2], // 17, 18
]

let halls = [pts[0], pts[1], pts[3], pts[5], pts[7], pts[9], pts[10]]
let rooms = pts.slice(11, 19)

let rc2i = new JMap(pts.map((pt, i) => [pt, i]))
let i2goal = new JMap([[11,1], [12,1], [13,2], [14,2], [15,3], [16,3], [17,4], [18,4]])

function up([c, r]) { return r === 1 ? [[c, 0]] : [[c, 1], [c, 0]] }

// assert.deepEqual(up([2, 2]), [[2, 1], [2, 0]])

function down([c,r]) { return r === 1 ? [[c, 1]] : [[c, 1], [c, 2]] }

function side([c1, r1], [c2, r2]) { 
    let d = c2 > c1 ? 1 : -1
    return rng(Math.abs(c2-c1)).map(i => [c1+(i+1)*d, 0])
}

// assert.deepEqual(side([2, 2], [0,0]), [[1, 0], [0, 0]])

function makeIn(hall, room) {
    return [hall, ...side(hall, room), ...down(room)]
}

function makeU(room1, room2) {
    if (room1[0] === room2[0]) return null
    return [room1, ...up(room1), ...side(room1, room2), ...down(room2)]
}

// assert.deepEqual(makeU([2, 1], [4, 1]), [[2,1], [2, 0], [3, 0], [4, 0], [4, 1]])
// create paths
let _ins = halls.crosses(rooms).map(([hall, room]) => makeIn(hall, room))
let _us = rooms.crosses(rooms).map(([room1, room2]) => makeU(room1, room2)).filter(x => x)
let _outs = _ins.map(in_ => in_.slice().reverse())

function makePathMap(paths) {
    let map = new Map()
    for (let path of paths) {
        path = path.map(pt => rc2i.get(pt))
        map.push(path[0], path.slice(1))
    }
    return map
}

// index paths keyed by origin index
let ins = makePathMap(_ins)
let us = makePathMap(_us)
let outs = makePathMap(_outs)

function canInto(i, map) {
    return (i%2 === 0) || map[i+1] === i2goal.get(i)
}

function clearPath(path, map) {
    return path.every(i => !map[i])
}

let map = [0,0,0,0,0,0,0,0,0,0,0,
    // 2,1,3,4,2,3,4,1 // test data
    3, 3, 2, 4, 1, 1, 4, 2
]

function showMap(depth, map, best) {
    // if (best && best!==Infinity) log(best)
    // let _halls = map.slice(0, 11).map(x => x.toString()).join('')
    // let _h1 = `   ${map[11]} ${map[13]} ${map[15]} ${map[17]}`
    // let _h2 = `   ${map[12]} ${map[14]} ${map[16]} ${map[18]}`
    // log(depth, '\n', [_halls, _h1, _h2].join('\n'))
}


function atGoal(i, map) {
    if (map[i] !== i2goal.get(i)) return false
    if (i % 2 === 0) return true
    return map[i + 1] === i2goal.get(i + 1)
}

function goalCount(map) {
    return [11, 12, 13, 14, 15, 16, 17, 18].map(i => atGoal(i, map) ? 1 : 0).sum()
}

function isDone(map) {
    return [11, 12, 13, 14, 15, 16, 17, 18].every(i => map[i] === i2goal.get(i))
}

function next([map, cost]) {
    if (isDone(map)) return [map, cost, true]

    let nexts = []

    // try ins
    for (let i of [0, 1, 3, 5, 7, 9, 10]) {
        let mover = map[i]
        if (!mover) continue
        let _ins = ins.get(i)

        for (let path of _ins) {
            let jTarget = path.last()
            if (mover != i2goal.get(jTarget)) continue
            if (!clearPath(path, map)) continue
            if (!canInto(jTarget, map)) continue

            let _cost = 10**(mover-1)*path.length
            let _map = map.slice()
            _map[i] = 0
            _map[jTarget] = mover;
            nexts.push([_map, cost+_cost])
        }
    }

    // try us
    for (let i of [11, 12, 13, 14, 15, 16, 17, 18]) {
        let mover = map[i]
        if (!mover) continue
        let _us = us.get(i)

        for (let path of _us) {
            let jTarget = path.last()
            if (mover != i2goal.get(jTarget)) continue
            if (!clearPath(path, map)) continue
            if (!canInto(jTarget, map)) continue

            let _cost = 10 ** (mover - 1) * path.length
            let _map = map.slice()
            _map[i] = 0
            _map[jTarget] = mover
            nexts.push([_map, cost + _cost])
        }
    }

    // try outs
    for (let i of [11, 12, 13, 14, 15, 16, 17, 18]) {
        let mover = map[i]
        if (!mover) continue
        if (atGoal(i, map)) continue // don't move out if at goal

        let _outs = outs.get(i)

        for (let path of _outs) {
            let jTarget = path.last()
            if (!clearPath(path, map)) continue

            let _cost = 10 ** (mover - 1) * path.length
            let _map = map.slice()
            _map[i] = 0
            _map[jTarget] = mover;
            nexts.push([_map, cost + _cost])
        }
    }

    return nexts
}

let best = Infinity

function runBFS(initialElement, keyFn, nextElementsFn, breadth, rounds) {
    let todo = new PriorityQueue()
    todo.enqueue(initialElement, keyFn(initialElement))

    for (let round = 0; ; ++round) {
        log('round=', round+1)
        let _todo = new PriorityQueue()                      // Queue for the next minute.
        let processed = 0
        let previousKey = ''
        let q = 0

        while (processed < breadth && !todo.isEmpty()) {
            let { vertex: element, priority: key } = todo.dequeue()
            if (key === previousKey) { continue }
            previousKey = key

            ++processed
            for (let nextElement of nextElementsFn(element)) {
                const _key = keyFn(nextElement)
                if (_key.startsWith('0')) {
                    let _best = nextElement[1]
                    if (_best < best) {
                        best = _best
                        log('best=', best)
                    }
                } else {
                    ++q
                    _todo.enqueue(nextElement, _key)
                }
            }
        }
        log('q=', q)
        assert(q < breadth)

        todo = _todo

        if (round > rounds) { break}
    }

    // Create prioritized lists of elements by unstacking heap into elements
    // let elements = []
    // while (!todo.isEmpty()) {
    //     elements.push(todo.dequeue().vertex)
    // }

    // return elements
}

function key([_map, cost]) {
    return `${8-goalCount(_map)}-${10000000-cost}${map}`
}

runBFS([map, 0], key, next, 100000, 16)
log('done')


// log(best) // 12521 testData, 13558 data
