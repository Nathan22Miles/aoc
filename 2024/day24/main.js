const assert = require('assert')
const fs = require('fs')
const _ = console.log
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, Comp } = require('../../utils')

// https://adventofcode.com/2024/day/24

process.chdir('/Users/nmiles/source/aoc/2024/day24')

// let data = fs.readFileSync('test.txt', 'utf8')
let data = fs.readFileSync('data.txt', 'utf8')

let [_inputs, _circuits] = data.split('\n===\n')

Comp.parse(_inputs,
    /(?<id>\w+): (?<type>.)/)

Comp.parse(_circuits, 
    /(?<input1>\w+) (?<type>\w+) (?<input2>\w+) -> (?<id>\w+)/)

Comp.dump('z00')

function evalCir(output) {
    let { inputs, type } = Comp.get(output) ?? {}
    if (!type) return null

    if (type === '0') return 0
    if (type === '1') return 1

    let _in1 = evalCir(inputs[0])
    let _in2 = evalCir(inputs[1])
    if (type === 'AND') return _in1 & _in2
    if (type === 'OR') return _in1 | _in2
    if (type === 'XOR') return _in1 ^ _in2
    
    assert(false)
}

// evalCir('z00')

let zs = rng(100).map(x => `z${pad(x, 2, '0')}`)
let outputs = zs.map(z => evalCir(z)).filter(x => x !== null)
log(sfy(outputs), outputs.length)

result = 0
outputs.reverse().forEach(out => { 
    result = 2*result + out 
})

// result 18 692 813 373 449

log('done', result)
