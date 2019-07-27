import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import SwatchActions from './SwatchActions'
import { ReactComponent as PlusCircle } from '../../images/plus_circle.svg'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { ReactComponent as Heart } from '../../images/heart.svg'
import { ReactComponent as Ellipsis } from '../../images/ellipsis.svg'
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
    const [actions, setActions] = useState()
    const readableColor = getReadableColor(color)

    const params = {
        pathname: `/color/${color && color.hex.slice(1)}`,
        color: {
            name:
                namedColor && namedColor.length
                    ? namedColor[0].name
                    : color.name,
            hex: color && color.hex ? color.hex : '#000000'
        }
    }

    useEffect(() => {
        const named = getNamedColor(color)
        if (named) {
            setNamedColor(named)
        }
    }, [color])

    // actions menu can get stuck so let's hide it if so after mouse stopped
    useEffect(() => {
        let timeout
        document.onmousemove = function() {
            // console.log('mouse stopped!')
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                setActions(false)
            }, 5000)
        }
    })

    return (
        <li
            className={`swatch ${isFavorite ? 'favorite' : ''}`}
            key={color.hex + isFavorite ? '-favorite' : null}
        >
            <span
                className="actions-trigger"
                aria-haspopup="true"
                aria-expanded={`${actions ? 'true' : 'false'}`}
                onMouseEnter={() => setActions(true)}
            >
                <Ellipsis style={{ fill: readableColor }} />
            </span>
            {actions && (
                <div className="actions-wrap">
                    <SwatchActions
                        handleFavorites={handleFavorites}
                        removeFavorite={removeFavorite}
                        isFavorite={isFavorite}
                        readableColor={readableColor}
                        namedColor={namedColor}
                        color={color}
                        setActions={setActions}
                    />
                </div>
            )}
            <div
                className="swatch-color"
                style={{
                    color: readableColor,
                    background: color.hex
                }}
            >
                {isFavorite && (
                    <span className="favorite-heart">
                        <Heart style={{ fill: readableColor }} />
                    </span>
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
