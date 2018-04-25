export const
    /** Colors */
    COLOR_PRIMARY = '#292b2c',
    COLOR_PRIMARY_DARK = '#10121e',
    COLOR_PRIMARY_DARK_TRANSLUCENT = 'rgba(16, 18, 30, 0.95)',
    COLOR_PRIMARY_LIGHT = '#A49FCF',
    COLOR_ACCENT = '#ff4e64',
    COLOR_ACCENT_DARK = '#932d3a',
    COLOR_RED = "#ff4e64",
    COLOR_WHITE = '#FFFFFF',
    COLOR_GREY = '#bdc1c2',
    COLOR_WHITE_DARK = '#949494',
    COLOR_BLACK = '#000000',
    COLOR_GOLD = '#f2b45c',
    COLOR_GOLD_DARK = '#bc842e',
    COLOR_LIGHT_GREY = '#aaa',
    COLOR_BLUE = '#5cbef2',
    COLOR_TRANSPARENT = 'rgba(0, 0, 0, 0)',

    /** Views */
    VIEW_BALANCES = '/balances',
    VIEW_CASINO = '/',
    VIEW_PORTAL = '/portal',
    VIEW_HOUSE = '/house',
    VIEW_SLOTS = '/slots/',
    VIEW_SLOTS_GAME = '/slots/:id', // Parameter in the route
    VIEW_LOGIN = '/login',

    VIEW_DEFAULT = VIEW_CASINO,

    PROVIDER_INFURA = 'wss://rinkeby.infura.io/_ws',
    PROVIDER_DBET = 'wss://ws-rinkeby.decent.bet',
    PROVIDER_LOCAL = 'ws://localhost:8545',
    KEY_GETH_PROVIDER = 'gethProvider',

    PORTAL_PAGE_DISCOVER = 'discover',
    PORTAL_PAGE_SPORTSBOOK = 'sportsbook',
    PORTAL_PAGE_SLOTS = 'slots',

    SLOTS_CHANNEL_DEPOSIT_MIN = 5,
    SLOTS_CHANNEL_DEPOSIT_MAX = 5000,

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
    BET_CHOICE_UNDER = 5,

    SPREAD_OUTCOME_WIN = 1,
    SPREAD_OUTCOME_DRAW = 2,
    SPREAD_OUTCOME_LOSS = 3,
    SPREAD_OUTCOME_HALF_WIN = 4,
    SPREAD_OUTCOME_HALF_LOSS = 5
