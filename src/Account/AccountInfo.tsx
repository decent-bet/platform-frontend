import * as React from 'react'
import {
    Grid,
    Card,
    CardHeader,
    IconButton,
    CardContent,
    Input,
    Select,
    InputLabel,
    MenuItem,
    FormControl,
    FormHelperText
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save'
import { DatePicker } from 'material-ui-pickers'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import CancelIcon from '@material-ui/icons/Cancel'
import { subYears, format } from 'date-fns'
// import validator from 'validator'
import countries from 'iso-3166-1/src/iso-3166'
import { withStyles, createStyles } from '@material-ui/core'

const styles = () =>
    createStyles({
        datePickerDisabled: {
            '& > div:before': {
                borderBottom: 'none !important',
                content: ''
            }
        }
    })

interface IAccountInfoState {
    editing: boolean
    formData: {
        firstName: string
        middleName: string
        lastName: string
        sex: string
        selectedDob: Date
        dob: string
        country: string
        state: string
        streetAddress: string
        phoneNumber: string
        postCode: string
        town: string
    }
    errorMessages: {
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
    errors: {
        firstName: boolean
        middleName: boolean
        lastName: boolean
        sex: boolean
        dob: boolean
        country: boolean
        state: boolean
        streetAddress: boolean
        phoneNumber: boolean
        postCode: boolean
        town: boolean
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
                selectedDob: this.maxDateOfBirth,
                dob: '',
                country: '',
                state: '',
                streetAddress: '',
                phoneNumber: '',
                postCode: '',
                town: ''
            },
            errorMessages: {
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
            },
            errors: {
                firstName: false,
                middleName: false,
                lastName: false,
                sex: false,
                dob: false,
                country: false,
                state: false,
                streetAddress: false,
                phoneNumber: false,
                postCode: false,
                town: false
            }
        }
    }

    private _countryList = countries.map((item, index) => (
        <MenuItem value={item.alpha3} key={index}>
            {item.country}
        </MenuItem>
    ))

    private _sexList = ['Male', 'Female'].map((sex, index) => (
        <MenuItem value={sex} key={index}>
            {sex}
        </MenuItem>
    ))

    private onToogleEdit = async () => {
        let { editing } = this.state

        if (editing) {
            await this.handleSubmit()
        }

        this.setState({ editing: !editing })
    }

    private handleDateOfBirthChange = date => {
        let { formData } = this.state
        ;(formData.selectedDob = date),
            (formData.dob = format(date, 'MM-dd-YYYY'))
        this.setState({ formData })
    }

    private onFormValueChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        let { formData, errorMessages, errors } = this.state
        const value = event.target.value
        const name = event.target.name

        formData[name] = value
        if (event.target.validity && (!event.target.validity.valid || !value || value.length < 4)) {
            errorMessages[name] = event.target.validationMessage
            errors[name] = true
        } else {
            errorMessages[name] = ''
            errors[name] = false
        }

        this.setState({ formData, errorMessages, errors })
    }

    private handleSubmit = async () => {
        return
    }

    public render() {
        return (
            <Card>
                <CardHeader
                    title="Account Info"
                    action={
                        this.state.editing ? (
                            <React.Fragment>
                                <IconButton onClick={this.onToogleEdit}>
                                    <CancelIcon />
                                </IconButton>{' '}
                                <IconButton onClick={this.onToogleEdit}>
                                    <SaveIcon color="primary"/>
                                </IconButton>{' '}
                            </React.Fragment>
                        ) : (
                            <IconButton onClick={this.onToogleEdit}>
                                <EditIcon />
                            </IconButton>
                        )
                    }
                />
                <CardContent>
                    <form>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.firstName}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="firstName">
                                        First name
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        disableUnderline={!this.state.editing}
                                        disabled={!this.state.editing}
                                        placeholder="First name"
                                        name="firstName"
                                        value={this.state.formData.firstName}
                                        onChange={this.onFormValueChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.firstName}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={false}
                                    required={false}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="middleName">
                                        Middle name
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        disableUnderline={!this.state.editing}
                                        disabled={!this.state.editing}
                                        placeholder="Middle name"
                                        name="middleName"
                                        value={this.state.formData.middleName}
                                        onChange={this.onFormValueChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.middleName}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={false}
                                    required={false}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="lastName">
                                        Last name
                                    </InputLabel>
                                    <Input
                                        disableUnderline={!this.state.editing}
                                        disabled={!this.state.editing}
                                        type="text"
                                        placeholder="Last name"
                                        name="lastName"
                                        value={this.state.formData.lastName}
                                        onChange={this.onFormValueChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.lastName}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl required={true} fullWidth={true}>
                                    <InputLabel htmlFor="sex">Sex</InputLabel>
                                    <Select
                                        disableUnderline={!this.state.editing}
                                        disabled={!this.state.editing}
                                        fullWidth={true}
                                        IconComponent={!this.state.editing ? 'span' : ArrowDropDownIcon}
                                        value={this.state.formData.sex}
                                        onChange={this.onFormValueChange}
                                        name="sex"
                                        error={false}
                                        required={true}
                                    >
                                        <MenuItem value="">
                                            <em>Sex</em>
                                        </MenuItem>
                                        {this._sexList}
                                    </Select>
                                    <FormHelperText>
                                        {this.state.errorMessages.sex}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    required={true}
                                    fullWidth={true}
                                    error={this.state.errors.dob}
                                >
                                    <DatePicker
                                        className={
                                            !this.state.editing
                                                ? this.props.classes
                                                      .datePickerDisabled
                                                : ''
                                        }
                                        name="selectedDob"
                                        label="Date of birth"
                                        disabled={!this.state.editing}
                                        keyboardIcon={<CalendarTodayIcon />}
                                        leftArrowIcon={<ChevronLeftIcon />}
                                        rightArrowIcon={<ChevronRightIcon />}
                                        disableFuture={true}
                                        maxDate={this.maxDateOfBirth}
                                        required={true}
                                        format="MMM dd, YYYY"
                                        autoOk={true}
                                        value={this.state.formData.selectedDob}
                                        onChange={this.handleDateOfBirthChange}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    required={true}
                                    fullWidth={true}
                                    error={this.state.errors.country}
                                >
                                    <InputLabel htmlFor="country">
                                        Country
                                    </InputLabel>
                                    <Select
                                        error={this.state.errors.country}
                                        disableUnderline={!this.state.editing}
                                        disabled={!this.state.editing}
                                        IconComponent={!this.state.editing ? 'span' : ArrowDropDownIcon}
                                        fullWidth={true}
                                        value={this.state.formData.country}
                                        onChange={this.onFormValueChange}
                                        name="country"
                                    >
                                        <MenuItem value="">
                                            <em>Country</em>
                                        </MenuItem>
                                        {this._countryList}
                                    </Select>
                                    <FormHelperText>
                                        {this.state.errorMessages.country}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.state}
                                    required={false}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="lastName">
                                        State
                                    </InputLabel>
                                    <Input
                                        error={this.state.errors.state}
                                        disableUnderline={!this.state.editing}
                                        disabled={!this.state.editing}
                                        type="text"
                                        placeholder="State"
                                        name="state"
                                        value={this.state.formData.state}
                                        onChange={this.onFormValueChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.state}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.streetAddress}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="streetAddress">
                                        Street Address
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        disableUnderline={!this.state.editing}
                                        disabled={!this.state.editing}
                                        placeholder="Street Address"
                                        name="streetAddress"
                                        value={
                                            this.state.formData.streetAddress
                                        }
                                        onChange={this.onFormValueChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.streetAddress}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.town}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="town">
                                        Towm/City
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        disableUnderline={!this.state.editing}
                                        disabled={!this.state.editing}
                                        placeholder="Towm/City"
                                        name="town"
                                        value={this.state.formData.town}
                                        onChange={this.onFormValueChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.town}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.postCode}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="postCode">
                                        Postal Code
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        disableUnderline={!this.state.editing}
                                        disabled={!this.state.editing}
                                        placeholder="Postal Code"
                                        name="postCode"
                                        value={this.state.formData.postCode}
                                        onChange={this.onFormValueChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.postCode}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.phoneNumber}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="postCode">
                                        Phone Number
                                    </InputLabel>
                                    <Input
                                        disableUnderline={!this.state.editing}
                                        disabled={!this.state.editing}
                                        type="text"
                                        placeholder="Phone Number"
                                        name="phoneNumber"
                                        value={this.state.formData.phoneNumber}
                                        onChange={this.onFormValueChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.phoneNumber}
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
export default withStyles(styles)(AccountInfo)
