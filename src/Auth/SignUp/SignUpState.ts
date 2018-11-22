export interface ISignUpState {
    formSubmited: boolean
    acceptedTerms: boolean
    email: string
    password: string
    recaptchaKey: string
    passwordConfirmation: string

    errors: {
        email: boolean
        acceptedTerms: boolean
        password: boolean
        passwordConfirmation: boolean
    }

    errorMessages: {
        acceptedTerms: string
        email: string
        password: string
        passwordConfirmation: string
    }
}

export class SignUpState implements ISignUpState {
    public formSubmited = false
    public acceptedTerms = false
    public email = ''
    public password = ''
    public recaptchaKey = ''
    public passwordConfirmation = ''

    public errors = {
        acceptedTerms: false,
        email: false,
        password: false,
        passwordConfirmation: false
    }

    public errorMessages = {
        acceptedTerms: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    }
}
