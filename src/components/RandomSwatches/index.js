import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getRandomColors } from '../../utils/helpers'
import { ReactComponent as PlusCircle } from '../../images/plus_circle.svg'
import { ReactComponent as Sync } from '../../images/sync.svg'
import { ReactComponent as Ellipsis } from '../../images/ellipsis.svg'
import Swatch from '../Swatch'

const RandomSwatches = ({
    numRandoms,
    favorites,
    handleFavorites,
    removeFavorites,
    favoriteSwatches,
    setFavoriteSwatches
}) => {
    const [randoms, setRandoms] = useState([])
    const [rotate, setRotate] = useState(false)

    const getRandoms = () => {
        const randoms = getRandomColors(numRandoms)
        setRandoms(randoms)
    }

    useEffect(() => {
        getRandoms()
        return undefined
    }, [])

    const handleReload = () => {
        getRandoms()
        setRotate(true)
        setTimeout(() => {
            setRotate(false)
        }, 500)
    }

    useCallback(() => {
        if (randoms && randoms.length && favorites && favorites.length) {
            const favSwatches = []
            const intersection = favorites.filter((element, index) => {
                const found = randoms.includes(element)
                favSwatches.push(found)
                return favSwatches
            })
            setFavoriteSwatches(intersection)
        }
    }, [randoms, favorites, setFavoriteSwatches])

    const randomColors = randoms.map((color, index) => {
        let isFavorite
        if (favoriteSwatches && favoriteSwatches.length) {
            isFavorite = favoriteSwatches.some(el => el.hex === color.hex)
        } else if (favoriteSwatches.length === 0) {
            isFavorite = false
        }
        return (
            <Swatch
                key={color.hex}
                color={color}
                index={index}
                favorites={favorites}
                handleFavorites={handleFavorites}
                removeFavorites={removeFavorites}
                isFavorite={isFavorite}
            />
        )
    })

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

            <ul className="nostyle swatch-list">{randomColors}</ul>
        </div>
    )
}

export default RandomSwatches
