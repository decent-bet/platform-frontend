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
import { DatePicker } from 'material-ui-pickers'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import { subYears } from 'date-fns'

interface IAccountInfoState {
    editing: boolean
    formData: {
        firstName: string
        middleName: string
        lastName: string
        sex: string
        dob: Date
        country: string
        state: string
        streetAddress: string
        phoneNumber: string
        postCode: string
        town: string
    }
}

class AccountInfo extends React.Component<any, IAccountInfoState> {
    private maxDateOfBirth = subYears(new Date(), 18)

    constructor(props: any) {
        super(props)

        this.state = {
            editing: false,
            formData: {
                firstName: '',
                middleName: '',
                lastName: '',
                sex: '',
                dob: this.maxDateOfBirth,
                country: '',
                state: '',
                streetAddress: '',
                phoneNumber: '',
                postCode: '',
                town: ''
            }
        }
    }

    private handleDateOfBirthChange = (date) => {
        let {formData} = this.state
        formData.dob = date
        this.setState({ formData });
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
                    title="Account Info"
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
                        
                        <DatePicker
                        keyboardIcon={<CalendarTodayIcon/>}
                            leftArrowIcon={<ChevronLeftIcon/>}
                            rightArrowIcon={<ChevronRightIcon/>}
                            disableFuture={true}
                            maxDate={this.maxDateOfBirth}
                            required={true}
                            format="MM/dd/yyyy"
                            autoOk={true}
                            adornmentPosition="end"
                                value={this.state.formData.dob}
                                onChange={this.handleDateOfBirthChange}
                                />
                                    
                        </Grid>
                    </Grid>
                    </form>
                </CardContent>
            </Card>
        )
    }
}

export default AccountInfo
