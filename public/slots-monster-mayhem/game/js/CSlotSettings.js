function CSlotSettings() {

    this._init = function () {
        this._initSymbolSpriteSheets();
        this._initPaylines();
        this._initSymbolWin();
        this._initSymbolAnims();
        this._initSymbolsOccurence();
    };

    this._initSymbolSpriteSheets = function () {
        s_aSymbolData = new Array();
        for (var i = 1; i < NUM_SYMBOLS + 1; i++) {
            s_aSymbolData[i] = new createjs.SpriteSheet({
                images: [s_oSpriteLibrary.getSprite(`symbol_${i}_sprite`)],
                frames: {
                    width: SYMBOL_SIZE,
                    height: SYMBOL_SIZE,
                    regX: 0,
                    regY: 0
                },
                framerate: 30,
                count: 45,
                animations: {
                    static: 0,
                    breathing: [ 0, 43 ],
                    moving: 44
                }
            })
        }
    };

    this._initPaylines = function () {
        //STORE ALL INFO ABOUT PAYLINE COMBOS
        s_aPaylineCombo = new Array();

        s_aPaylineCombo[0] = [{row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}, {row: 1, col: 4}];
        s_aPaylineCombo[1] = [{row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}, {row: 0, col: 4}];
        s_aPaylineCombo[2] = [{row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 3}, {row: 2, col: 4}];
        s_aPaylineCombo[3] = [{row: 0, col: 0}, {row: 1, col: 1}, {row: 2, col: 2}, {row: 1, col: 3}, {row: 0, col: 4}];
        s_aPaylineCombo[4] = [{row: 2, col: 0}, {row: 1, col: 1}, {row: 0, col: 2}, {row: 1, col: 3}, {row: 2, col: 4}];
        s_aPaylineCombo[5] = [{row: 1, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3}, {row: 1, col: 4}];
        s_aPaylineCombo[6] = [{row: 1, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 3}, {row: 1, col: 4}];
        s_aPaylineCombo[7] = [{row: 0, col: 0}, {row: 0, col: 1}, {row: 1, col: 2}, {row: 2, col: 3}, {row: 2, col: 4}];
        s_aPaylineCombo[8] = [{row: 2, col: 0}, {row: 2, col: 1}, {row: 1, col: 2}, {row: 0, col: 3}, {row: 0, col: 4}];
        s_aPaylineCombo[9] = [{row: 1, col: 0}, {row: 2, col: 1}, {row: 1, col: 2}, {row: 0, col: 3}, {row: 1, col: 4}];
        s_aPaylineCombo[10] = [{row: 2, col: 0}, {row: 0, col: 1}, {row: 1, col: 2}, {row: 2, col: 3}, {
            row: 1,
            col: 4
        }];
        s_aPaylineCombo[11] = [{row: 0, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}, {
            row: 0,
            col: 4
        }];
        s_aPaylineCombo[12] = [{row: 2, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}, {
            row: 2,
            col: 4
        }];
        s_aPaylineCombo[13] = [{row: 0, col: 0}, {row: 1, col: 1}, {row: 0, col: 2}, {row: 1, col: 3}, {
            row: 0,
            col: 4
        }];
        s_aPaylineCombo[14] = [{row: 2, col: 0}, {row: 1, col: 1}, {row: 2, col: 2}, {row: 1, col: 3}, {
            row: 2,
            col: 4
        }];
        s_aPaylineCombo[15] = [{row: 1, col: 0}, {row: 1, col: 1}, {row: 0, col: 2}, {row: 1, col: 3}, {
            row: 1,
            col: 4
        }];
        s_aPaylineCombo[16] = [{row: 1, col: 0}, {row: 1, col: 1}, {row: 2, col: 2}, {row: 1, col: 3}, {
            row: 1,
            col: 4
        }];
        s_aPaylineCombo[17] = [{row: 0, col: 0}, {row: 0, col: 1}, {row: 2, col: 2}, {row: 0, col: 3}, {
            row: 0,
            col: 4
        }];
        s_aPaylineCombo[18] = [{row: 2, col: 0}, {row: 2, col: 1}, {row: 0, col: 2}, {row: 2, col: 3}, {
            row: 2,
            col: 4
        }];
        s_aPaylineCombo[19] = [{row: 0, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 3}, {
            row: 0,
            col: 4
        }];

    };

    this._getPayTable = function () {
        s_payTables = new Array();

        s_payTables[0] = [0, 0, 2, 4, 6];
        s_payTables[1] = [0, 0, 4, 8, 12];
        s_payTables[2] = [0, 0, 8, 16, 24];
        s_payTables[3] = [0, 0, 12, 24, 36];
        s_payTables[4] = [0, 0, 20, 40, 60];
        s_payTables[5] = [0, 0, 50, 100, 150];
        s_payTables[6] = [0, 0, 100, 200, 300];
    }

    this._initSymbolWin = function () {
        s_aSymbolWin = new Array();

        s_aSymbolWin[0] = PAYTABLE_VALUES[0];
        s_aSymbolWin[1] = PAYTABLE_VALUES[1];
        s_aSymbolWin[2] = PAYTABLE_VALUES[2];
        s_aSymbolWin[3] = PAYTABLE_VALUES[3];
        s_aSymbolWin[4] = PAYTABLE_VALUES[4];
        s_aSymbolWin[5] = PAYTABLE_VALUES[5];
        s_aSymbolWin[6] = PAYTABLE_VALUES[6];
    };

    this.updateSymbolWin = function (betSize) {
        s_aSymbolWin = new Array();

        // Make a copy of paytable
        var paytable = JSON.parse(JSON.stringify(PAYTABLE_VALUES))

        s_aSymbolWin[0] = paytable[0];
        s_aSymbolWin[1] = paytable[1];
        s_aSymbolWin[2] = paytable[2];
        s_aSymbolWin[3] = paytable[3];
        s_aSymbolWin[4] = paytable[4];
        s_aSymbolWin[5] = paytable[5];
        s_aSymbolWin[6] = paytable[6];

        for (var i = 0; i < s_aSymbolWin.length; i++) {
            for (var j = 0; j < s_aSymbolWin[i].length; j++) {
                s_aSymbolWin[i][j] *= betSize;
            }
        }

        console.log('updateSymbolWin: ' + JSON.stringify(s_aSymbolWin) + ', ' + betSize)
    }

    this._initSymbolAnims = function () {
        s_aSymbolAnims = [];
        for (let i = 0; i < NUM_SYMBOLS; i++) {
            const opts = {
                framerate: 30,
                count: 45,
                images: [s_oSpriteLibrary.getSprite(`symbol_${i+1}_anim`)],
                frames: {
                    width: SYMBOL_SIZE,
                    height: SYMBOL_SIZE,
                    regX: 0,
                    regY: 0
                },
                animations: {
                    static: 0,
                    anim: [0, 44]
                }
            }
            s_aSymbolAnims[i] = new createjs.SpriteSheet(opts)
        }
    };

    this._initSymbolsOccurence = function () {
        s_aRandSymbols = new Array();

        var i;
        //OCCURENCE FOR SYMBOL 1
        for (i = 0; i < 1; i++) {
            s_aRandSymbols.push(1);
        }

        //OCCURENCE FOR SYMBOL 2
        for (i = 0; i < 2; i++) {
            s_aRandSymbols.push(2);
        }

        //OCCURENCE FOR SYMBOL 3
        for (i = 0; i < 3; i++) {
            s_aRandSymbols.push(3);
        }

        //OCCURENCE FOR SYMBOL 4
        for (i = 0; i < 4; i++) {
            s_aRandSymbols.push(4);
        }

        //OCCURENCE FOR SYMBOL 5
        for (i = 0; i < 4; i++) {
            s_aRandSymbols.push(5);
        }

        //OCCURENCE FOR SYMBOL 6
        for (i = 0; i < 6; i++) {
            s_aRandSymbols.push(6);
        }

        //OCCURENCE FOR SYMBOL 7
        for (i = 0; i < 6; i++) {
            s_aRandSymbols.push(7);
        }

        //OCCURENCE FOR SYMBOL WILD
        for (i = 0; i < 1; i++) {
            s_aRandSymbols.push(8);
        }
    };

    this._init();
}

var s_payTables;
var s_aSymbolData;
var s_aPaylineCombo;
var s_aSymbolWin;
var s_aSymbolAnims;
var s_aRandSymbols;