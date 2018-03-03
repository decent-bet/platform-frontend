import React from 'react'

export default function DashboardDrawerHeader() {
    let imgSrc = process.env.PUBLIC_URL + '/assets/img/logos/dbet-white.svg'
    return (
        <div className="container drawer">
            <div className="row">
                <div className="col">
                    <img className="logo" alt="DBET Logo" src={imgSrc} />
                </div>
            </div>
        </div>
    )
}
