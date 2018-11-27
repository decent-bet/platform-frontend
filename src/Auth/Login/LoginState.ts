export interface ILoginState {
    loading: boolean

    formData: {
        email: string
        password: string
        recaptchaKey: string
    }

    errors: {
        email: boolean
        password: boolean
        recaptchaKey: boolean
    }

    errorsMessages: {
        email: string
        password: string
        recaptchaKey: string
    }
}

export class LoginState implements ILoginState {
    public loading = false
    public formData = {
        email: '',
        password: '',
        recaptchaKey: ''
    }

    public errors = {
        email: false,
        password: false,
        recaptchaKey: false
    }

    public errorsMessages = {
        email: '',
        password: '',
        recaptchaKey: ''
    }
}
