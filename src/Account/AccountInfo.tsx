import * as React from 'react'
import {
    Grid,
    Card,
    CardContent,
    Input,
    Select as MuiSelect,
    InputLabel,
    MenuItem,
    FormControl,
    FormHelperText
} from '@material-ui/core'
import Select from 'react-select'
import { DatePicker } from 'material-ui-pickers'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import CalendarTodayIcon from '@material-ui/icons/CalendarToday'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { subYears, format, parse } from 'date-fns'
import * as validator from 'validator'
import countries from 'iso-3166-1/src/iso-3166'
import { WithStyles, withStyles, createStyles, Theme } from '@material-ui/core'
import AccountSectionHeader from './AccountSectionHeader'
import AccountSectionActions from './AccountSectionActions'
import CountryComponents from './CountryComponents'

const FORMAT_DOB = `YYYY-MM-dd'T'X`
const COUNTRY_LIST: [{ label: string; value: string }] = countries.map(
    (item, index) => {
        return { label: item.country, value: item.alpha3 }
    }
)

const SEXLIST = ['Male', 'Female']
const styles = (theme: Theme) =>
    createStyles({
        datePickerDisabled: {
            '& > div:before': {
                borderBottom: 'none !important',
                content: ''
            }
        },
        disableInputUnderline: {
            '& div div:before': {
                borderBottom: 'none !important',
                content: ''
            }
        },
        root: {
            flexGrow: 1,
            height: 250
        },
        input: {
            display: 'flex'
        },
        valueContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            flex: 1,
            alignItems: 'center'
        },
        noOptionsMessage: {
            padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
        },
        singleValue: {
            fontSize: 16
        },
        placeholder: {
            position: 'absolute',
            left: 2,
            fontSize: 16
        },
        paper: {
            position: 'absolute',
            zIndex: 1,
            marginTop: theme.spacing.unit,
            left: 0,
            right: 0
        },
        divider: {
            height: theme.spacing.unit * 2
        }
    })

interface IAccountInfoState {
    isEditing: boolean
    selectedDob: Date
    selectedCountry: any
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

export interface IAccountInfoProps extends WithStyles<typeof styles, true> {
    accountIsVerified: boolean
    account: any
    isSaving: boolean
    saveAccountInfo(data: any): void
}

class AccountInfo extends React.Component<
    IAccountInfoProps,
    IAccountInfoState
> {
    private maxDateOfBirth = subYears(new Date(), 18)

    constructor(props: IAccountInfoProps) {
        super(props)

        this.state = {
            isEditing: false,
            selectedDob: this.maxDateOfBirth,
            selectedCountry: null,
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

        this.onFormValueChange = this.onFormValueChange.bind(this)
        this.isValidDataInput = this.isValidDataInput.bind(this)
    }

    private get formHasError(): boolean {
        const {
            firstName,
            middleName,
            lastName,
            sex,
            dob,
            country,
            state,
            streetAddress,
            phoneNumber,
            postCode,
            town
        } = this.state.errors

        return (
            firstName ||
            middleName ||
            lastName ||
            sex ||
            dob ||
            country ||
            state ||
            streetAddress ||
            phoneNumber ||
            postCode ||
            town
        )
    }

    private _sexItems = SEXLIST.map((sex, index) => (
        <MenuItem value={sex} key={index}>
            {sex}
        </MenuItem>
    ))

    private didToogleEdit = (event: React.MouseEvent) => {
        let { isEditing } = this.state
        this.setState({ isEditing: !isEditing })
    }

    private handleDateOfBirthChange = date => {
        let { formData, errors, errorMessages } = this.state

        if (!date) {
            errors.dob = true
            errorMessages.dob = ''
            this.setState({
                selectedDob: date,
                formData,
                errors,
                errorMessages
            })
            return
        }

        formData.dob = format(date, FORMAT_DOB)
        if (!validator.isISO8601(formData.dob)) {
            errors.dob = true
            errorMessages.dob = 'Invalid date'
        } else {
            errors.dob = false
            errorMessages.dob = ''
        }

        this.setState({
            selectedDob: date,
            formData,
            errors,
            errorMessages
        })
    }

    private onCountryValueChange = (item: { value: string; label: string }) => {
        let { selectedCountry, formData, errorMessages, errors } = this.state
        if (formData.country === item.value) {
            return
        }

        formData.country = item.value || ''
        selectedCountry = item

        if (formData.country.length <= 0) {
            errors.country = true
            errorMessages.country = 'The country is required'
        } else if (!(validator as any).isISO31661Alpha3(item.value)) {
            errors.country = true
            errorMessages.country = 'Invalid country'
        } else {
            errors.country = false
            errorMessages.country = ''
        }

        this.setState({ selectedCountry, formData, errorMessages, errors })
    }

    private isValidDataInput(inputName: string, value: any): boolean {
        switch (inputName) {
            case 'firstName':
                return (
                    validator.isAlpha(value) &&
                    validator.isLength(value, { min: 2, max: 100 })
                )
            case 'lastName':
                return (
                    validator.isAlpha(value) &&
                    validator.isLength(value, { min: 2, max: 100 })
                )
            case 'sex':
                return validator.isIn(value, SEXLIST)
            case 'middleName':
                return (
                    validator.isAlpha(value) &&
                    validator.isLength(value, { min: 2, max: 100 })
                )
            case 'state':
                return validator.isLength(value, { min: 5, max: 500 })
            case 'county':
                return validator.isLength(value, { min: 5, max: 500 })
            case 'streetAddress':
                return validator.isLength(value, { min: 5, max: 500 })

            case 'phoneNumber':
                return validator.isMobilePhone(value, 'any')
            case 'postCode':
                return validator.isPostalCode(value, 'any')
            case 'town':
                return validator.isLength(value, { min: 2, max: 100 })
            default:
                return false
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

    public componentDidMount() {
        if (!this.props.accountIsVerified) {
            this.setState({ isEditing: true })
            this.handleDateOfBirthChange(this.state.selectedCountry)
        } else {

            const { basicVerification } = this.props.account.verification

            this.setState({
                selectedDob: parse(
                    basicVerification.dob,
                    'YYYY-MM-dd',
                    new Date()
                ),
                selectedCountry: COUNTRY_LIST.find(
                    item =>
                        item.value ===
                        basicVerification.country
                ),
                formData: {
                    firstName: basicVerification.firstName,
                    middleName: basicVerification.middleName,
                    lastName: basicVerification.lastName,
                    sex: basicVerification.sex,
                    dob: basicVerification.dob,
                    country: basicVerification.country,
                    state: basicVerification.state,
                    streetAddress: basicVerification
                        .streetAddress,
                    phoneNumber: basicVerification
                        .phoneNumber,
                    postCode: basicVerification.postCode,
                    town: basicVerification.town
                }
            })
        }
    }

    private handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()
        await this.props.saveAccountInfo(this.state.formData)
    }

    public render() {
        const { classes, theme } = this.props

        const selectStyles = {
            input: base => ({
                ...base,
                color: theme.palette.text.primary,
                '& input': {
                    font: 'inherit'
                }
            })
        }
        return (
            <Card>
                <form onSubmit={this.handleSubmit}>
                    <AccountSectionHeader
                        enableEdit={!this.props.accountIsVerified}
                        title="Account Info"
                        isEditing={this.state.isEditing}
                        isSaving={this.props.isSaving}
                        didClickOnCancel={this.didToogleEdit}
                        didClickOnEdit={this.didToogleEdit}
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
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="middleName">
                                        Middle name
                                    </InputLabel>
                                    <Input
                                        type="text"
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
                                    required={false}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="lastName">
                                        Last name
                                    </InputLabel>
                                    <Input
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
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
                                <FormControl
                                    required={true}
                                    error={this.state.errors.sex}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="sex">Sex</InputLabel>
                                    <MuiSelect
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
                                        fullWidth={true}
                                        IconComponent={
                                            !this.state.isEditing
                                                ? 'span'
                                                : ArrowDropDownIcon
                                        }
                                        value={this.state.formData.sex}
                                        onChange={this.onFormValueChange}
                                        name="sex"
                                        error={false}
                                        required={true}
                                    >
                                        <MenuItem value="">
                                            <em>Sex</em>
                                        </MenuItem>
                                        {this._sexItems}
                                    </MuiSelect>
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
                                            !this.state.isEditing
                                                ? classes.datePickerDisabled
                                                : ''
                                        }
                                        name="selectedDob"
                                        label="Date of birth"
                                        disabled={!this.state.isEditing}
                                        keyboardIcon={<CalendarTodayIcon />}
                                        leftArrowIcon={<ChevronLeftIcon />}
                                        rightArrowIcon={<ChevronRightIcon />}
                                        disableFuture={true}
                                        maxDate={this.maxDateOfBirth}
                                        required={true}
                                        format="MMM dd, YYYY"
                                        autoOk={true}
                                        value={this.state.selectedDob}
                                        onChange={this.handleDateOfBirthChange}
                                    />
                                    <FormHelperText>
                                        {this.state.errorMessages.dob}
                                    </FormHelperText>
                                </FormControl>
                            </Grid>
                            <Grid item={true} xs={12} sm={6}>
                                <Select
                                    name="country"
                                    styles={selectStyles}
                                    isDisabled={!this.state.isEditing}
                                    className={
                                        !this.state.isEditing
                                            ? classes.disableInputUnderline
                                            : ''
                                    }
                                    textFieldProps={{
                                        required: true,
                                        fullWidth: true,
                                        helperText: this.state.errorMessages
                                            .country,
                                        label: 'Country',
                                        placeholder: 'Country',
                                        error: this.state.errors.country
                                    }}
                                    defaultOptions={true}
                                    classes={classes}
                                    options={COUNTRY_LIST}
                                    components={CountryComponents}
                                    value={this.state.selectedCountry}
                                    onChange={this.onCountryValueChange}
                                    cacheOptions={true}
                                />
                            </Grid>
                        </Grid>
                        <Grid container={true} spacing={32}>
                            <Grid item={true} xs={12} sm={6}>
                                <FormControl
                                    error={this.state.errors.state}
                                    required={true}
                                    fullWidth={true}
                                >
                                    <InputLabel htmlFor="lastName">
                                        State
                                    </InputLabel>
                                    <Input
                                        error={this.state.errors.state}
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
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
                        </Grid>
                        <Grid container={true} spacing={32}>
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
                                        disableUnderline={!this.state.isEditing}
                                        disabled={!this.state.isEditing}
                                        type="phone"
                                        required={true}
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

export default withStyles(styles, { withTheme: true })(AccountInfo)
