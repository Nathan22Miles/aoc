const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')
const { resourceLimits } = require('worker_threads')

// https://adventofcode.com/2021/day/22
process.chdir('/Users/nmiles/source/aoc/2021/day22')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

function parse(line) {
    let [x0,x1,y0,y1,z0,z1] = line.match(/-?\d+/g).map(Number)
    let cmd = line.split(' ')[0]
    return {cmd, xr: [x0, x1], yr: [y0, y1], zr: [z0, z1]}
}

let cmds = data.split('\n').map(parse)

class BitArray {
    constructor(n) {
        this.n = n
        this.bits = new Uint8Array(Math.ceil(n / 8))
    }

    set(value, i) {
        let byte = Math.floor(i / 8)
        let bit = i % 8
        if (value) {
            this.bits[byte] |= (1 << bit)
        } else {
            this.bits[byte] &= ~(1 << bit)
        }
    }

    setRange(value, start, end) {
        for (let i = start; i <= end; i++) {
            this.set(value, i)
        }
    }

    get(i) {
        let byte = Math.floor(i / 8)
        let bit = i % 8
        return (this.bits[byte] & (1 << bit)) !== 0
    }

    count() {
        let _count = 0
        for (let i=0; i<this.n; i++) {
            if (this.get(i)) {
                _count++
            }
        }
        return _count 
    }

    toString() {
        return this.bits.map(byte => byte.toString(2).padStart(8, '0')).join('')
    }
}

// let ba = new BitArray(100)
// ba.setRange(true, 10, 20)
// ba.setRange(false, 15, 25)
// assert.equal(ba.count(), 5)

function limit([a, b], [c, d]) {
    return [Math.max(a, c), Math.min(b, d)]
}

function len([a, b]) {
    return b - a + 1
}

class BitArray3 {
    constructor(zr, yr, xr) {
        this.zr = zr
        this.yr = yr
        this.xr = xr
        this.xyz0 = [zr[0], yr[0], xr[0]]
        this.size = [len(zr), len(yr), len(xr)]
        this.bits = new BitArray((zr[1]-zr[0]+1) * (yr[1]-yr[0]+1) * (xr[1]-xr[0]+1))
    }

    index(z, y, x) {
        let [z0, y0, x0] = this.xyz0
        let [zsize, ysize, xsize] = this.size
        return (z-z0)*zsize*ysize + (y-y0)*ysize + x - x0
    }

    setRange(value, _zr, _yr, _xr) {
        let [z0, z1] = limit(_zr, this.zr)
        let [y0, y1] = limit(_yr, this.yr)
        let [x0, x1] = limit(_xr, this.xr)

        for (let z = z0; z <= z1; z++) {
            for (let y = y0; y <= y1; y++) {
                let start = this.index(z, y, x0)
                let end = start + x1 - x0
                this.bits.setRange(value, start, end)
            }
        }
    }
}

let ba = new BitArray3([-50, 50], [-50, 50], [-50, 50])
for (let cmd of cmds) {
    if (cmd.cmd === 'on') {
        ba.setRange(true, cmd.zr, cmd.yr, cmd.xr)
    } else  {
        ba.setRange(false, cmd.zr, cmd.yr, cmd.xr)
    } 
}

log(ba.bits.count())