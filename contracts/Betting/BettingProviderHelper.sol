pragma solidity ^0.4.11;

import '../Libraries/SafeMath.sol';

contract BettingProviderHelper is SafeMath {

    uint constant SPREAD_OUTCOME_WIN = 1;

    uint constant SPREAD_OUTCOME_DRAW = 2;

    uint constant SPREAD_OUTCOME_LOSS = 3;

    uint constant SPREAD_OUTCOME_HALF_WIN = 4;

    uint constant SPREAD_OUTCOME_HALF_LOSS = 5;

    uint constant BET_CHOICE_TEAM1 = 1;

    uint constant BET_CHOICE_DRAW = 2;

    uint constant BET_CHOICE_TEAM2 = 3;

    function getSpreadOutcome(uint amount, int handicap, uint team1Points,
    uint team2Points, uint choice) constant returns (uint) {
        // Handicap - Multiplied by 100
        // Hcp  ->  0.5 (50)
        // Team 1 -> -180
        // Team 2 ->  157
        if (handicap % 25 != 0) throw;
        int difference = (choice == BET_CHOICE_TEAM1 ?
        (int) (team1Points - team2Points) :
        (int) (team2Points - team1Points));
        int adjustedDiff = difference * 100;
        if (difference < 0) {
            if (handicap <= 50) {
                return SPREAD_OUTCOME_LOSS;
            }
            else {
                int diffSum = adjustedDiff + handicap;
                if (diffSum == - 25) {
                    return SPREAD_OUTCOME_HALF_LOSS;
                }
                else if (diffSum == 0) {
                    return SPREAD_OUTCOME_DRAW;
                }
                else if (diffSum == 25) {
                    return SPREAD_OUTCOME_HALF_WIN;
                }
                else if (diffSum >= 50) {
                    return SPREAD_OUTCOME_WIN;
                }
            }
        }
        else if (difference > 0) {
            if (handicap < 0) {
                if (handicap >= - 50) {
                    return SPREAD_OUTCOME_WIN;
                }
                else {
                    int _diffSum = adjustedDiff + handicap;
                    if (_diffSum > 25) {
                        return SPREAD_OUTCOME_WIN;
                    }
                    else if (_diffSum == 25) {
                        return SPREAD_OUTCOME_HALF_WIN;
                    }
                    else if (_diffSum == 0) {
                        return SPREAD_OUTCOME_DRAW;
                    }
                    else if (_diffSum == - 25) {
                        return SPREAD_OUTCOME_HALF_LOSS;
                    }
                    else if (_diffSum < - 25) {
                        return SPREAD_OUTCOME_LOSS;
                    }
                }
            }
            else {
                return SPREAD_OUTCOME_WIN;
            }
        }
        else if (difference == 0 && choice == BET_CHOICE_DRAW) {
            if (handicap <= 0) {
                if (handicap == - 25) {
                    return SPREAD_OUTCOME_HALF_LOSS;
                }
                else if (handicap == 0) {
                    return SPREAD_OUTCOME_DRAW;
                }
                else
                return SPREAD_OUTCOME_LOSS;
            }
            else {
                if (handicap == 25) {
                    return SPREAD_OUTCOME_HALF_WIN;
                }
                else
                return SPREAD_OUTCOME_WIN;
            }
        }
        return SPREAD_OUTCOME_LOSS;
    }

    function getSpreadReturns(uint amount, int handicap,
    uint team1Points, uint team2Points, uint choice, int odds)
    constant returns (uint) {
        uint spreadOutcome =
        getSpreadOutcome(amount, handicap, team1Points, team2Points,
        choice);
        if (spreadOutcome == SPREAD_OUTCOME_WIN) {
            return amount + getWinnings(amount, odds);
        }
        else if (spreadOutcome == SPREAD_OUTCOME_HALF_WIN) {
            return amount + getWinnings(amount / 2, odds);
        }
        else if (spreadOutcome == SPREAD_OUTCOME_DRAW) {
            return amount;
        }
        else if (spreadOutcome == SPREAD_OUTCOME_HALF_LOSS) {
            return amount / 2;
        }
        else {
            return 0;
        }
    }

    function getWinnings(uint amount, int odds) constant returns (uint) {
        uint absOdds = (odds < 0) ? ((uint) (odds * -1)) : ((uint) (odds));
        if(odds < 0) {
            // Amount / (odds/100)
            return safeDiv(safeMul(amount, 100), absOdds);
        } else if(odds > 0) {
            // Amount * (odds/100)
            return safeDiv(safeMul(amount, absOdds), 100);
        } else if(odds == 0) {
            return amount;
        }
        return 0;
    }

}