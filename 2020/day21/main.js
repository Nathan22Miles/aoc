const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// Need to write generate flipV, flipH, transpose functions

// https://adventofcode.com/2020/day/21
process.chdir('/Users/nmiles/source/aoc/2020/day21')

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

function parseData(line) {
    const [ingredients, allergens] = line.split(' (contains ')
    const ing = new Set(ingredients.split(' '))
    const alg = new Set(allergens.slice(0, -1).split(', '))
    return { ing, alg }
}

let foods = data.split('\n').map(parseData)

// Determine which ingredients can't possibly contain any of the allergens in any food in your list. 
// In the above example, none of the ingredients kfcds, nhms, sbzzf, or trh can contain an allergen. 
// Counting the number of times any of these ingredients appear in any ingredients list 

let algToIngs = new Map()

for (let {ing, alg} of foods) {
    for (let a of alg) {
        if (!algToIngs.has(a)) {
            algToIngs.set(a, ing)
            continue
        }
        const _ing = algToIngs.get(a)
        algToIngs.set(a, _ing.and(ing))
    }
}

let algs = [...algToIngs.keys()]
let ings = new Set(algs.map(a => algToIngs.get(a)).flatMap(_ings => [..._ings]))

function safeIngs(food) {
    const {ing} = food
    return [...ing].filter(i => !ings.has(i))
}

log(foods.map(food => safeIngs(food).length).sum())