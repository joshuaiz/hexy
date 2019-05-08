import React, { useState, Fragment } from 'react'
import { ReactComponent as PlusCircle } from '../../images/plus_circle.svg'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { ReactComponent as Heart } from '../../images/heart.svg'
import { getReadableColor } from '../../utils/helpers'
import './Swatch.scss'

const Swatch = ({
    color,
    index,
    handleFavorites,
    isFavorite,
    removeFavorite,
    favorites
}) => {
    const readableColor = getReadableColor(color)

    return (
        <li
            className={`swatch ${isFavorite ? 'favorite' : ''}`}
            key={color.hex + isFavorite ? '-favorite' : null}
        >
            <div
                className="swatch-color"
                style={{
                    color: readableColor,
                    background: color.hex
                }}
            >
                {!isFavorite ? (
                    <span
                        className="add-favorite"
                        onClick={() => {
                            handleFavorites(color)
                        }}
                    >
                        <PlusCircle style={{ fill: readableColor }} />
                    </span>
                ) : (
                    <Fragment>
                        <span className="favorite-heart">
                            <Heart style={{ fill: readableColor }} />
                        </span>
                        <span
                            className="remove-favorite"
                            onClick={() => {
                                removeFavorite(color)
                            }}
                        >
                            <TimesCircle style={{ fill: readableColor }} />
                        </span>
                    </Fragment>
                )}
                <div className="swatch-content">
                    <div className="swatch-hex">{color.hex}</div>
                    <div className="swatch-name">{color.name}</div>
                </div>
            </div>
        </li>
    )
}

export default Swatch
