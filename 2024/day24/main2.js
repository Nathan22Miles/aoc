const assert = require('assert')
const fs = require('fs')
const _ = console.log
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, Comp, isInt } = require('../../utils')

// https://adventofcode.com/2024/day/24

process.chdir('/Users/nmiles/source/aoc/2024/day24')

// let data = fs.readFileSync('test.txt', 'utf8')
let data = fs.readFileSync('data.txt', 'utf8')

let [_inputs, _circuits] = data.split('\n===\n')

Comp.parse(_inputs,
    /(?<id>\w+): (?<type>.)/)

Comp.parse(_circuits, 
    /(?<input1>\w+) (?<type>\w+) (?<input2>\w+) -> (?<id>\w+)/)

function isFixed(comp) {
    if (comp.id.startsWith('x')) return comp.id
    if (comp.id.startsWith('y')) return comp.id
    if (comp.type.length > 3) return comp.type
    return ''
}

function normalize(comp) {
    if (isFixed(comp)) return
    
    // normalize(Comp.get(comp.inputs[0]))
    // normalize(Comp.get(comp.inputs[1]))

    let [in1, in2] = comp.inputs

    let fixed1 = isFixed(Comp.get(in1))
    let fixed2 = isFixed(Comp.get(in2))

    if (fixed1 && fixed2) {
        comp.type = `${comp.type}(${fixed1},${fixed2})`
        comp.inputs = []
        return
    }
}

function depth(comp) {
    let [in1, in2] = comp.inputs ?? []
    if (!in1) return 0
    return Math.max(depth(Comp.get(in1)), depth(Comp.get(in2))) + 1
}

function sortByDepth(comp) {
    let [in1, in2] = comp.inputs
    if (!in1) return

    if (depth(Comp.get(in1)) > depth(Comp.get(in2))) {
        comp.inputs = [in2, in1]
    }
}

function findXors(z) {
    let comp = Comp.get(z)
    if (comp.type !== 'XOR') {
        log('not xor', z)
        return
    }

    let [in1] = comp.inputs
    let fixed1 = isFixed(Comp.get(in1))
    if (!fixed1) {
        log(z, 'not fixed', in1)
        return
    }

    let _z = fixed1.slice(5,7)
    if (z.slice(1) !== _z) {
        log(z, 'mismatch', _z)
        return
    }
}
    
Comp.comps().forEach(normalize)
Comp.comps().forEach(sortByDepth)

let zs = rng(46).map(x => `z${pad(x, 2, '0')}`)

zs.slice(1).forEach(findXors)

// gjc, gvm, qjj, qsb, wmp, z17, z26, z39

Comp.dump('z20')

