import React from 'react'
import { Tab, Tabs } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const styles = {
    inkbar: {
        background: '#f2b45c'
    },
    tabItemContainer: {
        height: 60,
        background: 'rgba(0,0,0,0)',
        borderBottom: 'solid 1px'
    }
}

export default function DiscoverTabs() {
    return (
        <div className="col-6 py-2 pl-3 pr-0">
            <Tabs
                className="tabs"
                inkBarStyle={styles.inkbar}
                tabItemContainerStyle={styles.tabItemContainer}
            >
                <Tab
                    label={
                        <p className="mb-0">
                            <FontAwesomeIcon icon="heart" /> Favorites
                        </p>
                    }
                    buttonStyle={styles.button}
                />
                <Tab
                    label={
                        <p className="mb-0">
                            <FontAwesomeIcon icon="id-badge" /> New
                        </p>
                    }
                    buttonStyle={styles.button}
                />
                <Tab
                    label={
                        <p className="mb-0">
                            <FontAwesomeIcon icon="star" /> Killer Games
                        </p>
                    }
                    buttonStyle={styles.button}
                />
            </Tabs>
        </div>
    )
}
