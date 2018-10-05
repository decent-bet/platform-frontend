import * as React from 'react'
import {
    Grid,
    Card,
    CardHeader,
    IconButton,
    CardContent,
    TextField
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'

interface IProfileInfoState {
    editing: boolean
    formData: {
        firstName: string
        middleName: string
        lastName: string
        sex: string
        dob: string
        country: string
        state: string
        streetAddress: string
        phoneNumber: string
        postCode: string
        town: string
    }
}

class ProfileInfo extends React.Component<any, IProfileInfoState> {
    constructor(props: any) {
        super(props)

        this.state = {
            editing: false,
            formData: {
                firstName: '',
                middleName: '',
                lastName: '',
                sex: '',
                dob: '',
                country: '',
                state: '',
                streetAddress: '',
                phoneNumber: '',
                postCode: '',
                town: ''
            }
        }
    }

    private onFormValueChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = event.target.value

        if (!event.target.validity.valid || !value || value.length < 4) {
            // this.setState({errorMessage: event.target.validationMessage, error: true, email: value})
        } else {
            // this.setState({errorMessage: '', error: false, email: value})
        }
    }

    private handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
    }

    public render() {
        // const {profile} = this.props
        return (
            <Card>
                <CardHeader
                    title="Profile Info"
                    action={
                        <IconButton>
                            {this.state.editing ? <SaveIcon /> : <EditIcon />}
                        </IconButton>
                    }
                />
                <CardContent>
                <form onSubmit={this.handleSubmit}>
                    <Grid container={true} spacing={32}>
                        <Grid item={true} xs={12} sm={4}>
                                <TextField
                                    label="First name"
                                    type="text"
                                    name="firstName"
                                    error={false}
                                    value={this.state.formData.firstName}
                                    required={true}
                                    fullWidth={true}
                                    onChange={this.onFormValueChange}
                                    helperText={''}
                                />
                        </Grid>
                        <Grid item={true} xs={12} sm={4}>
                                <TextField
                                    label="Middle name"
                                    type="text"
                                    name="middleName"
                                    error={false}
                                    value={this.state.formData.middleName}
                                    required={false}
                                    fullWidth={true}
                                    onChange={this.onFormValueChange}
                                    helperText={''}
                                />
                        </Grid>
                        <Grid item={true} xs={12} sm={4}>
                                <TextField
                                    label="Last name"
                                    type="text"
                                    name="lastName"
                                    error={false}
                                    value={this.state.formData.lastName}
                                    required={true}
                                    fullWidth={true}
                                    onChange={this.onFormValueChange}
                                    helperText={''}
                                />
                        </Grid>
                        <Grid item={true} xs={12} sm={4}>
                                <TextField
                                    label="First name"
                                    type="text"
                                    name="firstName"
                                    error={false}
                                    value={this.state.formData.firstName}
                                    required={true}
                                    fullWidth={true}
                                    onChange={this.onFormValueChange}
                                    helperText={''}
                                />
                        </Grid>
                    </Grid>
                    </form>
                </CardContent>
            </Card>
        )
    }
}

export default ProfileInfo
