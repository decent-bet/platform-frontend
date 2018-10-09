import * as React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as thunks from './state/thunks'
import {
    Grid,
    Card,
    CardContent,
    Input,
    InputLabel,
    FormControl,
    FormHelperText,
    Typography
} from '@material-ui/core'

import AccountSectionHeader from './AccountSectionHeader'
import AccountSectionActions from './AccountSectionActions'

interface IAccountAddressState {
    isEditing: boolean
    isSaving: boolean
    address: string
    privateKey: string
    errors: {
        address: boolean
        privateKey: boolean
    }
    errorMessages: {
        address: string
        privateKey: string
    }
}

export interface IAccountAddressProps {
    accountHasAddress: boolean
    account: any
}

class AccountAddress extends React.Component<IAccountAddressProps, IAccountAddressState> {
    constructor(props) {
        super(props)

        this.state = {
            isEditing: false,
            isSaving: false,
            address: '',
            privateKey: '',
            errors: {
                address: false,
                privateKey: false
            },
            errorMessages: {
                address: '',
                privateKey: ''
            }
        }
    }

    private didToogleEdit = (event: React.MouseEvent) => {
        let { isEditing } = this.state
        this.setState({ isEditing: !isEditing })
    }

    private onFormValueChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        /* let { address, errorMessages, errors } = this.state
        const value = event.target.value
        const name = event.target.name

        formData[name] = value
        if (!event.target.validity.valid || !value || value.length < 4) {
            errorMessages[name] = event.target.validationMessage
            errors[name] = true
        } else {
            errorMessages[name] = ''
            errors[name] = false
        }

        this.setState({ formData, errorMessages, errors }) */
    }

    private handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        return
    }

    public componentDidMount() {
        if (!this.props.accountHasAddress) {
            this.setState({ isEditing: true })
        }
    }

    public render() {
        return (
            <Card>
                <AccountSectionHeader
                    title="Public Address"
                    isEditing={this.state.isEditing}
                    isSaving={this.state.isSaving}
                    didClickOnCancel={this.didToogleEdit}
                    didClickOnEdit={this.didToogleEdit}
                />
                <CardContent>
                    <form onSubmit={this.handleSubmit}>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={12}>
                                <FormControl
                                    error={this.state.errors.address}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="address">
                                        {!this.props.accountHasAddress &&
                                        !this.state.isEditing
                                            ? `You haven't registered an address yet`
                                            : 'Public Address'}
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
                                        placeholder="Public Address"
                                        name="address"
                                        value={this.state.address}
                                        onChange={this.onFormValueChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.address}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={12}>
                                <FormControl
                                    error={this.state.errors.privateKey}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="privateKey">
                                        Private key
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
                                        placeholder="Private key"
                                        name="privateKey"
                                        value={this.state.privateKey}
                                        onChange={this.onFormValueChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.address}
                                    </FormHelperText>
                                    <FormHelperText>
                                    <Typography component="small">
                                            Your private key will be used to
                                            sign a message and prove ownership
                                            of the address you would like to
                                            register.
                                        </Typography>
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
                <AccountSectionActions isEditing={this.state.isEditing} isSaving={this.state.isSaving}/>
            </Card>
        )
    }
}

const mapStateToProps = state => Object.assign({}, state.account, state.main)
const mapDispatchToProps = dispatch =>
    bindActionCreators(Object.assign({}, thunks), dispatch)

const AccountAddressContainer = connect<IAccountAddressProps>(
    mapStateToProps,
    mapDispatchToProps
)(AccountAddress)
export default AccountAddressContainer

