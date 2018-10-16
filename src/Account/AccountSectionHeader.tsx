import * as React from 'react'
import { CardHeader } from '@material-ui/core'

export interface IAccountSectionHeaderProps {
    title: string
    didClickOnEdit: (event: React.MouseEvent) => void
    didClickOnCancel: (event: React.MouseEvent) => void
    isEditing: boolean
    isSaving: boolean
    enableEdit: boolean
}

export default class AccountSectionHeader extends React.Component<
    IAccountSectionHeaderProps
> {
    constructor(props: IAccountSectionHeaderProps) {
        super(props)
        // this.renderActions = this.renderActions.bind(this)
    }

    /* private renderActions() {
        return this.props.isEditing ? (
            <Tooltip title="Cancel">
                <IconButton
                    disabled={this.props.isSaving}
                    onClick={this.props.didClickOnCancel}
                >
                    <CancelIcon />
                </IconButton>
            </Tooltip>
        ) : (
            <Tooltip title="Edit">
                <IconButton onClick={this.props.didClickOnEdit}>
                    <EditIcon />
                </IconButton>
            </Tooltip>
        )
    } */

    public render() {
        return <CardHeader title={this.props.title} />

        // return <CardHeader title={this.props.title} />
    }
}
