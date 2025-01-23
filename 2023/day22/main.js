
const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd } = require('../../utils')

// https://adventofcode.com/2023/day/22

process.chdir('/Users/nmiles/source/aoc/2023/day22')

class Brick {
    constructor([x, y, z], [x2, y2, z2]) {
        // this.end1 = { x, y, z }
        // this.end2 = { x: x2, y: y2, z: z2 }

        this.zMin = Math.min(z, z2)
        this.zMax = Math.max(z, z2)

        assert(x === x2 || y === y2)

        this.base = []
        for (let _x of rng(Math.min(x, x2), Math.max(x, x2) + 1)) {
            for (let _y of rng(Math.min(y, y2), Math.max(y, y2) + 1)) {
                this.base.push(`${_x},${_y}`)
            }
        }

        this.supporters = []
        this.supports = []

        this.below = [] // bricks below this one with overlapping base
    }

    setZMin(_zMin) {
        assert(_zMin >= 1)
        let diff = this.zMax - this.zMin
        this.zMin = _zMin
        this.zMax = _zMin + diff
    }

    hasBaseOverlap(b2) {
        if (b2 === this) { return false }
        return this.base.some(xy => b2.base.includes(xy))
    }

    hasVerticalOverlap(b2) {
        //            b2.zMin  b2.zMax
        // this.zMin                    this.zMax
        return this.zMin <= b2.zMax && this.zMax >= b2.zMin
    }   

    setBelow(bricks) {
        let overlaps = bricks.filter(_b => this.hasBaseOverlap(_b))
        this.below = overlaps.filter(_b => _b.zMax < this.zMin)
    }

    // is b1 recursively below this
    isBelow = (b1) => {
        if (b1.below.includes(this)) { return true }
        return b1.below.some(_b => this.isBelow(_b))
    }

    static compare (b1, b2)  {
        let b1BelowB2 = b1.isBelow(b2)
        let b2BelowB1 = b2.isBelow(b1)
        log(b1, b2, b1BelowB2, b2BelowB1)
        if (b1BelowB2) { return -1 }
        if (b2BelowB1) { return 1 }
        return 0
    }

    isSupportFor(b2) {
        return b2.zMin === this.zMax + 1 && b2.hasBaseOverlap(this)
    }

    toString() {
        let { base, zMin, zMax } = this
        return sfy({ base, zMin, zMax })
    }
}

class Bricks {
    constructor(data) {
        this.bricks = data.split('\n').map(line => {
            let [x, y, z, x2, y2, z2] = line.match(/(\d+)/g).map(Number)
            return new Brick([x, y, z], [x2, y2, z2])
        })

        this.bricks.forEach(b => b.setBelow(this.bricks))
    }

    dropAll() {
        let { bricks } = this

        bricks.sort((b1, b2) => b1.zMin - b2.zMin)

        for (let b of bricks) {
            let max = b.below.map(x => x.zMax).max()
            if (max  === -Infinity) { max = 0 }

            b.setZMin(max + 1)
        }
        
        this.setSupports()

        this.validate()
    }

    setSupports() {
        let { bricks } = this

        for (let b1 of bricks) {
            for (let b2 of bricks) {
                if (b1.isSupportFor(b2)) { b2.supporters.push(b1) }
                if (b2.isSupportFor(b1)) { b2.supports.push(b1) }
            }
        }
    }

    validate() {
        let { bricks } = this

        // assert every brick is on ground or is supported
        assert(bricks.every(b => b.supporters.length > 0 || b.zMin === 1))

        // no bricks with overlapping bases overlap vertically
        for (let b1 of bricks) {
            for (let b2 of bricks) {
                if (b1 !== b2 && b1.hasBaseOverlap(b2)) {
                    assert(!b1.hasVerticalOverlap(b2))
                }
            }
        }
    }

    isSafe(brick) {
        return this.bricks.every(b => 
            b.supporters.length >= 2 || !b.supporters.includes(brick))
    }

    safeBricks() {
        return this.bricks.filter(b => this.isSafe(b))
    }

    static log(bricks) {
        log(bricks.map(b => b.toString()).join('\n'))
    }
}

function wouldFall(brick, bricks) {
    let fallen = new Set([brick])
    let somethingFell = true

    while (somethingFell) {
        somethingFell = false
        for (let _brick of bricks) {
            if (fallen.has(_brick)) { continue }
            if (_brick.zMin === 1) { continue }

            if (_brick.supporters.every(b => fallen.has(b))) {
                fallen.add(_brick)
                somethingFell = true
            }
        }
    }

    return fallen.size - 1 // subtract 1 for the original brick
}

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

let bricks = new Bricks(data)
bricks.dropAll()

// Bricks.log(bricks.safeBricks())
log(bricks.safeBricks().length)
// 495 is correct answer

log('total falls', bricks.bricks.map(b => wouldFall(b, bricks.bricks)).log().sum())