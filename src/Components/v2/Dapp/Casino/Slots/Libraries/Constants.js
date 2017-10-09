/**
 * Created by user on 10/5/2017.
 */

const symbolA = 1, symbolB = 2, symbolC = 3, symbolD = 4, symbolE = 5, symbolF = 6, symbolG = 7

export default class SlotsConstants {

    NUMBER_OF_LINES = 5
    NUMBER_OF_REELS = 5

    reels = [
        [7, 2, 2, 1, 5, 3, 5, 3, 2, 2, 3, 4, 2, 5, 1, 1, 6, 4, 1, 5, 3], //0
        [1, 1, 3, 3, 5, 3, 5, 1, 2, 2, 4, 1, 3, 4, 3, 2, 2, 6, 6, 3, 7], //1
        [4, 2, 7, 3, 2, 6, 1, 4, 3, 1, 5, 1, 1, 4, 4, 1, 5, 2, 2, 1, 1], //2
        [1, 1, 5, 1, 2, 7, 4, 2, 1, 3, 2, 2, 3, 1, 1, 2, 6, 2, 6, 3, 5], //3
        [1, 4, 1, 1, 2, 4, 1, 3, 6, 2, 7, 2, 4, 1, 3, 1, 3, 6, 1, 2, 5], //4
    ]

    paytable = {}

    constructor() {
        this.paytable[symbolA] = 10
        this.paytable[symbolB] = 20
        this.paytable[symbolC] = 40
        this.paytable[symbolD] = 50
        this.paytable[symbolE] = 75
        this.paytable[symbolF] = 150
        this.paytable[symbolG] = 300
    }

}