import * as React from 'react'
import {
    Grid,
    Card,
    CardHeader,
    IconButton,
    CardContent,
    Input,
    InputLabel,
    FormControl,
    FormHelperText
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'

interface IAccountAddressState {
    editing: boolean,
    address: string
    errors: {
        address: boolean
    },
    errorMessages: {
        address: string
    }
}

class AccountAddress extends React.Component<any, IAccountAddressState> {

    constructor(props) {
        super(props)
        
        this.state = {
            editing: false,
    address: '',
    errors: {
        address: false
    },
    errorMessages: {
        address: ''
    }
        }
    }

    private onToogleEdit = async () => {
        let { editing } = this.state

        if (editing) {
            await this.handleSubmit()
        }

        this.setState({ editing: !editing })
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
    
    private handleSubmit = async () => {
        return
    }
    
    public render() {
        return (
            <Card>
                <CardHeader
                    title="Public Address"
                    action={
                        <IconButton onClick={this.onToogleEdit}>
                            {this.state.editing ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                    }
                />
                <CardContent>
                    <form>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.address}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="address">
                                        Public Address
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        disableUnderline={!this.state.editing}
                                        disabled={!this.state.editing}
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
                    </form>
                </CardContent>
            </Card>
        )
    }
}

export default AccountAddress
