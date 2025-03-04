const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap } = require('../../utils')

// https://adventofcode.com/2021/day/19
process.chdir('/Users/nmiles/source/aoc/2021/day19')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

function parseBeacons(str) {
    return str.split('\n').map(line => {
        let [x, y, z] = line.match(/-?\d+/g).map(Number)
        return [x, y, z]
    })
}

let scanners = data.split(/\s*---.*---\s*\n/).slice(1).map(parseBeacons)

function makeHash(a, b) {
    diff = a.sub(b).map(Math.abs)
    diff.sort((a, b) => a - b)
    return diff.join(',')
}

function makeHashes(beacons) {
    let hashes = new Set()
    beacons.pairs().forEach(([a, b]) => {
        hashes.add(makeHash(a, b))
    })
    return hashes
}

let hashes = scanners.map(makeHashes)

// from: https://github.com/womogenes/AoC-2021-Solutions/blob/main/day_19/day_19_p1.py
function rotate(point, i) {
    // https://i.imgur.com/Ff1vGT9.png
    let [x, y, z] = point
    return [
        [x, y, z], 
        [x, -y, -z], 
        [x, z, -y], 
        [x, -z, y],
        [-x, y, -z], 
        [-x, -y, z], 
        [-x, z, y], 
        [-x, -z, -y],
        
        [y, z, x], 
        [y, x, -z], 
        [y, -z, -x], 
        [y, -x, z],
        [-y, -z, x], 
        [-y, x, z], 
        [-y, z, -x], 
        [-y, -x, -z],
        
        [z, x, y], 
        [z, y, -x], 
        [z, -x, -y], 
        [z, -y, x],
        [-z, -x, y], 
        [-z, y, x], 
        [-z, x, -y], 
        [-z, -y, -x],
    ][i]
}

function diffKey(beacons) {
    let diffs = rng(beacons.length-1).map(i => beacons[i+1].sub(beacons[i]))
    return sfy(diffs)
}

// Change bi'th scanner to use same origin and rotation as ai'th scanner
function allign(ai, bi) { 
    let beaconsA = scanners[ai]
    let beaconsB = scanners[bi]
    let common = hashes[ai].and(hashes[bi])

    let commonA = beaconsA.filter((_, i) => 
        rng(beaconsA.length).some(
            j => common.has(makeHash(beaconsA[i], beaconsA[j]))))
    assert(commonA.length === 12)
    commonA.sort((a, b) => a.cmp(b))
    let commonAKey = diffKey(commonA)

    let commonB = beaconsB.filter((_, i) =>
        rng(beaconsB.length).some(
            j => common.has(makeHash(beaconsB[i], beaconsB[j]))))
    assert(commonB.length === 12)

    let matched = false
    let rotatedB

    let rot
    for (rot=0; rot<24; rot++) {
        rotatedB = commonB.map(point => rotate(point, rot))
        rotatedB.sort((a, b) => a.cmp(b))
        let rotatedKey = diffKey(rotatedB)
        if (rotatedKey === commonAKey) {
            matched = true
            break
        }
    }
    assert(matched)

    let diff = commonA[0].sub(rotatedB[0])

    let _beaconsB = beaconsB.map(point => rotate(point, rot))
    _beaconsB.forEach((point, i) => _beaconsB[i] = point.add(diff))
    _beaconsB.sort((a, b) => a.cmp(b))
    scanners[bi] = _beaconsB
}

// align(0, 24)

let commonScanners = new Map()
rng(scanners.length).pairs().forEach(([i, j]) => {
    let a = hashes[i]
    let b = hashes[j]
    let common = a.and(b)
    if (common.size === 66) {
        commonScanners.push(i, j)
        commonScanners.push(j, i)
    }
})

let aligned = new Set()
aligned.add(0)

function doAlignments(si) {
    let iscanners = commonScanners.get(si) ?? []
    for (let i of iscanners) {
        if (aligned.has(i)) continue
        allign(si, i)
        aligned.add(i)
        doAlignments(i)
    }
}

doAlignments(0)

assert(aligned.size === scanners.length)

let allBeacons = new Set()
scanners.forEach(beacons => beacons.forEach(point => allBeacons.add(sfy(point))))

log(allBeacons.size)