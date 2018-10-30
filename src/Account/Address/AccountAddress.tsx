import * as React from 'react'
import {
    Grid,
    Card,
    CardContent,
    CardActions,
    Input,
    InputLabel,
    FormControl,
    FormHelperText,
    Typography,
    Button
} from '@material-ui/core'
import * as validator from 'validator'
import { Wallet } from 'ethers'
import { WALLET_WEBSITE_URL, MNEMONIC_DPATH } from '../../constants'
import AccountSectionHeader from '../AccountSectionHeader'
import AccountSectionActions from '../AccountSectionActions'
import {
    IAccountAddressState,
    AccountAddressState
} from './AccountAddressState'
import IAccountAddressProps from './IAccountAddressProps'

class AccountAddress extends React.Component<
    IAccountAddressProps,
    IAccountAddressState
> {
    constructor(props) {
        super(props)
        this.state = new AccountAddressState()
        this.renderForm = this.renderForm.bind(this)
        this.renderInfo = this.renderInfo.bind(this)
    }

    private get formHasError() {
        if (
            validator.isLength(this.state.address, { min: 4, max: 300 }) &&
            validator.isLength(this.state.privateKeyOrMnemonic, {
                min: 4,
                max: 300
            })
        ) {
            return false
        }

        return true
    }

    private didToogleEdit = (_event: React.MouseEvent) => {
        let { isEditing } = this.state
        this.setState({ isEditing: !isEditing })
    }

    private onPrivateKeyOrMnemonicChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        let loginValue = event.target.value
        let address = ''
        let privateKey = ''
        const fieldName = 'privateKeyOrMnemonic'
        let { errorMessages, errors } = this.state

        if (!event.target.validity.valid) {
            errorMessages[fieldName] = event.target.validationMessage
            errors[fieldName] = true
        } else {
            try {
                let wallet
                if (loginValue.includes(' ')) {
                    // Passphrase Mnemonic mode
                    wallet = Wallet.fromMnemonic(loginValue, MNEMONIC_DPATH)
                } else {
                    // Private Key Mode
                    // Adds '0x' to the beginning of the key if it is not there.
                    if (loginValue.substring(0, 2) !== '0x') {
                        loginValue = '0x' + loginValue
                    }
                    wallet = new Wallet(loginValue)
                }
                address = wallet.address
                privateKey = wallet.privateKey
            } catch (e) {
                errorMessages[fieldName] =
                    'Error trying to process your Passphrase or Private Key.'
                errors[fieldName] = false
                loginValue = event.target.value
            }
        }

        this.setState({
            privateKeyOrMnemonic: loginValue,
            privateKey,
            address,
            errorMessages,
            errors
        })
    }

    private handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        await this.props.saveAccountAddress(
            this.state.address,
            this.state.privateKey
        )
    }

    public componentDidMount() {
        if (!this.props.accountHasAddress) {
            this.setState({ isEditing: true })
        } else {
            this.setState({
                address:
                    this.props.account.verification &&
                    this.props.account.verification.addressRegistration &&
                    this.props.account.verification.addressRegistration
                        .vetAddress
                        ? this.props.account.verification.addressRegistration
                              .vetAddress
                        : 'Error! not public address recevied.'
            })
        }
    }

    private renderForm() {
        return (
            <Card>
                <form onSubmit={this.handleSubmit}>
                    <AccountSectionHeader
                        enableEdit={!this.props.accountHasAddress}
                        title="VET Address"
                        isEditing={this.state.isEditing}
                        isSaving={this.props.isSaving}
                        didClickOnCancel={this.didToogleEdit}
                        didClickOnEdit={this.didToogleEdit}
                    />
                    <CardContent>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={12}>
                                <FormControl
                                    error={this.state.errors.privateKey}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="privateKey">
                                        {
                                            'Passphrase or Private Key V3 (Vechain) token version'
                                        }
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
                                        placeholder="Enter Passphrase or Private Key V3 (Vechain) token
                                        version"
                                        name="privateKeyOrMnemonic"
                                        value={this.state.privateKeyOrMnemonic}
                                        onChange={
                                            this.onPrivateKeyOrMnemonicChange
                                        }
                                    />
                                    <FormHelperText component="small">
                                        <Typography color="secondary">
                                            *This will be the only wallet
                                            address you will be able to fund
                                            your play with.
                                        </Typography>
                                    </FormHelperText>
                                    <FormHelperText>
                                        {this.state.errorMessages.address}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl
                                    error={this.state.errors.address}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="address">
                                        {!this.props.accountHasAddress &&
                                        !this.state.isEditing
                                            ? `You haven't registered an address yet`
                                            : 'Public Address'}
                                    </InputLabel>
                                    <Input
                                        multiline={true}
                                        rows={2}
                                        type="text"
                                        disabled={true}
                                        placeholder="Public Address"
                                        name="address"
                                        value={this.state.address}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.address}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid
                            container={true}
                            spacing={32}
                            direction="row"
                            alignItems="center"
                        >
                            <Grid item={true} xl={12}>
                                <Typography>
                                    Do not have an Public Address and
                                    Phassphrase or Private Key ?, you can
                                    download our{' '}
                                    <Button
                                        style={{
                                            paddingLeft: 2,
                                            paddingRight: 2
                                        }}
                                        variant="text"
                                        color="primary"
                                        target="_blank"
                                        href={WALLET_WEBSITE_URL}
                                    >
                                        DBET Wallet
                                    </Button>{' '}
                                    and create a new one.
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    color="primary"
                                >
                                    *To export your private key from the DBET
                                    wallet, be sure to select V3 (Vechain) token
                                    version before exporting.
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <AccountSectionActions
                        enableEdit={!this.props.accountHasAddress}
                        isEditing={this.state.isEditing}
                        hasError={this.formHasError}
                        isSaving={this.props.isSaving}
                    />
                </form>
            </Card>
        )
    }

    private renderInfo() {
        return (
            <Card>
                <AccountSectionHeader
                    enableEdit={!this.props.accountHasAddress}
                    title="VET Address"
                    isEditing={this.state.isEditing}
                    isSaving={this.props.isSaving}
                    didClickOnCancel={this.didToogleEdit}
                    didClickOnEdit={this.didToogleEdit}
                />
                <CardContent>
                    <Grid container={true} spacing={40}>
                        <Grid item={true} xl={12}>
                            <Typography variant="subtitle1">
                                Public Address
                            </Typography>
                            <Typography color="primary">
                                {this.state.address}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <br />
                </CardActions>
            </Card>
        )
    }

    public render() {
        return this.props.accountHasAddress
            ? this.renderInfo()
            : this.renderForm()
    }
}

export default AccountAddress
