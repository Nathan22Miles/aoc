const assert = require('assert')
const fs = require('fs')
const log = console.log

const { traceFn, memoize, Maze, Graph, PriorityQueue,
    rng, rng2, sfy, ssfy, pad, parse2D, make2D, lengthFn, sizeFn, modulo,
    lcm, gcd, solveLinear, parseIntFn, Comp, JSet, JMap, countFn, Wrap2D } = require('../../utils')
const { clear } = require('console')

// Need to write generate flipV, flipH, transpose functions

// https://adventofcode.com/2020/day/22
process.chdir('/Users/nmiles/source/aoc/2020/day22')

// placing them on the bottom of their own deck so that the winner's card is above the other card.

let data = fs.readFileSync('data.txt', 'utf8')
let testData = fs.readFileSync('testData.txt', 'utf8')
// data = testData

// Before either player deals a card:
//
//      if (previous round in this game that had exactly the same cards) 
//          instantly ends in a win for player 1. 
//          (Previous rounds from other games are not considered)
//      else (new config)
//          each drawing the top card of their deck as normal.
//          If both players have at least as many cards remaining in their deck as the value of the card they just drew, 
//              the winner of the round is determined by playing a new game of Recursive Combat(see below).
//          else // at least one player must not have enough cards left in their deck to recurse; 
//              the winner of the round is the player with the higher - value card.

let decks = data.split('\n\n').map(x => x.split('\n').slice(1).map(Number))

function playGame(decks) {
    let round = 0
    let prev = new JMap()

    while (decks[0].length > 0 && decks[1].length > 0) {
        round++
        if (prev.get(decks)) {
            // debugger
            return [decks[0], []]
        }

        prev.set(decks, 1)

        let card1 = decks[0].shift()
        let card2 = decks[1].shift()

        let winner = 0
        if (decks[0].length >= card1 && decks[1].length >= card2) {
            let newDecks = [decks[0].slice(0, card1), decks[1].slice(0, card2)]
            let _decks = playGame(newDecks)
            winner = _decks[0].length > 0 ? 0 : 1
        } else {
            winner = card1 > card2 ? 0 : 1
        }
        if (winner === 0) {
            decks[0].push(card1, card2)
        } else {
            decks[1].push(card2, card1)
        }
    }

    return decks
}

function score(deck) {
    log(deck.map((x,i) => x * (deck.length - i)).sum())
}

let _decks = playGame(decks)
score(_decks[0].length ? _decks[0] : _decks[1])

