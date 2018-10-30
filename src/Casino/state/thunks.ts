import actions from './actions'
import { IThunkDependencies } from '../../common/types'
import { openAlert } from '../../common/state/thunks'

export function getCasinoLoginStatus(account: any) {
    return async (dispatch, _getState, { keyHandler }: IThunkDependencies) => {
        const statusResult = await dispatch(
            actions.getCasinoLoginStatus(keyHandler)
        )
        const { value } = statusResult
        if (!value) {
            const tempPrivateKey = await keyHandler.getTempPrivateKey()
            if (tempPrivateKey) {
                await dispatch(authWallet(tempPrivateKey, account))
                await keyHandler.removeTempPrivateKey()
                return true
            }
        }

        return value
    }
}

export function authWallet(data: string, account: any) {
    return async (dispatch, __getState, { keyHandler }: IThunkDependencies) => {
        await dispatch(actions.authWallet(data, account, keyHandler))
        await dispatch(
            openAlert('You are enabled to play on the casino!', 'info')
        )
    }
}

export function initializeCasino() {
    return async (dispatch, _getState, { contractFactory, keyHandler }) => {
        const vetAddress = (await keyHandler.getPublicAddress()) || ''

        await dispatch(actions.getVthoBalance(contractFactory, vetAddress))
        await dispatch(actions.getTokens(contractFactory, vetAddress))

        setTimeout(async () => {
            await dispatch(actions.getVthoBalance(contractFactory, vetAddress))
            await dispatch(actions.getTokens(contractFactory, vetAddress))
        }, 4000)
    }
}

export function setSlotsInitialized() {
    return async dispatch => {
        await dispatch(actions.setSlotsInitialized())
    }
}

export function faucet() {
    return async (dispatch, _getState, { contractFactory, keyHandler }) => {
        await dispatch(actions.faucet(contractFactory))

        const vetAddress = (await keyHandler.getPublicAddress()) || ''

        await dispatch(actions.getVthoBalance(contractFactory, vetAddress))
        await dispatch(actions.getTokens(contractFactory, vetAddress))
    }
}

export function initializeSlots() {
    return async (
        dispatch,
        _getState,
        { contractFactory, keyHandler }: IThunkDependencies
    ) => {
        const vetAddress = await keyHandler.getPublicAddress()
        await dispatch(actions.getVthoBalance(contractFactory, vetAddress))
        await dispatch(actions.getAllowance(contractFactory, vetAddress))
    }
}

export function spin(totalBetSize, props, listener?) {
    return async (dispatch, _getState, { slotsChannelHandler }) => {
        await dispatch(
            actions.makeSpin(totalBetSize, props, listener, slotsChannelHandler)
        )
    }
}

export function verifyHouseSpin(props, houseSpin, userSpin) {
    return async (_dispatch, _getState, { slotsChannelHandler }) => {
        await slotsChannelHandler.verifyHouseSpin(props, houseSpin, userSpin)
    }
}

export function subscribeToSpinResponses(listener) {
    return async (dispatch, _getState, { wsApi, slotsChannelHandler }) => {
        await dispatch(
            actions.subscribeToSpinResponses(
                listener,
                wsApi,
                slotsChannelHandler
            )
        )
    }
}

export function unsubscribeFromActiveSubscriptions() {
    return async (dispatch, getState, { wsApi }) => {
        await dispatch(actions.unsubscribeFromActiveSubscriptions(wsApi))
    }
}

export function subscribeToFinalizeResponses(listener) {
    return async (dispatch, getState, { wsApi, slotsChannelHandler }) => {
        await dispatch(
            actions.subscribeToFinalizeResponses(
                listener,
                wsApi,
                slotsChannelHandler
            )
        )
    }
}

export function fetchChannels() {
    return async (
        dispatch,
        _getState,
        { contractFactory, wsApi, utils }: IThunkDependencies
    ) => {
        return await dispatch(
            actions.getChannels(contractFactory, wsApi, utils)
        )
    }
}

/**
 * Claims all the tokens in a channel and withdraws all tokens from the wallet
 * @param {string} channelId
 * @returns {Promise<void>}
 */
export function claimAndWithdrawFromChannel(
    channelId: string
): (dispatch, state, IThunkDependencies) => Promise<void> {
    return async (
        dispatch,
        _getState,
        { contractFactory, keyHandler }: IThunkDependencies
    ): Promise<void> => {
        let contract = await contractFactory.slotsChannelManagerContract()
        // Claim the channel, check token total in the contract, and withdraw tokens

        const vetAddress = await keyHandler.getPublicAddress()
        await dispatch(actions.claimChannel(channelId, contract))
        const tokensInContract = await dispatch(
            actions.getBalance(contractFactory, vetAddress)
        )

        if (tokensInContract && tokensInContract.value)
            await dispatch(
                actions.withdrawChips(tokensInContract.value, contract)
            )

        // Update the balance
        await dispatch(actions.getTokens(contractFactory, vetAddress))
        await dispatch(actions.getVthoBalance(contractFactory, vetAddress))
    }
}

export function initChannel(amount, statusUpdateListener) {
    return async (
        dispatch,
        _getState,
        {
            contractFactory,
            thorifyFactory,
            wsApi,
            utils,
            keyHandler
        }: IThunkDependencies
    ) => {
        statusUpdateListener(
            `Initializing channel with ${utils.formatEther(
                amount.toFixed()
            )} DBETs`
        )

        const thorify = thorifyFactory.make()
        const initChannelRes = await dispatch(
            actions.initChannel(
                amount.toFixed(),
                contractFactory,
                thorify,
                utils,
                wsApi
            )
        )
        const id = initChannelRes.value
        statusUpdateListener(`Successfully initialized channel`)
        const channelNonceRes = await dispatch(
            actions.getChannelNonce(id, contractFactory)
        )
        const channelNonce = channelNonceRes.value

        // Query the channel's data and add it to the redux state
        await dispatch(
            actions.getChannel(id, channelNonce, contractFactory, wsApi, utils)
        )
        statusUpdateListener(`Getting the channel`)

        // Update the ether balance
        const vetAddress = await keyHandler.getPublicAddress()
        await dispatch(actions.getVthoBalance(contractFactory, vetAddress))

        return id
    }
}

export function depositIntoCreatedChannel(id, statusUpdateListener) {
    return async (
        dispatch,
        getState,
        { contractFactory, wsApi, utils, keyHandler }: IThunkDependencies
    ) => {
        // Deposit Tokens to channel
        statusUpdateListener(`Depositing DBETs into created channel`)
        const channelDepositTransaction = await dispatch(
            actions.depositToChannel(id, contractFactory, utils)
        )

        statusUpdateListener(`Waiting for house to activate channel`)
        await dispatch(
            actions.waitForChannelActivation(
                id,
                channelDepositTransaction.value,
                contractFactory
            )
        )

        // Query the channel's data and add it to the redux state
        await dispatch(actions.getChannel(id, contractFactory, wsApi, utils))

        const vetAddress = await keyHandler.getPublicAddress()
        // Update the ether balance
        await dispatch(actions.getVthoBalance(contractFactory, vetAddress))
        return id
    }
}

/**
 * Spin the slots, wait for the action to complete, AND THEN increase the nonce.
 * @param {string} channelId
 * @param {string} msg
 */
export function spinAndIncreaseNonce(channelId: string, msg: string) {
    return async dispatch => {
        await dispatch(actions.postSpin(channelId, msg))
        await dispatch(actions.nonceIncrease(channelId))
    }
}

export function initializeGame(channelId) {
    return async (
        dispatch,
        _getState,
        { contractFactory, keyHandler, wsApi, utils }: IThunkDependencies
    ) => {
        const result = await dispatch(
            actions.getChannelNonce(channelId, contractFactory)
        )
        const channelNonce = result.value
        await dispatch(actions.getAesKey(channelId, channelNonce, utils))
        await dispatch(actions.getChannelDetails(channelId, contractFactory))

        await dispatch(
            actions.getLastSpin(
                channelId,
                channelNonce,
                contractFactory,
                wsApi,
                utils
            )
        )
        const vetAddress = (await keyHandler.getPublicAddress()) || ''
        await dispatch(actions.getVthoBalance(contractFactory, vetAddress))
        await dispatch(actions.getTokens(contractFactory, vetAddress))
    }
}

export function initializeWaiters(channelId) {
    return async dispatch => {
        await dispatch(watcherChannelFinalized(channelId))
        await dispatch(watcherChannelClaimed(channelId))
    }
}

export function finalizeChannel(channelId, state) {
    return async (
        dispatch,
        _getState,
        { contractFactory, wsApi, utils }: IThunkDependencies
    ) => {
        await dispatch(
            actions.finalizeChannel(
                channelId,
                state,
                contractFactory,
                wsApi,
                utils
            )
        )
    }
}

// Watcher that monitors channel finalization
export function watcherChannelFinalized(channelId) {
    return async (
        dispatch,
        _getState,
        { contractFactory }: IThunkDependencies
    ) => {
        try {
            const contract = await contractFactory.slotsChannelManagerContract()
            const eventEmiter = await contract.logChannelFinalized(channelId)

            eventEmiter
                .on('data', async data => {
                    return await dispatch(
                        actions.setChannelFinalized(data.returnValues.id)
                    )
                })
                .on('error', err => {
                    throw err
                })
        } catch (error) {
            console.error('Finalized channel event', error)
            return
        }
    }
}

// Watcher that monitors the claiming of a channel's Chips
export function watcherChannelClaimed(channelId) {
    return async (
        dispatch,
        _getState,
        { contractFactory }: IThunkDependencies
    ) => {
        try {
            const contract = await contractFactory.slotsChannelManagerContract()
            const { id, isHouse } = await contract.logClaimChannelTokens(
                channelId
            )
            return await dispatch(actions.setChannelClaimed(id, isHouse))
        } catch (error) {
            console.error('Claim channel tokens event error', error)
            return
        }
    }
}
