import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function DiscoverFavorites() {
    return (
        <div className="col-6 py-2 pl-0 pr-3">
            <div className="top-right">
                <p className="text-right text-uppercase clickable">
                    Favorite Slots <FontAwesomeIcon icon="caret-right" />
                </p>
            </div>
        </div>
    )
}
