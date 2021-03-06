export interface IAccountAddressState {
    isEditing: boolean
    address: string
    privateKey: string
    privateKeyOrMnemonic: string
    errors: {
        address: boolean
        privateKey: boolean
    }
    errorMessages: {
        address: string
        privateKey: string
    }
}

export class AccountAddressState implements IAccountAddressState {
    public isEditing = false
    public address = ''
    public privateKey = ''
    public privateKeyOrMnemonic = ''

    public errors = {
        address: false,
        privateKey: false
    }

    public errorMessages = {
        address: '',
        privateKey: ''
    }
}
