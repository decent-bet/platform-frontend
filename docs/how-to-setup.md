# How to setup

Make sure you read through the following before you proceed to be clear about the concepts
mentioned below and perform the steps outlined

[Platform Architecture](platform-architecture.md) to get familiar with
the terminologies for each element of the platform and how they work.

[Getting Started](getting-started.md) to setup all necessary repositories locally to perform
the steps mentioned below.

## House

### Start session 0

Using a fresh contract, select House in the Admin Panel and click on the 
"Start Next Session" button. The first time this function is called, it begins session 0.
Session 0 is a special session that lasts 2 weeks. Week 1 allows DBET holders to purchase house
credits. It also allows the house to allocate token distribution to each house offering. 
During week 2, the house gets to deposit tokens into each of the house offerings.

### Redeem Faucet

For development purposes, a mock token contract is used. The contract consists of a faucet 
that sets the balance of a user to 100,000 DBETs. To use, navigate to the top right of the 
Platform frontend and click on the 'Redeem Faucet' button. You should see 100,000 DBETs in 
your balance a couple of seconds after the transaction is sent.

### Purchase House Credits

Using the platform frontend, navigate to the house section and click on purchase credits. 
Enter the amount of credits you would like to purchase and hit the purchase button. 
Credits are issued at a 1:1 ratio for DBETs deposited into the house. For every 1000 credits,
users will receive a lottery ticket into the session's lottery. Users can retrieve a maximum of
5 tickets.

### Setting mock times

To make testing easier, the admin panel comes with an option to set the time on the contract.
Click on the "Set Time" button in the House page of the Admin panel to select a time and
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
then click on the start next session button to begin session 1.

## Slots

### Navigate to the Slots page

Open the Platform Frontend and click on the top left to toggle the navigation drawer. Click on 
the casino button and then select Slots from the list of available games.

### Get Slots Chips

To begin playing slots, DBETs need to be deposited into the Slots Channel Manager contract.
This is referred to as "Getting Slot Chips" here. Click on the 'Get Slot Chips' button and
enter the amount of DBETs you'd like to transfer to the contract. You should see your slots 
balance change to reflect the amount of DBETs you deposited into the contract.

### Create a Channel

Once you have DBETs in the slots contract, you will need to create a channel. Click on a 
slot machine from the ones listed and enter the amount of DBETs you'd like to deposit into the channel.

The deposit is necessary to allow the game to be conducted off-chain, while allowing either 
party to close the channel at any time and claim their DBETs based on their final balances in 
the game.

Once the channel is created it should show up in the channels section at the bottom of the page.

### Deposit into a Channel

Click on the Deposit button on the channel. Make sure you've enough DBETs to cover the transaction and
the house has enough DBETs to activate the channel. The house may fall short if too little
DBETs were deposited into the house initially or if too many channels are open.

Also, this step requires the [Games API](getting-started.md#games-api) to be running to automate
the house's operations in terms of activating channels and processing spins.

### Play

Once the house has activated a channel, click on the play button and proceed to the page to play
with the machines. If you're using MetaMask, every spin will require you to explicitly
confirm signing a message. This will be unnecessary once the platform gets ported to a desktop app 
and handles private keys on it's own.

### Close Channel

## Sports Oracle

### Add a betting provider

At the bottom of the Manage Sports Oracle section in the Admin Panel, click on 'Accepted Providers'
and then the 'Add an address' button. Enter the address of the Betting Provider here (retrieve it
from the Betting Provider section in the Admin Panel)

### Add a game

Click on _Add Game_ under Sports Oracle in the Admin Panel and select a sport. Some sports like Tennis
may take longer to load considering the amount of leagues that are returned by Pinnacle. Click on
_View Fixtures_ for a league that you'd like to add a game from. 

For any game that you'd like to add, click on the _Add_ button and under the _Push Game_ section,
enter the Start Time and End Time before clicking on the _Add Game to Oracle_ button.

## Betting Provider

### Set an oracle

In the Betting Provider page within the Admin Panel, click on the _Set Oracle Address_ button and 
paste the Sports Oracle obtained from the Sports Oracle page.

### Push a game

If games have been pushed to the provider's oracle, they will be viewable in the _Available Games_
section at the bottom of the Betting Provider page. If you'd like to push the game to the 
Betting Provider, click on the _Push Game_ button in the last column of the table.

Enter the cutoff time (Time after which bets won't be accepted) and click on the _Push_ button.

### Update game bet limits

### Push game odds

### Update game odds

### Update game outcome
