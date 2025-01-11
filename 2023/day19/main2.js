
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo } = require('../../utils')

// https://adventofcode.com/2023/day/19

process.chdir('/Users/nmiles/source/aoc/2023/day19')


let myData = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
let data = testData
// let data = myData

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

    // path = [test,...]
    // returns: [path,...]
    successPaths(path) {
        if (this.result === 'A') return [path]
        if (this.result === 'R') return []

        let truePaths = this.isTrue.successPaths([...path, this.test])
        let falsePaths = this.isFalse.successPaths([...path, Node.invertTest(this.test)])
        let result = [...truePaths, ...falsePaths]
        return result
    }
}

let node = new Node(flows.get('in'))

log(node.successPaths([]).toString())

// test combinations: 167409079868000

