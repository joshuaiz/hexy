import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FavoritesContext } from '../FavoritesContext'
import { getRandomColors } from '../../utils/helpers'
import { ReactComponent as Sync } from '../../images/sync.svg'
import { ReactComponent as Ellipsis } from '../../images/ellipsis.svg'
import Swatch from '../Swatch'

const RandomSwatches = ({ numRandoms }) => {
    const [randoms, setRandoms] = useState([])
    const [rotate, setRotate] = useState(false)

    const { favorites } = useContext(FavoritesContext)

    const getRandoms = () => {
        const randoms = getRandomColors(numRandoms)
        setRandoms(randoms)
    }

    useEffect(() => {
        getRandoms()
        // return undefined
    }, [])

    const handleReload = () => {
        getRandoms()
        setRotate(true)
        setTimeout(() => {
            setRotate(false)
        }, 500)
    }

    // don't think I need this
    // useEffect(() => {
    //     getFavorites()
    // }, [favorites, getFavorites])

    return (
        <div className="random-swatches">
            <div className="swatches-header">
                <h3>
                    <span
                        className={`more-trigger ${rotate ? 'rotate' : ''}`}
                        onClick={handleReload}
                    >
                        <Sync />
                    </span>{' '}
                    Here's eight random named colors. <br />
                    <span className="swatch-info">
                        Hover on any color and then on the <Ellipsis /> on the
                        top right of each swatch for actions like saving as a
                        favorite.{' '}
                    </span>
                </h3>
                <div className="swatches-link">
                    <Link to="/colors">
                        Explore more colors & view favorites &rarr;
                    </Link>
                </div>
            </div>

            <ul className="nostyle swatch-list">
                {randoms.map((color, index) => {
                    let isFavorite
                    if (favorites && favorites.length) {
                        isFavorite = favorites.some(el => el.hex === color.hex)
                    } else if (favorites.length === 0) {
                        isFavorite = false
                    }
                    return (
                        <Swatch
                            key={color.hex}
                            color={color}
                            index={index}
                            isFavorite={isFavorite}
                        />
                    )
                })}
            </ul>
        </div>
    )
}

export default RandomSwatches
