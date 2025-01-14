
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo } = require('../../utils')

// https://adventofcode.com/2023/day/19

process.chdir('/Users/nmiles/source/aoc/2023/day19')

let myData = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// let data = testData
let data = myData

let parts = []
// ex: Consider the workflow 
let flows = new Map() // workflowName => [rule, ...]

function parsePart(part) {
    let parseIntFn = x => parseInt(x, 10)
    let [x, m, a, s] = part.split(/(\d+)/).odds().map(parseIntFn)
    return { x, m, a, s }
}

function parseRule(rule) {
    let [a, op, b, _1, target] = rule.split(/([<>:])/)
    if (op) return [a, op, parseInt(b, 10), target]
    return [a]
}

function parseData(data) {
    let [flowsData, partsData] = data.split('\n\n')
    let _parts = partsData.split('\n')
    parts = _parts.map(parsePart)

    let _flows = flowsData.split('\n')
    for (let flow of _flows) {
        let [flowName, rulesData] = flow.split(/\{|\}/)
        let rules = rulesData.split(',')
        flows.set(flowName, rules.map(parseRule))
    }
}

parseData(data)
flows.set('A', ['A'])
flows.set('R', ['R'])

compiled = new Map()  // flowName => Node

let nodes = 0

function isPathList(x) {
    return Array.isArray(x) && x.every(p => Array.isArray(p) && p.length > 0)
}

// for (path in allPaths(startNode, [], neighborsFn, new Set()))
function* allPaths(node, path, neighborsFn, visited) {
    if (visited.has(node)) return
    visited.add(node)
    path.push(node)

    let neighbors = neighborsFn(node)

    if (neighbors.length === 0) {
        yield path.slice()
    } else {
        for (let neighbor of neighbors[node]) {
            yield* allPaths(neighbor, path, neighbors, visited)
        }
    }

    path.pop()
    visited.delete(node)
}

class Node {
    // result: 'A' | 'R' | undefined
    // isTrue: Node | undefined
    // isFalse: Node | undefined
    constructor(rules) {
        ++nodes
        if (rules.length === 1) {
            let next = rules[0][0]
            if (next === 'A' || next === 'R') {
                this.result = next
                return
            }
            rules = flows.get(next)
        }
        
        this.test = rules[0].slice(0,3)
        
        let trueTaget = rules[0][3]
        if (!compiled.has(trueTaget)) {
            compiled.set(trueTaget, new Node(flows.get(trueTaget)))
        }
        
        this.isTrue = compiled.get(trueTaget)
        this.isFalse = new Node(rules.slice(1))
    }

    eval(part) {
        if (this.result) return this.result

        let [a, op, b] = this.test
        let val = part[a]
        let matched = op === '<' ? val < b : val > b
        if (matched) return this.isTrue.eval(part)
        return this.isFalse.eval(part)
    }

    static invertTest(test) {
        let [a, op, b] = test
        return [a, op === '<' ? '>=' : '<=', b]
    }

    static addTest(path, test) {
        let { x, m, a, s } = path
        let result = { x: x.slice(), m: m.slice(), a: a.slice(), s: s.slice() }

        for (let field of ['x', 'm', 'a', 's']) {
            let [a, op, b] = test
            if (a !== field) continue
            switch (op) {
                case '<':
                    result[field][1] = Math.min(result[field][1], b - 1)
                    break
                case '<=':
                    result[field][1] = Math.min(result[field][1], b)
                    break
                case '>':
                    result[field][0] = Math.max(result[field][0], b + 1)
                    break
                case '>=':
                    result[field][0] = Math.max(result[field][0], b)
                    break
                default:
                    assert(false)
            }
        }

        return result
    }

    // path = {x: [1,4000], m: [1,4000], a:[1,4000], s: [1,4000]}
    // returns: [path,...]
    successPaths(path) {
        if (this.result === 'A') return [path]
        if (this.result === 'R') return []

        let truePath = Node.addTest(path, this.test)
        let truePaths = this.isTrue.successPaths(truePath)

        let falsePath = Node.addTest(path, Node.invertTest(this.test))
        let falsePaths = this.isFalse.successPaths(falsePath)
        let result = [...truePaths, ...falsePaths]
        return result
    }
}

// return overlap range or null if none
function overlap([s1, e1], [s2, e2]) {
    let s = Math.max(s1, s2)
    let e = Math.min(e1, e2)
    if (s > e) return null
    return [s, e]
}

assert(overlap([1, 10], [5, 15]).toString() === [5, 10].toString())

// change a path into x/m/a/s sets
function setPath(path) {
    let { x, m, a, s } = path
    return [ new Set(rng(x[0], x[1]+1)), new Set(rng(m[0], m[1]+1)), new Set(rng(a[0], a[1]+1)), new Set(rng(s[0], s[1]+1)) ]
}

function combos(paths) {
    let count = 0

    for (let i=0; i<paths.length; ++i) {
        let p1 = paths[i]
        let _setPath = setPath(p1)

        for (let j=i-1; j >= 0; --j) {
            // remove any combinations that overlap with earlier paths
            let p2 = paths[j]
            let o1 = overlap(p1.x, p2.x)
            let o2 = overlap(p1.m, p2.m)
            let o3 = overlap(p1.a, p2.a)
            let o4 = overlap(p1.s, p2.s)

            // must overlap in all positions to be a duplicate
            // seems to never happen in my data, sigh
            if (o1 && o2 && o3 && o4) {
                o1.forEach(j => _setPath[0].delete(j))
                o2.forEach(j => _setPath[1].delete(j))
                o3.forEach(j => _setPath[2].delete(j))
                o4.forEach(j => _setPath[3].delete(j))
            }
        }

        count += _setPath[0].size * _setPath[1].size * _setPath[2].size * _setPath[3].size
    }

    return count
}

let node = new Node(flows.get('in'))

const paths = node.successPaths({ x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000], })
log(paths.toString())

let _combos = combos(paths)
log(_combos)

// test combinations: 167409079868000

