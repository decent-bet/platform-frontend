import * as React from 'react'
import { CardHeader, IconButton, Tooltip } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import CancelIcon from '@material-ui/icons/Cancel'

export interface IAccountSectionHeaderProps {
    title: string
    didClickOnEdit: (event: React.MouseEvent) => void
    didClickOnCancel: (event: React.MouseEvent) => void
    isEditing: boolean
    isSaving: boolean
}

export default class AccountSectionHeader extends React.PureComponent<
    IAccountSectionHeaderProps
> {
    constructor(props: IAccountSectionHeaderProps) {
        super(props)
    }

    public render() {
        return (
            <CardHeader
                title={this.props.title}
                action={
                    this.props.isEditing ? (
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
                }
            />
        )
    }
}
