import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
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

    // console.log(color)

    // your link creation
    const params = {
        pathname: `/color/${color && color.hex.slice(1)}`,
        color: { name: color && color.name, hex: color && color.hex }
        // name: color.name
    }

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
                    <Link to={params}>
                        <div className="swatch-hex">{color.hex}</div>
                        <div className="swatch-name">{color.name}</div>
                    </Link>
                </div>
            </div>
        </li>
    )
}

export default Swatch
