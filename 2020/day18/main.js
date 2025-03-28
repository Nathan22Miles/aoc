const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2020/day/18
process.chdir('/Users/nmiles/source/aoc/2020/day18')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = '((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2'  // 13632
// data = testData
data = data.split('\n')

function tokenize(line) {
    let tokens = []
    for (let i = 0; i < line.length; i++) {
        let c = line[i]
        if (c === ' ') {
            continue
        }
        if (c === '(' || c === ')' || c === '+' || c === '*') {
            tokens.push(c)
        } else {
            tokens.push(parseInt(c))
        }
    }
    return tokens
}

function evaluate(tokens, i) { 
    let _tokens = []
    while (i<tokens.length && tokens[i] !== ')') {
        if (tokens[i] === '(') {
            let [tok, i2] = evaluate(tokens, i+1)
            _tokens.push(tok)
            i = i2
            continue
        }
        _tokens.push(tokens[i])
        ++i
    }

    while (_tokens.length > 1) {
        let a = _tokens.shift()
        let op = _tokens.shift()
        let b = _tokens.shift()
        let value = op === '+' ? a + b : a * b
        _tokens.unshift(value)
    }

    if (tokens[i] === ')') { ++i }
    return [_tokens[0], i]
}

log(data.map(expr => evaluate(tokenize(expr), 0)[0]).log().sum())

