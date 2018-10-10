/**
 * Created by user on 7/4/2017.
 */
import React from 'react'
import PropTypes from 'prop-types'

const Iframe = props => {
    const styles = {
        ...props.styles,
        position: props.position || 'absolute',
        display: props.display || 'block',
        height: props.height || '100%',
        width: props.width || '100%'
    }
    return (
        <iframe
            title={props.url}
            frameBorder="0"
            id={props.id}
            src={props.url + '/index.html'}
            target="_parent"
            allowFullScreen={props.allowFullScreen || false}
            style={styles}
            height={props.height || '100%'}
            width={props.width || '100%'}
        />
    )
}

Iframe.propTypes = {
    id: PropTypes.string,
    url: PropTypes.string.isRequired,
    width: PropTypes.string,
    position: PropTypes.string,
    display: PropTypes.string,
    height: PropTypes.string,
    styles: PropTypes.object,
    allowFullScreen: PropTypes.bool
}
export default Iframe
