import * as React from 'react'
import {
    Grid,
    Card,
    CardContent,
    Input,
    InputLabel,
    FormControl,
    FormHelperText,
    Typography,
    CardHeader
} from '@material-ui/core'
import { withStyles } from '@material-ui/core'
import { InlineDatePicker } from 'material-ui-pickers'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import EventIcon from '@material-ui/icons/Event'
import moment from 'moment'
import * as validator from 'validator'
import AccountSectionActions from '../AccountSectionActions'
import BasicAccountInfoState from './BasicAccountInfoState'
import IBasicAccountInfoState from './IBasicAccountInfoState'
import IBasicAccountInfoProps from './IBasicAccountInfoProps'
import styles from './styles'
import SelectCountry from './SelectCountry'

class BasicAccountInfo extends React.Component<
    IBasicAccountInfoProps,
    IBasicAccountInfoState
> {
    private maxDateOfBirth: Date

    constructor(props: IBasicAccountInfoProps) {
        super(props)
        this.maxDateOfBirth = moment()
            .subtract(18, 'years')
            .toDate()
        this.state = new BasicAccountInfoState()
        this.onFormValueChange = this.onFormValueChange.bind(this)
        this.isValidDataInput = this.isValidDataInput.bind(this)
        this.handleDateOfBirthChange = this.handleDateOfBirthChange.bind(this)
        this.handleDateInputChange = this.handleDateInputChange.bind(this)
        this.onCountryValueChange = this.onCountryValueChange.bind(this)
    }

    public componentDidMount() {
        if (!this.props.accountIsVerified) {
            this.setState({ isEditing: true })
        }
    }

    public static getDerivedStateFromProps(
        props: IBasicAccountInfoProps,
        _state: IBasicAccountInfoState
    ) {
        const { account, accountIsVerified } = props
        if (
            accountIsVerified &&
            account &&
            account.verification &&
            account.verification.basicVerification
        ) {
            const { basicVerification } = props.account.verification
            return {
                isEditing: false,
                selectedDob: moment(
                    basicVerification.dob,
                    'YYYY-MM-dd'
                ).toDate(),
                formData: {
                    firstName: basicVerification.firstName,
                    middleName: basicVerification.middleName,
                    lastName: basicVerification.lastName,
                    sex: basicVerification.sex,
                    dob: basicVerification.dob,
                    country: basicVerification.country,
                    state: basicVerification.state,
                    streetAddress: basicVerification.streetAddress,
                    phoneNumber: basicVerification.phoneNumber,
                    postCode: basicVerification.postCode,
                    town: basicVerification.town
                }
            }
        }

        return null
    }

    private get formHasError(): boolean {
        const {
            firstName,
            lastName,
            dob,
            country,
            state,
            town
        } = this.state.formData

        return (
            !this.isValidDataInput('firstName', firstName) ||
            !this.isValidDataInput('lastName', lastName) ||
            !this.isValidDataInput('dob', dob) ||
            !this.isValidDataInput('country', country) ||
            !this.isValidDataInput('state', state) ||
            !this.isValidDataInput('town', town)
        )
    }

    private handleDateInputChange(e: React.FormEvent<HTMLInputElement>): void {}
    private handleDateOfBirthChange(date: moment.Moment | null = null) {
        const updatedState = BasicAccountInfo.onDateOfBirthChange(
            date,
            this.state
        )
        this.setState({ ...updatedState })
    }

    private static onDateOfBirthChange(
        date: moment.Moment | null = null,
        state
    ) {
        let { formData, errors, errorMessages } = state
        if (!date) {
            errors.dob = true
            errorMessages.dob = ''
            return {
                selectedDob: null,
                formData,
                errors,
                errorMessages
            }
        } else {
            formData.dob = moment(date, moment.ISO_8601).format()
            if (!validator.isISO8601(formData.dob)) {
                errors.dob = true
                errorMessages.dob = 'Invalid date'
            } else {
                errors.dob = false
                errorMessages.dob = ''
            }

            return {
                selectedDob: date.toDate(),
                formData,
                errors,
                errorMessages
            }
        }
    }

    private onCountryValueChange(country: string) {
        let { formData } = this.state
        formData.country = country

        this.setState({ formData })
    }

    private isValidDataInput(inputName: string, value: any): boolean {
        switch (inputName) {
            case 'firstName':
                return validator.isLength(value, { min: 2, max: 100 })
            case 'lastName':
                return validator.isLength(value, { min: 2, max: 100 })
            case 'state':
                return validator.isLength(value, { min: 5, max: 500 })
            case 'county':
                return validator.isLength(value, { min: 5, max: 500 })
            case 'town':
                return validator.isLength(value, { min: 2, max: 100 })
            default:
                return true
        }
    }

    private onFormValueChange(
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) {
        let { formData, errorMessages, errors } = this.state
        const value = event.target.value
        const name = event.target.name

        formData[name] = value

        if (event.target.validity && !event.target.validity.valid) {
            errorMessages[name] = event.target.validationMessage
            errors[name] = true
        } else if (this.isValidDataInput(name, value) !== true) {
            errorMessages[name] = 'Invalid value provided.'
            errors[name] = true
        } else {
            errorMessages[name] = ''
            errors[name] = false
        }

        this.setState({ formData, errorMessages, errors })
    }

    private handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        await this.props.saveAccountInfo(this.state.formData)
    }

    public render() {
        return (
            <Card>
                <form onSubmit={this.handleSubmit}>
                    <CardHeader
                        title="Account Info"
                        subheader={
                            <Typography color="primary">
                                * required fields
                            </Typography>
                        }
                    />
                    <CardContent>
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
                                        autoComplete="off"
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
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
                                    error={this.state.errors.middleName}
                                    required={false}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="middleName">
                                        Middle name
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
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
                                    error={this.state.errors.lastName}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="lastName">
                                        Last name
                                    </InputLabel>
                                    <Input
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
                                        type="text"
                                        autoComplete="off"
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
                                <FormControl
                                    required={true}
                                    fullWidth={true}
                                    error={this.state.errors.dob}
                                >
                                    <InlineDatePicker
                                        keyboard={true}
                                        className={
                                            !this.state.isEditing
                                                ? this.props.classes
                                                      .datePickerDisabled
                                                : ''
                                        }
                                        name="selectedDob"
                                        autoComplete="off"
                                        label="Date of birth"
                                        disabled={!this.state.isEditing}
                                        keyboardIcon={
                                            this.state.isEditing ? (
                                                <EventIcon />
                                            ) : null
                                        }
                                        leftArrowIcon={<ChevronLeftIcon />}
                                        rightArrowIcon={<ChevronRightIcon />}
                                        disableFuture={true}
                                        maxDate={this.maxDateOfBirth}
                                        required={true}
                                        format="MM/DD/YYYY"
                                        mask={[
                                            /\d/,
                                            /\d/,
                                            '/',
                                            /\d/,
                                            /\d/,
                                            '/',
                                            /\d/,
                                            /\d/,
                                            /\d/,
                                            /\d/
                                        ]}
                                        placeholder="MM/DD/YYYY"
                                        autoOk={true}
                                        value={this.state.selectedDob}
                                        onChange={this.handleDateOfBirthChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.dob}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={6}>
                                <SelectCountry
                                    currentCountry={this.state.formData.country}
                                    isEditing={this.state.isEditing}
                                    onCountryValueChange={
                                        this.onCountryValueChange
                                    }
                                />
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.state}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="state">
                                        Region
                                    </InputLabel>
                                    <Input
                                        error={this.state.errors.state}
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Region"
                                        name="state"
                                        value={this.state.formData.state}
                                        onChange={this.onFormValueChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.state}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.streetAddress}
                                    required={false}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="streetAddress">
                                        Street Address
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
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
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.town}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="town">
                                        Town/City
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
                                        placeholder="Town/City"
                                        name="town"
                                        value={this.state.formData.town}
                                        onChange={this.onFormValueChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.town}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                        </Grid>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.postCode}
                                    required={false}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="postCode">
                                        Postal Code
                                    </InputLabel>
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
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
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.phoneNumber}
                                    required={false}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="postCode">
                                        Phone Number
                                    </InputLabel>
                                    <Input
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
                                        type="phone"
                                        autoComplete="off"
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
                    </CardContent>
                    <AccountSectionActions
                        enableEdit={!this.props.accountIsVerified}
                        isEditing={this.state.isEditing}
                        hasError={this.formHasError}
                        isSaving={this.props.isSaving}
                    />
                </form>
            </Card>
        )
    }
}

export default withStyles(styles)(BasicAccountInfo)
