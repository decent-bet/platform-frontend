import IBasicAccountInfoState from './IBasicAccountInfoState'
export default class BasicAccountInfoState implements IBasicAccountInfoState {
    constructor() {}
    public selectedDob = null
    public isEditing = false
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
