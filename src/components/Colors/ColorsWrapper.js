import React from 'react'
import SwatchList from '../SwatchList'

const ColorsWrapper = React.memo(
    ({ noMatch, colors, searchSubmitted, sortBright }) => {
        return (
            <div className="colors-wrapper">
                <SwatchList
                    noMatch={noMatch}
                    colors={colors}
                    searchSubmitted={searchSubmitted}
                    sortBright={sortBright}
                />
            </div>
        )
    }
)

export default ColorsWrapper
