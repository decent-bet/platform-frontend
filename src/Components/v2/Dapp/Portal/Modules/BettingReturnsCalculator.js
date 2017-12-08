import Helper from '../../../Helper'

const constants = require('../../../Constants')
const helper = new Helper()

/**
 * Module to help calculate betting returns for spread, moneyline and totals bets
 */
class BettingReturnsCalculator {

    getBetReturns = (oddsObj) => {
        let betAmount = oddsObj.betAmount
        let selectedOdds = this._getSelectedOdds(oddsObj)
        console.log('getBetReturns', oddsObj, betAmount, selectedOdds)
        return this._getWinnings(betAmount, selectedOdds).toFixed(2)
    }

    _getSelectedOdds = (oddsObj) => {
        let selectedChoice = oddsObj.selectedChoice
        let selectedOdds
        switch(selectedChoice) {
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