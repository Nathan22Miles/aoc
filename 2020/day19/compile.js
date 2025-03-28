// This did not work. Parsimmon did not find all the valid messages. 
// Not sure if this is my bug or a limitation on the parser.

const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// https://adventofcode.com/2020/day/19
process.chdir('/Users/nmiles/source/aoc/2020/day19')

let data = fs.readFileSync('data2.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
data = testData

let [_rules, msgs] = data.split('\n\n')

function parse(line) {
    const [id, rule] = line.split(': ')
    if (rule.startsWith('"')) {
        return [id, rule[1]]
    }
    const ors = rule.split(' | ')
    const ands = ors.map(or => or.split(' '))
    return [id, ands]
}

function compileAnds(ands) { 
    let _ands = ands.map(a => 'p' + a)
    return `P.seq(${_ands.join(',')})` 
}

function compileOrs(ors) { 
    let _ors = ors.map(compileAnds)
    if (_ors.length === 1) { return _ors[0] }
    return `P.alt(${_ors.join(',')})` 
}

function compile(id, rule) {
    if (typeof rule === 'string') { return `let p${id} = P.regex(/${rule}/)\n` }

    return `let p${id} = P.lazy(() => ${compileOrs(rule)});\n`
}

let source = _rules.split('\n').map(line => {
                    const [id, rule] = parse(line)
                    return compile(id, rule)
            })

let header = `const P = require('parsimmon')
const fs = require('fs')
const log = console.log

process.chdir('/Users/nmiles/source/aoc/2020/day19')

let data = fs.readFileSync('testData.txt', 'utf8')
let [_rules, msgs] = data.split('\\n\\n')\n\n`

let trailer = `function parse(msg) {
    try {
        p0.tryParse(msg)
        return 1
    }
    catch (e) {
        return 0
    }
}

log(msgs.split('\\n').map(parse).filter(x => x==1).length)`

fs.writeFileSync('main2.js', header + source.join('') + trailer)

// 235 is too low
