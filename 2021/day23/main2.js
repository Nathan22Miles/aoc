const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2021/day/23
process.chdir('/Users/nmiles/source/aoc/2021/day23')

// let data = fs.readFileSync('data.txt', 'utf8')
// let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData


let cost = [0,1,10,100,1000]
let home = [0,2,4,6,8]

let pts = [
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0], [10, 0],
    [2, 1], [2, 2], [2, 3], [2, 4], // 11, 12, 13, 14
    [4, 1], [4, 2], [4, 3], [4, 4], // 15, 16, 17, 18
    [6, 1], [6, 2], [6, 3], [6, 4], // 19, 20, 21, 22
    [8, 1], [8, 2], [8, 3], [8, 4], // 23, 24, 25, 26
]

let halls = [pts[0], pts[1], pts[3], pts[5], pts[7], pts[9], pts[10]]
let rooms = pts.slice(11, 27)
let bottomRooms = [14, 18, 22, 26]

let rc2i = new JMap(pts.map((pt, i) => [pt, i]))

let i2goal = new JMap()
rng(4).forEach(i => { i2goal.set(11+i, 1); i2goal.set(15+i, 2); i2goal.set(19+i, 3); i2goal.set(23+i, 4) })

function up([c, r]) { 
    let rcs = []
    while (r > 0) {
        r--
        rcs.push([c, r])
    }
    return rcs
 }

// assert.deepEqual(up([2, 2]), [[2, 1], [2, 0]])

function down([c,r]) { 
    let rcs = []
    let _r = 0
    while (_r < r) {
        _r++
        rcs.push([c, _r])
    }
    return rcs
 }

function side([c1, r1], [c2, r2]) { 
    let rcs = []
    while (c1 < c2) {
        c1++
        rcs.push([c1, 0])
    }
    while (c1 > c2) {
        c1--
        rcs.push([c1, 0])
    }
    return rcs
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

function atGoal(i, map) {
    return map[i] === i2goal.get(i)
}

function atGoalAll(i, map) {
    while (true) {
        if (!atGoal(i, map)) return false
        if (bottomRooms.includes(i)) return true
        ++i
    }
}

function canInto(i, map) {
    while (!bottomRooms.includes(i)) {
        ++i
        if (!atGoal(i, map)) return false
    }
    return true
}

function clearPath(path, map) {
    return path.every(i => !map[i])
}

// testData
let map = [0,0,0,0,0,0,0,0,0,0,0,
    2,4,4,1,
    3,3,2,4,
    2,2,1,3,
    4,1,3,1,
]

// real data
map = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    3, 4, 4, 3, 
    2, 3, 2, 4, 
    1, 2, 1, 1, 
    4, 1, 3, 2,
]

let iRooms = rooms.map(pt => rc2i.get(pt))
let iHalls = halls.map(pt => rc2i.get(pt))

function isDone(map) {
    return iRooms.every(i => atGoal(i, map))
}

function nexts([map, cost]) {
    if (isDone(map)) return [map, cost]

    let nexts = []

    // try ins
    for (let i of iHalls) {
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
    for (let i of iRooms) {
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
    for (let i of iRooms) {
        let mover = map[i]
        if (!mover) continue
        if (atGoalAll(i, map)) continue // don't move out if at goal

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

function addTodo(todos, map, cost) {
    let _cost = todos.get(map) ?? Infinity
    if (cost < _cost) {
        todos.set(map, cost)
    }
}

let best = Infinity

function runBFS(_map) {
    let todos = new JMap([[_map, 0]])

    for (let round = 0; ; ++round) {
        log('round=', round+1, todos.size)

        let _todos = new JMap()
        let maps = [...todos.keys()] 
        if (maps.length === 0) break

        for (let map of maps) {
            for (let next of nexts([map, todos.get(map)])) {
                let [map, cost] = next
                if (cost >= best) continue

                if (isDone(map)) {
                    best = cost
                    log('*** best=', best)
                    continue
                }

                addTodo(_todos, map, cost)
            }
        } 
        todos = _todos              
    }
}

runBFS(map, 0)
log('done', best)


// log(best) // 44169 testData
