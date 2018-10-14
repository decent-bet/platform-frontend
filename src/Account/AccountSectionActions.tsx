import * as React from 'react'
import { CardActions, Button } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'

export interface IAccountSectionActionsProps {
    isEditing: boolean
    isSaving: boolean
}

export default class AccountSectionActions extends React.Component<
    IAccountSectionActionsProps
> {
    constructor(props: IAccountSectionActionsProps) {
        super(props)
    }

    public render() {
        return this.props.isEditing ? (
            <CardActions>
                <Button
                    type="submit"
                    style={{ margin: '1em' }}
                    variant="contained"
                    disabled={this.props.isSaving}
                    color="primary"
                >
                    Save
                    <SaveIcon style={{ marginLeft: '1em' }} />
                </Button>
            </CardActions>
        ) : (
            <span />
        )
    }
}
