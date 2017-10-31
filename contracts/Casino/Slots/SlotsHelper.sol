pragma solidity ^0.4.0;

import '../../Libraries/SafeMath.sol';
import '../../Libraries/Utils.sol';

contract SlotsHelper is SafeMath, Utils {

    bool public isSlotsHelper = true;

    // Number of reels
    uint constant NUMBER_OF_REELS = 5;

    // Number of lines
    uint constant NUMBER_OF_LINES = 5;

    // Slot reels
    uint8[21][5] reels;

    // Paytables for different slot symbols
    // (symbol => (multiplier => payout))
    // For example, for 3xA -> (symbolA => (3 => payout))
    mapping (uint => uint) paytable;

    // Slot Symbols
    uint8 symbolA = 1;

    uint8 symbolB = 2;

    uint8 symbolC = 3;

    uint8 symbolD = 4;

    uint8 symbolE = 5;

    uint8 symbolF = 6;

    uint8 symbolG = 7;

    function SlotsHelper(){
        initReels();
        initPayTable();
    }

    // Initializes the paytable to verify reward calculations
    function initPayTable() private {
        // 3x Multiplier
        paytable[symbolA] = 10;
        paytable[symbolB] = 20;
        paytable[symbolC] = 40;
        paytable[symbolD] = 50;
        paytable[symbolE] = 75;
        paytable[symbolF] = 150;
        paytable[symbolG] = 300;
    }

    function initReels() private {
        reels[0] = [7, 2, 2, 1, 5, 3, 5, 3, 2, 2, 3, 4, 2, 5, 1, 1, 6, 4, 1, 5, 3];
        reels[1] = [1, 1, 3, 3, 5, 3, 5, 1, 2, 2, 4, 1, 3, 4, 3, 2, 2, 6, 6, 3, 7];
        reels[2] = [4, 2, 7, 3, 2, 6, 1, 4, 3, 1, 5, 1, 1, 4, 4, 1, 5, 2, 2, 1, 1];
        reels[3] = [1, 1, 5, 1, 2, 7, 4, 2, 1, 3, 2, 2, 3, 1, 1, 2, 6, 2, 6, 3, 5];
        reels[4] = [1, 4, 1, 1, 2, 4, 1, 3, 6, 2, 7, 2, 4, 1, 3, 1, 3, 6, 1, 2, 5];
    }

    // Converts a string reel to a uint array
    // Example string reel = '0,1,2,3,4'
    function convertReelToArray(string reel) returns (uint[5]){
        uint[5] memory reelArray;
        string memory temp = '';
        uint8 iterator = 0;
        // Example _result: [12,4,5,6,7]
        for (uint8 i = 0; i < strLen(reel); i++) {
            string memory char = getCharAt(reel, i);
            if (!strCompare(char, ',')) {
                temp = strConcat(temp, char);
            } else {
                reelArray[iterator++] = parseInt(temp);
                temp = '';
            }
        }
        reelArray[iterator] = parseInt(temp);
        return reelArray;
    }

    function getTotalReward(uint betSize, uint[5] reelArray) returns (uint) {
        uint totalReward = 0;
        uint adjustedBetSize = safeDiv(betSize, 1 ether);
        for (uint8 i = 0; i < adjustedBetSize; i++) { //300k gas
            totalReward = safeAdd(totalReward, getLineRewardMultiplier(getLine(i, reelArray)));
        }
        totalReward = safeMul(totalReward, 1 ether);
        return totalReward;
    }

    // Checks if a line is a winning line and returns the reward multiplier
    //uint8[NUMBER_OF_REELS] line
    function getLineRewardMultiplier(uint[5] line) internal returns (uint) {
        uint8 repetitions = 0;
        uint rewardMultiplier = 0;
        for (uint8 i = 1; i <= NUMBER_OF_REELS; i++) {
            if (line[i] == line[i - 1]) {
                repetitions++;
            }
            else {
                break;
            }
        }
        if (repetitions >= 3) {
            rewardMultiplier = safeMul(paytable[line[0]], safeSub(repetitions, 2));
        }
        return rewardMultiplier;
    }

    // Returns line for an index
    // uint8[NUMBER_OF_REELS]
    function getLine(uint8 lineIndex, uint[5] reelArray) internal returns (uint[5]) {
        // Example [0,1,2,3,20]

        // Top = [20,0,1,2,19]
        // Middle = [0,1,2,3,20]
        // Bottom = [1,2,3,4,0]
        // Top Left - Bottom Center - Top Right = [20, 1, 3, 3, 19]
        // Bottom Left - Top Center - Bottom Right = [1, 1, 1, 3, 0]
        uint8 i = 0;
        uint[5] memory line;
        if (lineIndex == 0) {
            // Middle Line
            for (i = 0; i < NUMBER_OF_REELS; i++) {
                line[i] = getSymbol(i, (int) (reelArray[i]));
            }
        }
        else if (lineIndex == 1) {
            // Top Line
            for (i = 0; i < NUMBER_OF_REELS; i++) {
                line[i] = getSymbol(i, (int) (reelArray[i] - 1));
            }
        }
        else if (lineIndex == 2) {
            // Bottom Line
            for (i = 0; i < NUMBER_OF_REELS; i++) {
                line[i] = getSymbol(i, (int) (reelArray[i] + 1));
            }
        }
        else if (lineIndex == 3) {
            // Top left to Bottom right to Top right
            for (i = 0; i < NUMBER_OF_REELS; i++) {
                if (i == 0 || i == 4)
                line[i] = getSymbol(i, (int) (reelArray[i] - 1));
                else if (i == 2)
                line[i] = getSymbol(i, (int) (reelArray[i] + 1));
                else
                line[i] = getSymbol(i, (int) (reelArray[i]));
            }
        }
        else if (lineIndex == 4) {
            // Bottom left to Top right to Bottom right
            for (i = 0; i < NUMBER_OF_REELS; i++) {
                if (i == 0 || i == 4)
                line[i] = getSymbol(i, (int) (reelArray[i] + 1));
                else if (i == 2)
                line[i] = getSymbol(i, (int) (reelArray[i] - 1));
                else
                line[i] = getSymbol(i, (int) (reelArray[i]));
            }
        }
        else
        throw;
        return line;
    }

    // Returns the symbol for a reel at a position
    function getSymbol(uint8 reel, int position) internal returns (uint8) {
        if (position == - 1) position = 20;
        else if (position == 21) position = 0;
        // If position is 21, return 0

        return reels[reel][(uint) (position)];
    }

}
