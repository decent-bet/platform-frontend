# House

The house is initiated with the address of the DecentBetToken contract.

At the start, the house session begins with a 0 session which needs to be initiated by calling beginNextSession().

If the house session is 0 and does not have a valid startTime (i.e is 0), it sets the startTime as **now** and the endTime as **now + 2 weeks**.

This makes the first session last for 2 weeks of which the first week is meant for credit buying and the second week would be for
allocating and depositing tokens to house offerings.

At the end of the 2 weeks allotted for session 0, the house can now call beginNextSession() and start session 1
provided it has allocated a % of tokens to all house offerings AND deposited the token allocation to each of the house offerings.

Until the house has satisfied both the conditions, the next session would not begin.

If both conditions are satisfied, the next session begins and all house offerings are now updated to the next session.
The session lasts for 12 weeks of which the 11th week acts as a credit buying period for the next session and the 12th week 
is meant for the house to allocate and deposit tokens to house offerings for the next week.

Each house offering keeps their own balances for each session to ensure all funds and profits generated can be kept track of individually and
as a whole for the house for eventual profit distribution at the end of a session.

At the 11th week of the session, users are now prompted to purchase credits for the next session. After this, during the 12th week
the house can allocate and deposit tokens to all house offerings after which the house can move on to the next session.

2 days after the start of the next session, the house can withdraw previous session tokens from all house offerings. 
4 days after the start of the next session, users can liquidate credits from the previous session.
This's to ensure all games/bets from previous sessions have been completed. 

At this point in time the lottery winner can also be picked by the house contract. Once a lottery winner
has been picked, the winner will be picked by calling pickLotteryWinner() which uses oraclize to pick a random number
between 1 and 1000000. The random number returned by oraclize is then fit into a range from 0 to the number of lottery tickets
that have been distributed choosing a fair winner in the process.

# Sports Oracles

Sports oracles are not house offerings and can be setup independently. 
The initial sports oracle on the Decent.bet platform will be made for sole use by the Decent.bet BettingProvider.
Which means that it will not be charged by the house for being registered on the platform.

In the future, sports oracles will be forced to pay a fee for registering with the Decent.bet house and being
a part of the platform.

The purpose of a sports oracle is to provide games and their outcomes to betting providers. 
If a betting provider would like to push a game to their contract and update their results, it would need to be done through a sports oracle.
The sports oracle could be an already existing sports oracle on the network or one setup on their own.

Sports oracles have two arrays to keep track of different types of providers: Requested and accepted providers.
Providers can request for acceptance by the oracles and will be added to the requested providers array.
If the oracle accepts a provider, they get pushed to the accepted providers array.

Accepted providers can have game outcomes pushed out to their contract by the sports oracle. Sports oracles 
can also set fees for acceptance, meaning if a provider pays X DBETs, they would be automatically added into the 
accepted providers list.

Sports oracles do not have an obligation to push results out to a provider contract and would be a risk taken by 
providers on trusting their integrity.

# Betting providers

Betting providers are house offerings and interact with sports oracles to provide odds and payouts for games
provided by oracles.

As with all house offerings on the platform, users will have to deposit/withdraw tokens to the offering's contract
before interacting with the contract.

Betting providers can choose games from their sports oracle and push games out and update odds offered and bet limits for each game.
Providers are allowed to offering 4 types of bets: Spread, moneyline, totals and team totals. All odds provided are in the american
+100/-100 format.

As with the pull nature of smart contracts, all bet winnings will have to be claimed by a user by calling claimBet(),
if a user does'nt claim a bet past a 48h time period, other users will be able to claim the bet winnings on their behalf and redeem a 1% fee.

This is especially important towards the end of a session when all the session's funds will have to be withdrawn and returned back to the house for
profit distribution.

