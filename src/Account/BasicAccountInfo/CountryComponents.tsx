import * as React from 'react'
import { MenuItem, Paper, Typography, TextField } from '@material-ui/core'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

function NoOptionsMessage(props) {
    return (
        <Typography
            className={props.selectProps.classes.noOptionsMessage}
            {...props.innerProps}
        >
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

function Control(props) {
    return (
        <TextField
            InputProps={{
                inputComponent,
                inputProps: {
                    className: props.selectProps.classes.input,
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
            {...props.selectProps.textFieldProps}
        />
    )
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
            className={props.selectProps.classes.singleValue}
            {...props.innerProps}
        >
            {props.children}
        </Typography>
    )
}

function ValueContainer(props) {
    return (
        <div className={props.selectProps.classes.valueContainer}>
            {props.children}
        </div>
    )
}

function Menu(props) {
    return (
        <Paper
            square={true}
            className={props.selectProps.classes.paper}
            {...props.innerProps}
        >
            {props.children}
        </Paper>
    )
}

const components = {
    Control,
    Placeholder,
    IndicatorsContainer,
    Menu,
    NoOptionsMessage,
    Option,
    SingleValue,
    ValueContainer
}

export default components
