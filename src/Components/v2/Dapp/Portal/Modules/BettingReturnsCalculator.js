import Helper from '../../../Helper'

const constants = require('../../../Constants')
const helper = new Helper()

/**
 * Module to help calculate betting returns for spread, moneyline and totals bets
 */
class BettingReturnsCalculator {

    getMaxReturns = (oddsObj, choice, betAmount) => {
        let odds = this._getSelectedOdds(choice, oddsObj)
        return this._getWinnings(betAmount, odds)
    }

    getSpreadReturns = (amount, handicap, team1Points, team2Points, choice, odds) => {
        let spreadOutcome =
            this._getSpreadOutcome(amount, handicap, team1Points, team2Points,
                choice);
        if (spreadOutcome == constants.SPREAD_OUTCOME_WIN) {
            return this._getWinnings(amount, odds);
        } else if (spreadOutcome == constants.SPREAD_OUTCOME_HALF_WIN) {
            return this.getWinnings(amount / 2, odds);
        } else if (spreadOutcome == constants.SPREAD_OUTCOME_DRAW) {
            return 0;
        } else if (spreadOutcome == constants.SPREAD_OUTCOME_HALF_LOSS) {
            return 0;
        } else {
            return 0;
        }
    }

    _getSpreadOutcome = (amount, handicap, team1Points, team2Points, choice) => {
        let difference = (choice == constants.BET_CHOICE_TEAM1 ?
            (team1Points - team2Points) :
            (team2Points - team1Points));
        let adjustedDiff = difference * 100;
        if (difference < 0) {
            if (handicap <= 50) {
                return constants.SPREAD_OUTCOME_LOSS;
            }
            else {
                let diffSum = adjustedDiff + handicap;
                if (diffSum == - 25) {
                    return constants.SPREAD_OUTCOME_HALF_LOSS;
                }
                else if (diffSum == 0) {
                    return constants.SPREAD_OUTCOME_DRAW;
                }
                else if (diffSum == 25) {
                    return constants.SPREAD_OUTCOME_HALF_WIN;
                }
                else if (diffSum >= 50) {
                    return constants.SPREAD_OUTCOME_WIN;
                }
            }
        }
        else if (difference > 0) {
            if (handicap < 0) {
                if (handicap >= - 50) {
                    return constants.SPREAD_OUTCOME_WIN;
                }
                else {
                    let _diffSum = adjustedDiff + handicap;
                    if (_diffSum > 25) {
                        return constants.SPREAD_OUTCOME_WIN;
                    }
                    else if (_diffSum == 25) {
                        return constants.SPREAD_OUTCOME_HALF_WIN;
                    }
                    else if (_diffSum == 0) {
                        return constants.SPREAD_OUTCOME_DRAW;
                    }
                    else if (_diffSum == - 25) {
                        return constants.SPREAD_OUTCOME_HALF_LOSS;
                    }
                    else if (_diffSum < - 25) {
                        return constants.SPREAD_OUTCOME_LOSS;
                    }
                }
            }
            else {
                return constants.SPREAD_OUTCOME_WIN;
            }
        }
        else if (difference == 0 && choice == constants.BET_CHOICE_DRAW) {
            if (handicap <= 0) {
                if (handicap == - 25) {
                    return constants.SPREAD_OUTCOME_HALF_LOSS;
                }
                else if (handicap == 0) {
                    return constants.SPREAD_OUTCOME_DRAW;
                }
                else
                    return constants.SPREAD_OUTCOME_LOSS;
            }
            else {
                if (handicap == 25) {
                    return constants.SPREAD_OUTCOME_HALF_WIN;
                }
                else
                    return constants.SPREAD_OUTCOME_WIN;
            }
        }
        return constants.SPREAD_OUTCOME_LOSS;
    }

    _getSelectedOdds = (choice, oddsObj) => {
        let selectedOdds
        switch(choice) {
            case constants.BET_CHOICE_TEAM1:
                selectedOdds = oddsObj.team1
                break
            case constants.BET_CHOICE_TEAM2:
                selectedOdds = oddsObj.team2
                break
            case constants.BET_CHOICE_DRAW:
                selectedOdds = oddsObj.draw
                break
            case constants.BET_CHOICE_OVER:
                selectedOdds = oddsObj.over
                break
            case constants.BET_CHOICE_UNDER:
                selectedOdds = oddsObj.under
                break
        }
        return selectedOdds
    }

    _getWinnings = (amount, odds) => {
        console.log('_getWinnings', amount, odds)
        let absOdds = Math.abs(odds)

        if (odds < 0) {
            return amount / (absOdds / 100)
        } else if (odds > 0) {
            return amount * (absOdds / 100)
        } else
            return amount
    }

}

export default BettingReturnsCalculator