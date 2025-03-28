const assert = require('assert')
const fs = require('fs')
const log = console.log

/**
 * Left pad a number or string with a character to a specified length
 * @param {*} x number or string
 * @param {*} len total length of result field (default 3)
 * @param {*} cc character to pad with (default ' ')
 * @returns string
 */
function pad(x, len = 3, cc = ' ') { return x.toString().padStart(len, cc) }

const rng = (n, m) => {
    // If m is a function, execute it n times
    if (typeof m === 'function') return Array.from({ length: n }, (_, i) => m(i))
        
    if (m === undefined) return Array.from({ length: n }, (_, i) => i)
    return Array.from({ length: m - n }, (_, i) => i + n)
}
const rng2 = (r, c) => rng(r).flatMap(i => rng(c).map(j => [i, j])) // [[0, 0], [0, 1], ..., [r-1, c-1]]
// rngArr = (arr) => rng(arr.length).flatMap(i => rng(arr[0].length).map(j => [i, j])) // [[0, 0], [0, 1], ..., [r-1, c-1]]

const make2D = (r, c, fill = 0) => Array.from({ length: r }, () => Array(c).fill(fill))

const sfy = x => JSON.stringify(x)
const ssfy = x => JSON.stringify(x, null, 4)

// regex, e.g., /(?<type>.)(?<id>\w+) -> (?<outputs>.*$)/
String.prototype._match = function (regex, splitter = /\s*,\s*/) {
    let match = regex.exec(this)
    for (let key of Object.keys(match?.groups ?? [])) {
        if (key.endsWith('s')) {
            match.groups[key] = match.groups[key].split(splitter)
        }
    }
    return match?.groups
}

// ============ Map extensions ============

Map.prototype.addToSet = function (key, value) {
    //                              [[key, value], ...]
    if (!this.has(key)) this.set(key, new Set())
    let set = this.get(key)
    if (set.has(value)) return false
    set.add(value)
    return true
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

    return this
}

Map.prototype.tally = function (key, count=1) {
    let _count = this.get(key) ?? 0
    this.set(key, _count + count)

    return this
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

    return this
}

// ============ Set extensions ============

Set.prototype._add = function (arr) { arr.forEach(x => this.add(x)) }

Set.prototype._delete = function (arr) { arr.forEach(x => this.delete(x)) }

Set.prototype.and = function (otherSet) {
    return new Set([...this].filter(x => otherSet.has(x)))
}

Set.prototype.or = function (otherSet) {
    let result = new Set([...this])
    for (let x of otherSet) result.add(x)
    return result
}

Set.prototype.andNot = function (otherSet) {
    let result = new Set([...this])
    for (let x of otherSet) result.delete(x)
    return result
}

Set.prototype.toArray = function () { return [...this] }

// ============ Array extensions ============

Array.prototype.logRCs = function (normalize) {
    let _this = this.slice()
    if (normalize) _this.normalize2D()
    let { right, bottom } = _this.bounds2D()

    let _map = make2D(bottom + 1, right + 1, '.')
    _this.forEach(([c, r]) => _map[r][c] = '#')
    let rows = _map.map(row => row.join(''))
    log(rows.join('\n'))
    log('.')
}

function parse2D(data) {
    return data.trim().split('\n').map(row => row.split(''))
}

Array.prototype.toSet = function () { return new Set(this) }

Array.prototype.toMap = function (fnKey, fnValue) {
    let map = new Map()
    this.forEach((x, i) => map.set(fnKey(x, i, this), fnValue(x, i, this)))
    return map
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
Array.prototype.or = function () { return this.reduce((a, b) => a || b, false) }
Array.prototype.count = function () { return this.filter(x => x).length }
Array.prototype.toInt = function () { return this.map(x => parseInt(x)) }

/** Split the array into subarrays wherever the split function returns true */
Array.prototype.splitWhen = function (splitFn) {
    let result = [[]]

    for (let x of this) {
        if (splitFn(x)) {
            result.push([x])
        } else {
            result.last().push(x)
        }
    }

    return result
}

Array.prototype.min = function () { return this.reduce((a, b) => a < b ? a : b, Infinity) }
Array.prototype.max = function () { return this.reduce((a, b) => a > b ? a : b, -Infinity) }

Array.prototype.field = function (field) { return this.map(x => x[field]) }

Array.prototype.jn = function () { return this.join('') }
Array.prototype.jnn = function () { return this.join('\n') }

Array.prototype.replace = function (pat, val) { return this.map(x => x.replace(pat, val)) }

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

Array.prototype.crosses = function (that) {
    let crosses = []
    for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < that.length; j++) {
            crosses.push([this[i], that[j]])
        }
    }
    return crosses
}

Array.prototype.zip = function (that) {
    return this.map((x, i) => [x, that[i]])
}

Array.prototype.is2D = function () {
    if (this.length === 0) return false
    return this.every(x => Array.isArray(x))
}

Array.prototype.copy = function () { return this.map(x => Array.isArray(x) ? x.slice() : x) }

Array.prototype.toString = function () {
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

Array.prototype.findFirstAndLast = function (fn) {
    let first = this.findIndex(fn)
    let last = this.findLastIndex(fn)
    return { first, last }
}

Array.prototype.findLastIndex = function (fn) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (fn(this[i], i, this)) return i
    }
    return -1
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

Array.prototype.deleteColumn = function (c) {
    this.forEach(row => row.splice(c, 1))
    return this
}

Array.prototype.deleteRow = function (r) {
    this.splice(r, 1)
    return this
}

// adds new column (row) BEFORE the specified column (row)
Array.prototype.addColumn = function (c, cellValue = '.') {
    this.forEach((row, r) => row.splice(c, 0, cellValue))
    return this
}
Array.prototype.addRow = function (r, cellValue = '.') {
    let c = this[0].length
    let newRow = Array(c).fill(cellValue)
    this.splice(r, 0, newRow)
    return this
}

Array.prototype.add = function (that) {
    return this.map((x, i) => x + that[i])
}

Array.prototype.sub = function (that) {
    return this.map((x, i) => x - that[i])
}

Array.prototype.column = function (c) { return this.map(row => row[c]) }

Array.prototype.transpose = function () {
    return this[0].map((_, i) => this.map(row => row[i]))
}

Array.prototype.joinjoin = function (j1 = '', j2 = '\n') { return this.map(row => row.join(j1)).join(j2) }

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

Array.prototype.rotateLeft = function () {
    if (this.length <= 1) {
        return this // Nothing to rotate if the array has 0 or 1 element.
    }

    const firstElement = this.shift() // Remove the first element and store it.
    this.push(firstElement) // Add the removed element to the end.

    return this // Return the modified array (for chaining).
}

Array.prototype.bounds2D = function () {
    let left = this.map(([c, r]) => c).min()
    let right = this.map(([c, r]) => c).max()
    let top = this.map(([c, r]) => r).min()
    let bottom = this.map(([c, r]) => r).max()
    return { left, right, top, bottom }
}

Array.prototype.normalize2D = function () {
    let left = this.map(([c, r]) => c).min()
    let top = this.map(([c, r]) => r).min()
    this.forEach(([c, r], i) => elves[i] = [c - left, r - top])
}

/** Compute Manhattan distance between two vectors */
Array.prototype.dist = function (that) {
    let dist = 0
    for (let i = 0; i < this.length; i++) {
        dist += Math.abs(this[i] - that[i])
    }
    return dist
}

/** Compare two equal length vectors */
Array.prototype.cmp = function (that) {
    assert(this.length === that.length)
    for (let i = 0; i < this.length; i++) {
        if (this[i] < that[i]) return -1
        if (this[i] > that[i]) return 1
    }
    return 0
}
    
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
    addEdge(v1, v2, cost = 1) {
        // ignore infinite cost edges
        if (cost === Infinity) return

        // log('addEdge', v1, v2, cost)
        v1 = v1.toString()
        v2 = v2.toString()

        if (!this.aList.get(v1)) {
            this.aList.set(v1, [])
        }
        if (!this.aList.get(v2)) {
            this.aList.set(v2, [])
        }
        let _v1 = this.aList.get(v1)

        if (_v1.findIndex(x => x.node === v2) < 0) {
            _v1.push({ node: v2, cost })
        }
    }

    findShortestPath(start, end) {
        start = start.toString()
        end = end.toString()
        let count = 0

        const distances = {}
        const previous = {}
        const pq = new PriorityQueue()

        for (let vertex /* :string */ of this.aList.keys()) {
            ++count
            // if (count%100 === 0) log(count)

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
        this.bubbleUp()
    }

    dequeue() {
        const min = this.values[0]
        const end = this.values.pop()
        if (this.values.length > 0) {
            this.values[0] = end
            this.sinkDown()
        }
        return min
    }

    isEmpty() {
        return this.values.length === 0
    }

    bubbleUp() {
        let idx = this.values.length - 1
        const element = this.values[idx]
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2)
            let parent = this.values[parentIdx]
            if (element.priority >= parent.priority) break
            this.values[parentIdx] = element
            this.values[idx] = parent
            idx = parentIdx
        }
    }

    sinkDown() {
        let idx = 0
        const length = this.values.length
        const element = this.values[0]
        while (true) {
            let leftChildIdx = 2 * idx + 1
            let rightChildIdx = 2 * idx + 2
            let leftChild, rightChild
            let swap = null

            if (leftChildIdx < length) {
                leftChild = this.values[leftChildIdx]
                if (leftChild.priority < element.priority) {
                    swap = leftChildIdx
                }
            }
            if (rightChildIdx < length) {
                rightChild = this.values[rightChildIdx]
                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < leftChild.priority)
                ) {
                    swap = rightChildIdx
                }
            }
            if (swap === null) break
            this.values[idx] = this.values[swap]
            this.values[swap] = element
            idx = swap
        }
    }
}

class Maze {
    constructor(data, { addBorder = false, borderChar = '.' } = {}) {
        this.data = data
        this.rows = data.split('\n')

        if (addBorder) {
            this.rows = this.rows.map(row => borderChar + row + borderChar)
            let border = borderChar.repeat(this.rows[0].length)
            this.rows.unshift(border)
            this.rows.push(border)
        }

        this.r = this.rows.length
        this.c = this.rows[0].length
        this.m = this.rows.join('').split('')
    }

    get S() { return this.find('S') }
    get E() { return this.find('E') }

    get psRC() { // [[r,c]...] for all interior points
        let { r, c } = this
        return rng(r - 2).flatMap(i => rng(c - 2).map(j => [i + 1, j + 1]))
    }

    get allPs() { // interior points
        let { m, c } = this
        return rng(c, m.length - c)
    }

    get ps() { return rng(this.m.length).filter(p => this.m[p] !== '#') }

    neighbors = (pList, steps) => {
        if (!Array.isArray(pList)) pList = [pList]

        if (steps === 0) return pList
        let result = new Set()
        for (let p of pList) {
            for (let d of [-this.c, this.c, -1, 1]) {
                let np = p + d
                if (this.m[np] !== '#') {
                    result.add(np)
                }
            }
        }
        return this.neighbors([...result], steps - 1)
    }

    // returns p
    find = (cc) => {
        let p = this.m.indexOf(cc)
        assert(p !== -1, `Cannot find ${cc}`)
        return p
    }

    dirs = () => {
        let { c } = this
        return {
            U: -c, D: c, L: -1, R: 1,
            ds: [-c, c, -1, 1],
            iU: 0, iD: 1, iL: 2, iR: 3
        }
    }

    fr = (p) => { return this.m[p] !== '#' }

    allowedDirs = (p, disallowed = []) => {
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
            // if (i === 0) {
            //     row = row.slice(0, 9) + '|' + row.slice(10)
            // }
            rows.push(`${pad(rowNum)} ${pad(i, 5)} ${row}`)
            ++rowNum
        }
        return rows.join('\n')
    }

    rc2p = ([r, c]) => this.c * r + c

    d2i = (d) => {
        let { iU, iD, iL, iR, U, D, L, R } = this.dirs()
        if (d === U) return iU
        if (d === D) return iD
        if (d === L) return iL
        if (d === R) return iR
        assert(false, `Invalid direction ${d}`)
    }

    i2d = (d) => {
        let { ds } = this.dirs()
        return ds[d]
    }
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
function traceFn(fn, tracePath = 'trace.txt') {
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

// caclulate modulo taking into account possibility of negative numbers
function modulo(n, m) { return ((n % m) + m) % m }

// return overlap range or null if none
function segmentOverlap([s1, e1], [s2, e2]) {
    let s = Math.max(s1, s2)
    let e = Math.min(e1, e2)
    if (s > e) return null
    return [s, e]
}

// Points from which a line drawn to infinity intersects the polygon
// an odd number of time are 'inside'
// point = [x0, y0]
// polygon = [[x1, y1], [x2, y2], ...]
// returns true/false
function isPointInPolygon(point, polygon) {
    let [x, y] = point
    let inside = false

    for (let i = 0; i < polygon.length; i++) {
        let [xi, yi] = polygon[i]
        let [xj, yj] = polygon[i + 1] ?? polygon[0]

        let intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
        if (intersect) {
            inside = !inside
        }
    }

    return inside
}

// Shoelace Formula (because the coordinates cross like shoelaces) 
// Gauss's Area Formula
// Surveyor's Formula (because it's used in surveying)
// Known in antiquity!
// vertices = [[x1, y1], [x2, y2], ...]

// Note if the polygon has a border of width one centered on the given vertices,
// add perimiter/2 + 1 to the result.

function calculatePolygonArea(vertices) {
    let area = 0
    const n = vertices.length

    for (let i = 0; i < n; i++) {
        let [x1, y1] = vertices[i]
        let [x2, y2] = vertices[(i + 1) % n]
        area += x1 * y2 - x2 * y1
    }

    return Math.abs(area) / 2
}

// Functions to user for map(fn)

// cannot safely pass parseInt as map function because of extra optional arguments
// get misinterpreted as radix
function parseIntFn(x) { return parseInt(x) }
function parseFloatFn(x) { return parseFloat(x) } // not really needed
function lengthFn(x) { return x.length }
function sizeFn(x) { return x.size }

function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b]
    }
    return a
}

function lcm(a, b) {
    return (a * b) / gcd(a, b)
}

function isInt(str) {
    if (typeof str !== 'string') return false
    
    const num = parseInt(str, 10)
    return !isNaN(num) && Number.isInteger(num)
}

class Comp {
    constructor({ id, type, inputs, outputs }) {
        this.type = type

        assert(id)
        this.id = id

        this.inputs = inputs ?? []
        this.outputs = outputs ?? []
    }

    static compsMap = new Map()

    static ids() { return [...Comp.compsMap.keys()] }

    static comps(type) {
        return [...Comp.compsMap.values()]
            .filter(comp => type === undefined || comp.type === type)
    }

    static get(id) { return Comp.compsMap.get(id) }

    // Comp.parse(data, /(?<type>.)(?<id>\w+) -> (?<outputs>.*$)/)
    // Comp.parse(data, /(?<inputs>.*$) => (?<type>.)(?<id>\w+)/)
    static parse(data, regex) {
        for (let line of data.split('\n')) {
            let match = regex.exec(line)
            let { type, id, outputs: _outputs, inputs: _inputs, input1, input2 } = match.groups

            let outputs = undefined
            if (_outputs) {
                outputs = _outputs.split(/\s*,\s*/)
            }

            let inputs = undefined
            if (_inputs) {
                inputs = _inputs.split(/\s*,\s*/)
            } else if (input1) {
                inputs = [input1, input2]
            }

            Comp.compsMap.set(id, new Comp({ id, type, inputs, outputs }))
        }

        for (let comp of Comp.comps()) {
            // if missing, build inputs from outputs field
            if (comp.inputs.length === 0) {
                comp.inputs = Comp.ids().filter(id => {
                    let { outputs } = Comp.get(id)
                    return outputs.includes(comp.id)
                })
            }

            // if missing, build outputs from inputs field
            if (comp.outputs.length === 0) {
                comp.outputs = Comp.ids().filter(id => {
                    let { inputs } = Comp.get(id)
                    return inputs.includes(comp.id)
                })
            }
        }
    }

    // Comp.setFunction('&', 'receive', function (fromModule, pulse) { ... })
    static setFunction(type, name, fn) {
        for (let comp of Comp.comps()) {
            if (type === '' || comp.type === type) {
                comp[name] = fn
            }
        }
    }

    _toString(visited, indent) {
        let { id, type, inputs } = this
        if (visited.has(id)) return `${indent}${id} ${type} -> ...\n`
        visited.add(id)

        let str = `${indent}${id} ${type}\n`
        for (let input of inputs) {
            str += Comp.get(input)._toString(visited, indent + '  ')
        }

        return str
    }

    static dump(compId, path = 'comp.txt') {
        let comp = Comp.get(compId)
        let str = comp._toString(new Set(), '')
        fs.writeFileSync(path, str)
    }
}

function solveLinear(a1, b1, c1, a2, b2, c2) {
    // Calculate the determinant
    let determinant = a1 * b2 - a2 * b1

    if (determinant === 0) {
        return []
        // throw new Error("The system of equations has no unique solution.")
    }

    // Calculate x and y
    let x = (c1 * b2 - c2 * b1) / determinant
    let y = (a1 * c2 - a2 * c1) / determinant

    return [ x, y ]
}

/* Run breadth first search for n rounds.
 * initialElement: The initial search element.
 * keyFn(element): Function to compute the key for an element.
 *     Equal elements must have the same key.
 *     Elements with lower keys are processed first.
 * nextElementsFn(element, round): Function to compute the next elements.
 * breadth: Number of elements to process in each round.
 */
function runBFS(initialElement, keyFn, nextElementsFn, breadth, rounds) {
    let todo = new PriorityQueue()
    todo.enqueue(initialElement, keyFn(initialElement))

    for (let round = 0; ; ++round) {
        log('round=', round+1)
        let _todo = new PriorityQueue()                      // Queue for the next minute.
        let processed = 0
        let previousKey = ''

        while (processed < breadth && !todo.isEmpty()) {
            let { vertex: element, priority: key } = todo.dequeue()
            if (key === previousKey) { continue }
            previousKey = key

            ++processed
            for (let nextElement of nextElementsFn(element, round)) {
                _todo.enqueue(nextElement, keyFn(nextElement))
            }
        }

        todo = _todo

        // if rounds is a function, call it
        if (typeof rounds === 'function' && rounds()) { break }
        else if (round > rounds) { break}
    }

    // Create prioritized lists of elements by unstacking heap into elements
    let elements = []
    while (!todo.isEmpty()) {
        elements.push(todo.dequeue().vertex)
    }

    return elements
}

class JSet {
    constructor(iterable = null) {
        this._data = {} // Use a plain object as the underlying storage
        this.size = 0  // Maintain the size property
        this._counts = {} // Keep track of counts for each object

        if (iterable) {
            for (const item of iterable) {
                if (item === undefined || item === null) continue
                this.add(item)
            }
        }
    }

    add(value) {
        const key = JSON.stringify(value)  // Stringify the value to use as a key
        if (!this._data.hasOwnProperty(key)) {
            this._data[key] = value // Store the original value for iteration
            this.size++
            this._counts[key] = 1 // Initialize count to 1
            return this // For chaining, like the native Set
        } else {
            this._counts[key]++ // Increment the count
            return this // Value already exists
        }
    }

    clear() {
        this._data = {}
        this.size = 0
        this._counts = {}
    }

    delete(value) {
        const key = JSON.stringify(value)
        if (this._data.hasOwnProperty(key)) {
            delete this._data[key]
            this.size--
            delete this._counts[key] // Remove the count
            return true
        }
        return false
    }

    has(value) {
        const key = JSON.stringify(value)
        return this._data.hasOwnProperty(key)
    }

    forEach(callbackFn, thisArg = null) {
        for (const key in this._data) {
            if (this._data.hasOwnProperty(key)) {
                callbackFn.call(thisArg, this._data[key], this._data[key], this) // Similar to native Set's forEach arguments
            }
        }
    }

    * entries() {
        for (const key in this._data) {
            if (this._data.hasOwnProperty(key)) {
                yield [this._data[key], this._data[key]] // Sets have key and value the same
            }
        }
    }

    * keys() {
        for (const key in this._data) {
            if (this._data.hasOwnProperty(key)) {
                yield this._data[key] // Sets have key and value the same
            }
        }
    }

    * values() {
        for (const key in this._data) {
            if (this._data.hasOwnProperty(key)) {
                yield this._data[key]
            }
        }
    }

    [Symbol.iterator]() {
        return this.values()  // Default iterator is the values iterator
    }

    get [Symbol.toStringTag]() {
        return 'JSet' // Correct toStringTag
    }

    // Optional:  Support for `Set.prototype.constructor === JSet`
    static get [Symbol.species]() {
        return JSet
    }

    /**
     * Returns the number of times an object has been added to the set.
     *
     * @param {any} value The object to check.
     * @returns {number} The number of times the object has been added.  Returns 0 if the object is not in the set.
     */
    count(value) {
        const key = JSON.stringify(value)
        return this._counts[key] || 0
    }
}

class JMap {
    constructor(iterable = null) {
        this._data = {} // Use a plain object to store key-value pairs.  Keys will be stringified JSON.
        this.size = 0 // Keep track of the number of entries.

        if (iterable) {
            for (const [key, value] of iterable) {
                this.set(key, value)
            }
        }
    }

    set(key, value) {
        const stringKey = JSON.stringify(key) // Stringify the key for storage.

        if (!this._data.hasOwnProperty(stringKey)) {
            this.size++
        }

        this._data[stringKey] = value  //Store the value
        return this // For chaining
    }

    get(key) {
        const stringKey = JSON.stringify(key)
        return this._data.hasOwnProperty(stringKey) ? this._data[stringKey] : undefined
    }

    has(key) {
        const stringKey = JSON.stringify(key)
        return this._data.hasOwnProperty(stringKey)
    }

    delete(key) {
        const stringKey = JSON.stringify(key)
        if (this._data.hasOwnProperty(stringKey)) {
            delete this._data[stringKey]
            this.size--
            return true
        }
        return false
    }

    clear() {
        this._data = {}
        this.size = 0
    }

    forEach(callbackFn, thisArg = null) {
        for (const stringKey in this._data) {
            if (this._data.hasOwnProperty(stringKey)) {
                const key = JSON.parse(stringKey) // Parse the original key from JSON
                callbackFn.call(thisArg, this._data[stringKey], key, this)
            }
        }
    }

    * entries() {
        for (const stringKey in this._data) {
            if (this._data.hasOwnProperty(stringKey)) {
                const key = JSON.parse(stringKey) // Parse the original key from JSON
                yield [key, this._data[stringKey]]
            }
        }
    }

    * keys() {
        for (const stringKey in this._data) {
            if (this._data.hasOwnProperty(stringKey)) {
                const key = JSON.parse(stringKey)  // Parse the original key from JSON
                yield key
            }
        }
    }

    * values() {
        for (const stringKey in this._data) {
            if (this._data.hasOwnProperty(stringKey)) {
                yield this._data[stringKey]
            }
        }
    }

    [Symbol.iterator]() {
        return this.entries() // Default iterator is the entries iterator
    }

    get [Symbol.toStringTag]() {
        return 'JsonStringMap' // Correct toStringTag
    }

    static get [Symbol.species]() {
        return JsonStringMap
    }
}

function countFn(fn) {
    let count = 0
    while (fn()) {
        ++count
    }
    return count
}

class Wrap2D {
    constructor(data) {
        this.m = data.split('\n').map(line => line.split(''))
        this._r = this.m.length
        this._c = this.m[0].length
    }

    _(r, c) { return this.m[r % this._r][c % this._c] }

    set(r, c, val) { this.m[r % this._r][c % this._c] = val }

    rc([r, c]) { return this._(r, c) }

    setRc([r, c], val) { return this.set(r, c, val) }


    rowRcs(r) { return rng(this._c).map(c => [r, c]) }

    colRcs(c) { return rng(this._r).map(r => [r, c]) }
}

module.exports = {
    traceFn, memoize, Maze, Graph, PriorityQueue, rng, rng2, 
    sfy, ssfy, pad, parse2D, make2D, modulo,
    lengthFn, sizeFn, parseIntFn, parseFloatFn,
    segmentOverlap, isPointInPolygon, calculatePolygonArea,
    gcd, lcm, Comp, isInt, solveLinear, runBFS, JSet, JMap, countFn, Wrap2D
}
