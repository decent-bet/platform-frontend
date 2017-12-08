/**
 * Created by user on 2/23/2017.
 */

export const
    /** Colors */
    COLOR_PRIMARY = '#292b2c',
    COLOR_PRIMARY_DARK = '#10121e',
    COLOR_PRIMARY_LIGHT = '#A49FCF',
    COLOR_ACCENT = '#ff4e64',
    COLOR_ACCENT_DARK = '#932d3a',
    COLOR_RED = "#ff4e64",
    COLOR_WHITE = '#FFFFFF',
    COLOR_WHITE_DARK = '#949494',
    COLOR_BLACK = '#000000',
    COLOR_GOLD = '#f2b45c',

    /** Dapp views */
    DAPP_VIEW_BALANCES = 0,
    DAPP_VIEW_CASINO = 1,
    DAPP_VIEW_PORTAL = 2,
    DAPP_VIEW_HOUSE = 3,
    DAPP_VIEW_SLOTS = 4,
    DAPP_VIEW_SLOTS_GAME = 5,

    PORTAL_PAGE_DISCOVER = 'discover',
    PORTAL_PAGE_SPORTSBOOK = 'sportsbook',
    PORTAL_PAGE_SLOTS = 'slots',

    SLOTS_CHANNEL_DEPOSIT_MIN = 100,
    SLOTS_CHANNEL_DEPOSIT_MAX = 1000,

    CHANNEL_STATUS_WAITING = 'Waiting',
    CHANNEL_STATUS_DEPOSITED = 'Deposited',
    CHANNEL_STATUS_ACTIVATED = 'Activated',
    CHANNEL_STATUS_FINALIZED = 'Finalized',

    FORMATTED_CHANNEL_STATUS_WAITING = 'Waiting for Deposit..',
    FORMATTED_CHANNEL_STATUS_DEPOSITED = 'User Deposited, Waiting for house activation..',
    FORMATTED_CHANNEL_STATUS_ACTIVATED = 'Ready to Play',
    FORMATTED_CHANNEL_STATUS_FINALIZED = 'Channel finalized and closed',

    /** As configured in Betting Provider Contract */
    ODDS_TYPE_SPREAD = 1,
    ODDS_TYPE_MONEYLINE = 2,
    ODDS_TYPE_TOTALS = 3,
    ODDS_TYPE_TEAM_TOTALS = 4,

    FORMATTED_ODDS_TYPE_SPREAD = 'Spread',
    FORMATTED_ODDS_TYPE_MONEYLINE = 'Moneyline',
    FORMATTED_ODDS_TYPE_TOTALS = 'Totals',
    FORMATTED_ODDS_TYPE_TEAM_TOTALS = 'Team Totals',

    BET_CHOICE_TEAM1 = 1,
    BET_CHOICE_DRAW= 2,
    BET_CHOICE_TEAM2 = 3,
    BET_CHOICE_OVER = 4,
    BET_CHOICE_UNDER = 5