
const assert = require('assert')
const fs = require('fs')
const _ = console.log
const log = console.log

function pad(x, len=3, cc=' ') { return x.toString().padStart(len, cc) }

const rng = (n, m) => { 
    if (m === undefined) return Array.from({ length: n }, (_, i) => i)
    return Array.from({ length: m-n }, (_, i) => i+n) 
}
// rngRC = (r, c) => rng(r).flatMap(i => rng(c).map(j => [i, j])) // [[0, 0], [0, 1], ..., [r-1, c-1]]
// rngArr = (arr) => rng(arr.length).flatMap(i => rng(arr[0].length).map(j => [i, j])) // [[0, 0], [0, 1], ..., [r-1, c-1]]

log('sum', sum)
const sfy = x => JSON.stringify(x)

// ============ Map extensions ============

Map.prototype.addToSet = function (key, value) {
    //                              [[key, value], ...]
    if (!this.has(key)) this.set(key, new Set())
    this.get(key).add(value)
}

Map.prototype.push = function (key, value) {
    //                              [[key, value], ...]
    if (!this.has(key)) this.set(key, [])
    let list = this.get(key)
    list.push(value)
}

Map.prototype.groupBy = function (values, fieldOrFn) {
    for (let value of values) {
        let key
        if (typeof fieldOrFn === 'function') {
            key = fieldOrFn(value)
        } else {
            key = value[fieldOrFn]
        }
        this.push(key, value)
    }
}

Map.prototype.countBy = function (values, fieldOrFn) {
    for (let value of values) {
        let key
        if (typeof fieldOrFn === 'function') {
            key = fieldOrFn(value)
        } else {
            key = value[fieldOrFn]
        }
        let count = this.get(key) ?? 0
        this.set(key, count + 1)
    }
}

// ============ Set extensions ============

Set.prototype._add = function (arr) { arr.forEach(x => this.add(x)) }

Set.prototype._delete = function (arr) { arr.forEach(x => this.delete(x)) }

// ============ Array extensions ============

function parse2D(data) {
    return data.trim().split('\n').map(row => row.split(''))
}

Array.prototype.eq = function (arr2) { return this.every((x, i) => x === arr2[i]) }
Array.prototype.lt = function (arr2) {
    assert(this.length === arr2.length) 
    for (let i = 0; i < this.length; i++) {
        if (this[i] > arr2[i]) return false
        if (this[i] < arr2[i]) return true
    }
    return false
}
Array.prototype.le = function (arr2) {
    assert(this.length === arr2.length)
    for (let i = 0; i < this.length; i++) {
        if (this[i] > arr2[i]) return false
        if (this[i] < arr2[i]) return true
    }
    return true
}
Array.prototype.gt = function (arr2) {
    assert(this.length === arr2.length)
    for (let i = 0; i < this.length; i++) {
        if (this[i] > arr2[i]) return true
        if (this[i] < arr2[i]) return false
    }
    return false
}
Array.prototype.ge = function (arr2) {
    assert(this.length === arr2.length)
    for (let i = 0; i < this.length; i++) {
        if (this[i] > arr2[i]) return true
        if (this[i] < arr2[i]) return false
    }
    return true
}

Array.prototype.last = function () { return this.slice(-1)[0] }

Array.prototype.odds = function () { return this.filter((_, i) => i % 2 === 1) }
Array.prototype.evens = function () { return this.filter((_, i) => i % 2 === 0) }

Array.prototype.fnMax = function (fn) { return this.reduce((max, x) => fn(x) > fn(max) ? x : max, this[0]) }
Array.prototype.fnMin = function (fn) { return this.reduce((min, x) => fn(x) < fn(min) ? x : min, this[0]) }

Array.prototype.sum = function () { return this.reduce((a, b) => a + b, 0) }
Array.prototype.avg = function () { return this.reduce((a, b) => a + b, 0) / this.length }
Array.prototype.mul = function () { return this.reduce((a, b) => a * b, 1) }
Array.prototype.and = function () { return this.reduce((a, b) => a && b, true) }
Array.prototype.or  = function () { return this.reduce((a, b) => a || b, false) }
Array.prototype.min = function () { return this.reduce((a, b) => a < b ? a : b, this[0]) }
Array.prototype.max = function () { return this.reduce((a, b) => a > b ? a : b, this[0]) }
Array.prototype.count = function () { return this.filter(x => x).length }
Array.prototype.toInt = function () { return this.map(x => parseInt(x)) }

Array.prototype.deltas = function () { return this.slice(1).map((value, index) => value - this[index]) }

Array.prototype.shape2 = function (c) { 
    return Array.from({ length: this.length / c }, (_, i) => this.slice(i * c, (i + 1) * c)) 
}

Array.prototype.log = function (i) {
    if (i !== undefined) {
        log(this[i])
        return this
    }

    log(this.map((x, i) => `${i}: ${sfy(x)}`).join('\n'))
    
    return this
}

Array.prototype.pairs = function () { 
    let pairs = []
    for (let i = 0; i < this.length - 1; i++) {
        for (let j = i + 1; j < this.length; j++) {
            pairs.push([this[i], this[j]])
        }
    }
    return pairs
 }

 Array.prototype.is2D = function () { 
    if (this.length === 0) return false
    return this.every(x => Array.isArray(x)) 
}

Array.prototype.copy = function () { return this.map(x => Array.isArray(x) ? x.slice() : x) }

Array.prototype.toString = function() { 
    if (this.length === 0) return '[]'

    if (this.is2D()) {
        return this.map((row, r) => `${pad(r)}  ${sfy(row)}`).join('\n')
    }

    let text = sfy(this)
    if (text.length > 60) {
        text = this.map((cell, i) => `${pad(i)}  ${sfy(cell)}`).join('\n')
    }
    
    return text
}

 // Following functions assume array is is2D

Array.prototype.rcs = function () { 
    let r = this.length
    let c = this[0].length
    rcs = []
    for (let i = 0; i < r; i++) {
        for (let j = 0; j < c; j++) {
            rcs.push([i, j])
        }
    }
    return rcs
 }

Array.prototype.deleteColumn =  function (c) { 
    this.forEach(row => row.splice(c, 1)) 
    return this
}

Array.prototype.deleteRow = function (r) { 
    this.splice(r, 1) 
    return this
}

// adds new column (row) BEFORE the specified column (row)
Array.prototype.addColumn = function (c, cellValue='.') { 
    this.forEach((row, r) => row.splice(c, 0, cellValue)) 
    return this
}
Array.prototype.addRow = function (r, cellValue = '.') { 
    let c = this[0].length
    let newRow = Array(c).fill(cellValue)
    this.splice(r, 0, newRow)
    return this
 }

Array.prototype.column =  function (c) { return this.map(row => row[c]) }

Array.prototype.transpose = function () {
    return this[0].map((_, i) => this.map(row => row[i]))
}

Array.prototype.joinjoin = function (j1 = '', j2 = '\n') { return this.map(row => row.join(j1)).join(j2) }

function lengthFn(x) { return x.length }
function sizeFn(x) { return x.size }

// Categorize array element to a category 0, 1, 2, ...
Array.prototype.categorize = function () {
    let result = []
    let cat = 0
    let categories = new Map()

    for (let x of this) {
        if (categories.has(x)) {
            result.push(categories.get(x))
        } else {
            categories.set(x, cat)
            result.push(cat)
            ++cat
        }
    }
    return [result, categories]
}

// solve linear equation

// ============ Graph ============

class Graph {
    constructor() {
        this.aList = new Map()
    }

    // addVertex(vertex) {
    //     if (!this.aList[vertex]) {
    //         this.aList[vertex] = []
    //     }
    // }

    // add directed edge
    addEdge(v1, v2, cost=1) {
        v1 = v1.toString()
        v2 = v2.toString()

        if (!this.aList.get(v1)) {
            this.aList.set(v1, [])
        }
        let _v1 = this.aList.get(v1)

        if (_v1.findIndex(x => x.node === v2) < 0) {
            _v1.push({ node: v2, cost })
        }
    }

    findShortestPath(start, end) {
        start = start.toString()
        end = end.toString()

        const distances = {}
        const previous = {}
        const pq = new PriorityQueue()

        for (let vertex /* :string */ in this.aList.keys()) {
            if (vertex === start) {
                distances[vertex] = 0
                pq.enqueue(vertex, 0)
            } else {
                distances[vertex] = Infinity
                pq.enqueue(vertex, Infinity)
            }
            previous[vertex] = null
        }

        while (!pq.isEmpty()) {
            let { vertex } = pq.dequeue()

            if (vertex === end) {
                let path = []
                let totalCost = distances[vertex]
                while (previous[vertex]) {
                    path.push(vertex)
                    vertex = previous[vertex]
                }
                path.push(start)
                path.reverse()

                return { path, totalCost, distances }
            }

            if (vertex || distances[vertex] !== Infinity) {
                for (let neighbor of this.aList.get(vertex)) {
                    let alt = distances[vertex] + neighbor.cost
                    if (alt < distances[neighbor.node]) {
                        distances[neighbor.node] = alt
                        previous[neighbor.node] = vertex
                        pq.enqueue(neighbor.node, alt)
                    }
                }
            }
        }

        return { path: [], totalCost: Infinity, distances }
    }

    findLongestPath(start, end) {
        // use depth first search to find the largest total cost path from start to end
        start = start.toString()
        end = end.toString()

        let longestPath = []
        let longestCost = -Infinity
        let visited = new Set()

        const dfs = (vertex, path, cost) => {
            // log(vertex, path, cost)
            visited.add(vertex /* string */)
            path.push(vertex)

            if (vertex === end) {
                if (cost > longestCost) {
                    longestPath = path.slice()
                    longestCost = cost
                }
            }

            let neighbors = this.aList.get(vertex) || []
            for (let neighbor of neighbors) {
                // neighbor = { node: string, cost: number }
                if (!visited.has(neighbor.node)) {
                    dfs(neighbor.node, path, cost + neighbor.cost)
                }
            }

            path.pop()
            visited.delete(vertex)
        }

        dfs(start, [], 0)

        return { path: longestPath, cost: longestCost }
    }
}

class PriorityQueue {
    constructor() {
        this.values = []
    }

    enqueue(vertex, priority) {
        this.values.push({ vertex, priority })
        this.sort()
    }

    dequeue() {
        return this.values.shift()
    }

    isEmpty() {
        return this.values.length === 0
    }

    sort() {
        this.values.sort((a, b) => a.priority - b.priority)
    }
}

class Maze {
    constructor(data, { addBorder=false }) {
        this.data = data
        this.rows = data.split('\n')

        if (addBorder) {
            this.rows = this.rows.map(row => '.' + row + '.')
            let border = '.'.repeat(this.rows[0].length)
            this.rows.unshift(border)
            this.rows.push(border)
        }

        this.r = this.rows.length
        this.c = this.rows[0].length
        this.m = this.rows.join('').split('')
    }

    get psRC() { // [[r,c]...] for all interior points
        let { r, c } = this
        return rng(r-2).flatMap(i => rng(c-2).map(j => [i+1, j+1])) 
    }
    
    get allPs() { // interior points
        let { m, c } = this
        return rng(c, m.length-c) 
    }

    get ps() { return rng(this.m.length).filter(p => this.m[p] !== '#') }

    // returns p
    find = (cc) => { 
        let p = this.m.indexOf(cc) 
        assert(p !== -1, `Cannot find ${cc}`)
        return p
    }

    dirs = () => {
        let { c } = this
        return { U: -c, D: c, L: -1, R: 1, ds: [-c, c, -1, 1] }
    }

    fr = (p) => { return m[p] !== '#' }

    allowedDirs = (p, disallowed=[]) => {
        let { m, c } = this
        let allowed = []
        if (m[p] === '#') return allowed
        for (let d of [-c, c, -1, 1]) {
            if (disallowed.includes(d)) continue
            let np = p + d
            if (m[np] !== '#') allowed.push(d)
        }
        return allowed
    }

    findJunctions() {
        return this.ps.filter(p => this.allowedDirs(p).length > 2)
    }

    dc2d = (dc) => {
        let { c } = this
        if (dc === '^') return -c
        if (dc === 'v') return c
        if (dc === '<') return -1
        if (dc === '>') return 1
        return 0
    }

   d2dc = (d) => {
        let { c } = this
        if (d === -c) return '^'
        if (d === c) return 'v'
        if (d === -1) return '<'
        if (d === 1) return '>'
        assert(false, `Invalid direction ${d}`)
    }

    rc = (p) => {
        let { c } = this
        return [Math.floor(p / c), p % c]
    }

    addEdge(g, p, d) {
        // log(rc(p), d)
        let org = p
        let cost = 0
        while (true) {
            ++cost
            p = p + d
            // log(rc(p), d)
            if (this.junctions.includes(p)) break

            let ds = _m.allowedDirs(p, [-d])
            if (ds.length === 0) {
                log('dead end', p)
                return
            }
            assert(ds.length === 1, `[${rc(p)}] Too many directions ${ds}`)
            d = ds[0]
        }

        g.addEdge(org, p, cost)
    }

    // optional - allow(p, d) returns true if edge is allowed
    buildGraph(allow) {
        let g = new Graph()

        let junctions = this.findJunctions()
        junctions.push(this.find('S'))
        junctions.push(this.find('E'))
        this.junctions = junctions

        for (let p of junctions) {
            let allowed = this.allowedDirs(p)
            // log('intersection', rc(p), allowed)
            for (let d of allowed) {
                if (allow && !allow(p, d)) continue
                this.addEdge(g, p, d)
            }
        }

        return g
    }

    toString = (ps) => {
        let { c } = this
        ps = ps ?? this.m

        let rows = []
        let rowNum = 0
        for (let i = 0; i < ps.length; i += c) {
            let row = ps.slice(i, i + c).join('')
            if (i === 0) {
                row = row.slice(0, 9) + '|' + row.slice(10)
            }
            rows.push(`${pad(rowNum)} ${pad(i)} ${row}`)
            ++rowNum
        }
        return rows.join('\n')
    }

    rc2p = ([r, c]) => this.c * r + c

}

// If tracePath is provided, memoize will save traces to the file 
// when fn is called with no arguments, i.e.
// let fn = memoize(_fn, 'trace.txt')
// ...
// fn()
function memoize(fn, tracePath) {
    const cache = {}
    const traces = []
    const hitsAndMisses = { hits: 0, misses: 0 }

    return function (...args) {
        if (args.length === 0) {
            hitsAndMisses.keys = Object.keys(cache).length
            assert(tracePath, 'tracePath was not provided')
            fs.writeFileSync(tracePath, 
                sfy(hitsAndMisses) + '\n' + traces.join('\n'))
            traces = []
            return
        }

        const key = JSON.stringify(args)
        if (cache[key] !== undefined) {
            hitsAndMisses.hits++
            return cache[key]
        }
        hitsAndMisses.misses++

        if (tracePath) { traces.push(key) }

        const result = fn(...args)
        cache[key] = result

        if (tracePath) { traces.push(key + ' ==> ' + result) }

        return result
    }
}

// fn() to write trace info to tracePath
function traceFn(fn, tracePath='trace.txt') {
    const traces = []

    return function (...args) {
        if (args.length === 0) {
            fs.writeFileSync(tracePath, traces.join('\n'))
            traces = []
            return
        }

        const key = JSON.stringify(args)
        traces.push(key)
        const result = fn(...args)
        traces.push(key + ' ==> ' + result)
        return result
    }
}

// https://adventofcode.com/2023/day/13

process.chdir('/Users/nmiles/source/aoc/2023/day13')

let myData = fs.readFileSync('data.txt', 'utf8')

let testData = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`

function views(row, i) {
    let len = row.length
    assert(i > 0 && i < len)
    if (2*i <= len) { return [row.slice(0, i), row.slice(i, 2*i)] }
    let rlen = len - i
    return [row.slice(i-rlen, i), row.slice(i, i+rlen)]
}

assert(views('abcde', 1).eq(['a', 'b']))
assert(views('abcde', 2).eq(['ab', 'cd']))
assert(views('abcde', 3).eq(['bc', 'de']))
assert(views('abcde', 4).eq(['d', 'e']))
assert(views('abcd', 2).eq(['ab', 'cd']))

function mirrored(row, i) {
    let [left, right] = views(row, i)
    return left.eq(right.reverse())
}

assert(mirrored([1, 2, 2, 1], 2))

assert(['a', 'b', 'a'].categorize()[0].eq([0, 1, 0]))

function findRowReflectionLine(m) {
    let [result] = m.map(row => row.join('')).categorize()
    let iRow = rng(1, m.length).find(i => mirrored(result, i))
    return iRow ?? 0 
}

// let [test1, test2] = testData.split('\n\n').map(parse2D)
// assert(findRowReflectionLine(test2) === 4)
// assert(findSmudgedRowReflectionLine(test1) === 3)

function findReflections(pattern) {
    let m = parse2D(pattern)
    let row = findRowReflectionLine(m)
    let col = findRowReflectionLine(m.transpose())
    return [row, col]
}

function part1(data, expected) {
    let patterns = data.split('\n\n')
    let summary = patterns.map(findReflections)
        .map(([row, col]) => 100*row + col)
        .sum()
    assert(summary === expected, `Expected ${expected} but got ${summary}`)
}

function findSmudgedRowReflectionLine(m) {
    // log(m.map(row => row.join('')).join('\n'))

    let [result, categories] = m.map(row => row.join('')).categorize()
    let iRow1 = rng(1, m.length).find(i => mirrored(result, i))

    for (let i = 0; i < m.length; i++) {
        let row = m[i]
        // try smudging each mirror
        for (let smudge = 0; smudge < row.length; smudge++) {
            let row2 = row.slice()
            row2[smudge] = row2[smudge] === '.' ? '#' : '.'
            let cat = categories.get(row2.join(''))
            if (cat === undefined) continue // smudged row does not match any existing row

            let result2 = result.slice()
            result2[i] = cat
            let iRow2 = rng(1, m.length)
                .filter(k => mirrored(result2, k))
                .filter(k => k !== iRow1)
                .last()
            if (iRow2 !== undefined) return iRow2
        }
    }

    return 0
}

function findSmudgedReflections(pattern, iRow) {
    let m = parse2D(pattern)
    let row = findSmudgedRowReflectionLine(m)
    let col = findSmudgedRowReflectionLine(m.transpose())
    if (row <= 0 && col <= 0) {
        log(`No smudged reflection line found for ${iRow}`)
    }
    return [row, col]
}

function part2(data) {
    let patterns = data.split('\n\n')
    let summary = patterns
        .map(findSmudgedReflections)
        .map(([row, col]) => 100 * row + col)
        .sum()
    return summary
}

// part1(myData, 33728)
// log('part2', part2(testData)) // should be 400
log('part2', part2(myData)) // should be 28235

log('done')
