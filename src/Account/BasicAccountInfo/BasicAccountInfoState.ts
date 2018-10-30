export interface IBasicAccountInfoState {
    isEditing: boolean
    selectedDob?: Date | null
    selectedCountry: any
    formData: {
        firstName: string
        middleName: string
        lastName: string
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
        dob: boolean
        country: boolean
        state: boolean
        streetAddress: boolean
        phoneNumber: boolean
        postCode: boolean
        town: boolean
    }
}

export class BasicAccountInfoState implements IBasicAccountInfoState {
    constructor(public selectedDob: Date) {}
    public isEditing = false
    public selectedCountry = null
    public formData = {
        firstName: '',
        middleName: '',
        lastName: '',
        dob: '',
        country: '',
        state: '',
        streetAddress: '',
        phoneNumber: '',
        postCode: '',
        town: ''
    }
    public errorMessages = {
        firstName: '',
        middleName: '',
        lastName: '',
        dob: '',
        country: '',
        state: '',
        streetAddress: '',
        phoneNumber: '',
        postCode: '',
        town: ''
    }
    public errors = {
        firstName: false,
        middleName: false,
        lastName: false,
        dob: false,
        country: false,
        state: false,
        streetAddress: false,
        phoneNumber: false,
        postCode: false,
        town: false
    }
}
