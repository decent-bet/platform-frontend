export interface ISignUpState {
    formData: {
        aceptedTerms: boolean
        email: string
        password: string
        recaptchaKey: string
        passwordConfirmation: string
    }

    errors: {
        email: boolean
        aceptedTerms: boolean
        password: boolean
        passwordConfirmation: boolean
    }

    errorMessages: {
        aceptedTerms: string
        email: string
        password: string
        passwordConfirmation: string
    }
}

export class SignUpState implements ISignUpState {
    public formData = {
        aceptedTerms: false,
        email: '',
        password: '',
        recaptchaKey: '',
        passwordConfirmation: ''
    }

    public errors = {
        aceptedTerms: false,
        email: false,
        password: false,
        passwordConfirmation: false
    }

    public errorMessages = {
        aceptedTerms: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    }
}
