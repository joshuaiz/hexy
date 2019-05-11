import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as PlusCircle } from '../../images/plus_circle.svg'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { ReactComponent as Heart } from '../../images/heart.svg'
import { getReadableColor, getNamedColor } from '../../utils/helpers'
import './Swatch.scss'

const Swatch = ({
    color,
    index,
    handleFavorites,
    isFavorite,
    removeFavorite,
    favorites
}) => {
    const [namedColor, setNamedColor] = useState()
    const readableColor = getReadableColor(color)

    // console.log(color)

    // your link creation
    const params = {
        pathname: `/color/${color && color.hex.slice(1)}`,
        color: {
            name: color && color.name ? color.name : '',
            hex: color && color.hex ? color.hex : '#000000'
        }
        // name: color.name
    }

    useEffect(() => {
        const named = getNamedColor(color)
        if (named) {
            setNamedColor(named)
        }
    }, [color])

    // console.log('namedColor', namedColor)

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
                            handleFavorites({
                                name:
                                    namedColor && namedColor.length
                                        ? namedColor[0].name
                                        : color.name,
                                hex: color.hex
                            })
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
                    <Link to={params}>
                        <div className="swatch-hex">{color.hex}</div>
                        <div className="swatch-name">
                            {namedColor && namedColor.length
                                ? namedColor[0].name
                                : color.name}
                        </div>
                    </Link>
                </div>
            </div>
        </li>
    )
}

export default Swatch
