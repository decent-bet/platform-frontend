import * as React from 'react'
import { MenuItem, Paper, Typography, TextField } from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

function NoOptionsMessage(props) {
    return (
        <Typography className={{ padding: '2px 4px' }} {...props.innerProps}>
            {props.children}
        </Typography>
    )
}

const Placeholder = props => {
    return null
}

function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />
}

const IndicatorsContainer = (props: any) => {
    return (
        <div style={{ cursor: 'pointer' }}>
            {props.selectProps.isDisabled ? '' : <ArrowDropDownIcon />}
        </div>
    )
}

function Option(props) {
    return (
        <MenuItem
            buttonRef={props.innerRef}
            selected={props.isFocused}
            component="div"
            style={{
                fontWeight: props.isSelected ? 500 : 400
            }}
            {...props.innerProps}
        >
            {props.children}
        </MenuItem>
    )
}

function SingleValue(props) {
    return (
        <Typography
            style={{
                fontSize: 16
            }}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    )
}

function ValueContainer(props) {
    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                flex: 1,
                alignItems: 'center'
            }}
        >
            {props.children}
        </div>
    )
}

function Menu(props) {
    return (
        <Paper
            square={true}
            style={{
                position: 'absolute',
                zIndex: 1,
                marginTop: '2px',
                left: 0,
                right: 0
            }}
            {...props.innerProps}
        >
            {props.children}
        </Paper>
    )
}

function getTextFieldProps(error: boolean, helperText: string) {
    return {
        autoComplete: 'off',
        required: true,
        fullWidth: true,
        helperText,
        label: 'Country',
        placeholder: 'Country',
        error
    }
}

export default function getCustomComponents(error, errorMessage) {
    const textFieldProps = getTextFieldProps(error, errorMessage)

    function Control(props) {
        return (
            <TextField
                InputProps={{
                    inputComponent,
                    inputProps: {
                        style: {
                            display: 'flex',
                            padding: '0px 0 10px !important'
                        },
                        inputRef: props.innerRef,
                        children: props.children,
                        ...props.innerProps
                    }
                }}
                InputLabelProps={{
                    shrink:
                        props.hasValue ||
                        props.isFocused ||
                        props.selectProps.menuIsOpen
                }}
                {...textFieldProps}
            />
        )
    }

    return {
        Control,
        Placeholder,
        IndicatorsContainer,
        Menu,
        NoOptionsMessage,
        Option,
        SingleValue,
        ValueContainer
    }
}
