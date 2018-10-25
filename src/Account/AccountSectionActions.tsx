import * as React from 'react'
import { CardActions } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import LoadingButton from '../common/components/LoadingButton'

export interface IAccountSectionActionsProps {
    isEditing: boolean
    isSaving: boolean
    hasError: boolean
    enableEdit: boolean
}

export default class AccountSectionActions extends React.Component<
    IAccountSectionActionsProps
> {
    constructor(props: IAccountSectionActionsProps) {
        super(props)
    }

    public render() {
        return this.props.isEditing && this.props.enableEdit ? (
            <CardActions>
                <LoadingButton
                    isLoading={this.props.isSaving}
                    type="submit"
                    style={{ margin: '1em' }}
                    variant="contained"
                    disabled={this.props.isSaving || this.props.hasError}
                    color="primary"
                >
                    Save
                    <SaveIcon style={{ marginLeft: '1em' }} />
                </LoadingButton>
            </CardActions>
        ) : (
            <br />
        )
    }
}
