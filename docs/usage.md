# Usage

Make sure you read through the following before you proceed to be clear about the concepts
mentioned below and perform the steps outlined

[Platform Architecture](platform-architecture.md) to get familiar with
the terminologies for each element of the platform and how they work.

[Getting Started](getting-started.md) to setup all necessary repositories locally to perform
the steps mentioned below.

## Deploy contracts

To begin with, ensure the [private network](https://github.com/decent-bet/platform-frontend/blob/master/docs/setting-up-a-private-network.md) is setup and 
contracts [are deployed on to the network](https://github.com/decent-bet/platform-frontend/blob/master/docs/getting-started.md)

## Initialize the Platform

During development, initializing the contracts to a state that allows usage of the platform requires a variety of boilerplate transactions to 
perform the following tasks

* Begin session zero
* Allocate tokens to house offerings
* Claim tokens from faucet for the user
* Purchase 50,000 house shares
* Skip time ahead to token allocation week
* Allocate tokens to both house offerings
* Skip to session one
* Begin session one

To initialize the platform for development purposes in an automated fashion, head to the [initialization script](https://github.com/decent-bet/platform-contracts-init) repository and follow the instructions mentioned there.

If you'd like to initialize the platform manually, follow the [Manual Initialization](#manual-platform-initialization) instructions mentioned below.

## Run platform and admin dapps

Once contracts have been deployed to the local network and the platform has been initialized. You can now run both the Platform and Admin frontends by heading to their directories and running.

```
npm run start
```

This should open instances of both dapps within two new browser tabs.

Now you should be able to use the house, sportsbook and slots along with the Admin Panel.

If you have not initialized the platform using the initialization script or simply wish to initialize manually,
follow the steps mentioned in the next section.

## Manual Platform Initialization

### Start session 0

Select the **House** page in the Admin Panel and click on the 
**Start Next Session** button. The first time this function is called, it begins session 0.
Session 0 is a special session that lasts 2 weeks. 

Week 1 allows DBET holders to purchase house
credits. It also allows the house to allocate token distribution to each house offering. 

During week 2, the house gets to deposit tokens into each of the house offerings.

### Redeem Faucet

For development purposes, a mock token contract is used. The contract consists of a faucet 
that sets the balance of a user to 100,000 DBETs. 

To use, navigate to the top right of the Platform frontend and click on the **Redeem Faucet** button. 
You should see 100,000 DBETs in your balance a couple of seconds after the transaction is sent.

### Purchase House Credits

Using the platform frontend, navigate to the house section and click on **Purchase Credits**. 
Enter the amount of credits you would like to purchase and hit the purchase button. 

Credits are issued at a 1:1 ratio for DBETs deposited into the house. For every 1000 credits,
users will receive a lottery ticket into the session's lottery. Users can retrieve a maximum of
5 tickets.

### Setting mock times

To make testing easier, the admin panel comes with an option to set the time on the contract.
Click on the **Set Time** button in the House page of the Admin panel to select a time and
push it to the contract.

### Allocate and Deposit tokens to House Offerings

During the first week of session 0, the house will be able to allocate the amount of tokens
it would like to add to it's offerings in %. To do so, scroll to the house offerings section and 
click on the allocate button and enter the % amount to allocate to each offering.
 
During the second week, the house can now deposit the allocated tokens to each offering. Make sure
[house credits have been purchased](#purchase-house-credits) for this to work.

### Start session 1

After session 0's end time has passed, users will be able to use the slots and sports book 
within the platform. Simply set the time of the contract to the end time of session 0 and 
then click on the **Start Next Session** button to begin session 1.

# Sportsbook 

## Add game to oracle

Head over to the Admin dapp and on the sidebar, click on the Sports Oracle menu item and the "Add Game" sub-menu item.

You should now see a list of sports along with leagues that are available for each sport. Click on any desired sport and then the "View Fixtures" button.

You should now see a list of fixtures returned by Pinnacle for the selected league. Click on 'ADD' for any of your desired games.

You should now see a form to add the game along with available odds for the match, meant for reference purposes. The **Start time** field is based on the start time provided by Pinnacle.

The end time field needs to be manually entered for now. This will be replaced with a date/time picker in the near future.

After entering the end time field, click on the **Add Game to Oracle** button to push the game to the sports oracle contract.

## Push game to provider

Once the game has been pushed to the oracle contract. Click on the 'Betting Provider' sub-menu item on the sidebar.

After the transaction has been mined on to the network, you should see the game under the "Available games" section at the bottom of the page. 

Click on the "Push Game" button in the row for the pushed game. You will now see a form to push the selected game along with available odds and bet limits. 

Enter the cut-off time for the game (time before which bets can be placed) and click on the push button. By default, the cut-off time field is filled at 1000 seconds 
or ~18 minutes prior to the game's start time. Time entry fields will be replaced with a date/time picker.

Once the game has been pushed (refresh after transaction has been mined on to the network), you should see the game show up under "Pushed games". 
Click on the "Update Bet Limits" and you should see a dialog show up with the following forms

* **Update Max Bet Limits**

    This field allows you to update the maximum amount of DBETs that can be bet into the selected game.
    
    **Max bet limits have to be set before a user is able to bet on the game.**

* **Update Period Limits**

    This fields allows you to update the maximum amount of DBETs that can be bet into different bet types for a selected period in the selected game.
    
    To fill in the period limits, you can refer to the limits provided by Pinnacle which can be found if you scroll to the bottom of the Dialog. 

**Push both max bet and period limits before continuing to the next step.**

## Push game odds

After pushing bet limits, you can now push odds which can be bet on by users of the platform. Select a period and the type of bet
and fill in the corresponding fields based on the odds displayed below which are returned from Pinnacle.

Once selected, click on the **Push Odds** button to push the entered odds into the Provider contract. 

If you'd like to add more odds, repeat the above steps to do so. To confirm odds have been pushed to the network, 
the **Odds count** column under **Pushed Games** should increment by 1 for every set of odds pushed to the contract.

## Deposit tokens into Sports book

Once odds have been pushed, users can finally bet on the game provided the current time has not exceeded the cut-off time of the game. 

To begin betting however, users will have to deposit tokens into the Sportsbook contract. To do so, open the Platform frontend and 
to the right you should see **Your Session Balance** along with a **Deposit** button.

Click on the deposit button and enter the amount of DBETs you would like to deposit into the Sportsbook contract.

Once the transaction has been mined on to a block (since the frontend doesn't track events yet, make sure you refresh the page to view changes),
you should see **Your Session Balance** show an updated balance.

## Bet on game

After depositing tokens into the contract, you will now be able to bet on games.

If you've followed the steps above, you should now see games that have been added to the provider contract along
with it's corresponding odds. 

Select any of the odds forms and enter the amount of DBETs you'd like to bet along with your preferred choice - 
Either Home/Away/Win or Over/Under for Totals based odds.

Once you've done the above, click the **Bet Now** button to send the transaction to the network.

After the transaction has been mined on to a block, you should now see your bet show up under the **Bets Placed** 
section at the bottom of the page along with details of the bet.

## Update provider and oracle times (only for testing/development)

After placing bets, you would usually now wait for the current time to pass the game's designated end time before pushing the game's outcome.

To get around this during development, all 3 contracts - house, sports oracle and betting provider have a **Set Time** option
which allows you to set the current time for each of the contracts.

Now, in the **Sports Oracle** page of the Admin frontend, scroll down to the **Time** section and 
click on the **Set Time** button. Select a date and time **after** the end time specified for the pushed game.

You can repeat the same process in the **Betting Provider** page, the button can be found in the first section of the page.

## Push game outcome to sports oracle

Once the time has updated to the newly set time, you should be able to push game outcomes to the oracle.

In the **Sports Oracle** page, next to the desired game under the **available games** section, click on the **Push Outcome** button.

A dialog should now show up allowing you to push results for the game. If the game has ended, you should be able to see the actual results for the game under the **Pinnacle results**
section at the bottom of the dialog. 

However, in development - you can enter a result along with scores for the selected time period.

After filling the form, click on the **Push to oracle** button to push the results and scores to the contract.

To check whether the results have been pushed to the network, under the **Games** section in the **Sports Oracle** page, 
under the **Settlement Status** column, you should see it toggled to **Settled**.

## Update outcome on provider

The above step pushes the result to the oracle contract, this now will need to be updated on the Betting Provider contract. 

To do so, click on the **Update Provider Outcome** button. You should now see a dialog with the outcomes pushed to the contract
along with the providers available. 

For now, since ***Decent.bet*** will be the only provider on the network you should see only a single provider.

To update an outcome, click the checkbox for an outcome and then the provider. Once done, click on the **Push to Provider** button.

After the outcome has been updated (mined on to a block), you should see the **Pushed to Provider** column in the dialog switch to **Yes**.

## Claim winnings

After outcomes have been pushed, users will now be able to view results on the platform frontend along with the
amount they've won.

In the platform frontend in the **Bets Placed** section at the bottom of the page, you should be able
to view the bet that had been placed previously along with an option to **Claim Winnings**.

If the bet was a winning bet, you can now click on the button to redeem your winnings from the bet.

If you do so, you should be able to see your session balance update accordingly based on the amount of DBETs once with the bet.

# Slots


## Navigate to the Slots page

Open the Platform Frontend and click on the top left to toggle the navigation drawer. Click on 
the casino button and then select Slots from the list of available games.

## Get Slots Chips

To begin playing slots, DBETs need to be deposited into the Slots Channel Manager contract.
This is referred to as "Getting Slot Chips" here. Click on the 'Get Slot Chips' button and
enter the amount of DBETs you'd like to transfer to the contract. You should see your slots 
balance change to reflect the amount of DBETs you deposited into the contract.

## Create a Channel

Once you have DBETs in the slots contract, you will need to create a channel. Click on a 
slot machine from the ones listed and enter the amount of DBETs you'd like to deposit into the channel.

The deposit is necessary to allow the game to be conducted off-chain, while allowing either 
party to close the channel at any time and claim their DBETs based on their final balances in 
the game.

Once the channel is created it should show up in the channels section at the bottom of the page.

## Deposit into a Channel

Click on the Deposit button on the channel. Make sure you've enough DBETs to cover the transaction and
the house has enough DBETs to activate the channel. The house may fall short if too little
DBETs were deposited into the house initially or if too many channels are open.

Also, this step requires the [Games API](getting-started.md#games-api) to be running to automate
the house's operations in terms of activating channels and processing spins.

## Play

Once the house has activated a channel, click on the play button and proceed to the page to play
with the machines. If you're using MetaMask, every spin will require you to explicitly
confirm signing a message. This will be unnecessary once the platform gets ported to a desktop app 
and handles private keys on it's own.

## Close Channel
