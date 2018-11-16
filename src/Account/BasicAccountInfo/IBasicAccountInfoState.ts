export default interface IBasicAccountInfoState {
    isEditing: boolean
    selectedDob: Date | null
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
