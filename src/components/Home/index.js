import React, { useState, useEffect, useCallback } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { getRandomColors } from '../../utils/helpers'
import { ReactComponent as PlusCircle } from '../../images/plus_circle.svg'
import { ReactComponent as Sync } from '../../images/sync.svg'
import { ReactComponent as Heart } from '../../images/heart.svg'
import { ReactComponent as SearchIcon } from '../../images/search-solid.svg'
import { ReactComponent as Rocket } from '../../images/rocket.svg'
import Hero from './Hero'
import Swatch from '../Swatch'
import './Home.scss'

const Home = ({
    location,
    history,
    colors,
    favorites,
    handleFavorites,
    removeFavorites,
    favoriteSwatches,
    setFavoriteSwatches
}) => {
    const [homeRandoms, setHomeRandoms] = useState([])
    const [rotate, setRotate] = useState(false)

    const getHomeRandoms = () => {
        const randoms = getRandomColors(8)
        setHomeRandoms(randoms)
    }

    useEffect(() => {
        getHomeRandoms()
        return undefined
    }, [])

    const handleReload = () => {
        getHomeRandoms()
        setRotate(true)
        setTimeout(() => {
            setRotate(false)
        }, 500)
    }

    useCallback(() => {
        if (
            homeRandoms &&
            homeRandoms.length &&
            favorites &&
            favorites.length
        ) {
            const favSwatches = []
            const intersection = favorites.filter((element, index) => {
                const found = homeRandoms.includes(element)
                favSwatches.push(found)
                return favSwatches
            })
            setFavoriteSwatches(intersection)
        }
    }, [homeRandoms, favorites, setFavoriteSwatches])

    const randomColors = homeRandoms.map((color, index) => {
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
        <div className="page-home">
            <Hero />
            <div className="home-swatches">
                <div className="swatches-header">
                    <h3>
                        <span
                            className={`more-trigger ${rotate ? 'rotate' : ''}`}
                            onClick={handleReload}
                        >
                            <Sync />
                        </span>{' '}
                        Here's eight random named colors.{' '}
                        <span className="swatch-info">
                            Hover on any color and click <PlusCircle /> to add
                            as a favorite.{' '}
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
            <div className="home-content">
                <ul className="nostyle home-tiles">
                    <li>
                        <h2>
                            <span className="svg-icon">
                                <Rocket />
                            </span>{' '}
                            Quick Start
                        </h2>
                        <div className="tile-content">
                            <p>
                                Visit the <Link to="/colors">Colors</Link> page
                                and start scrolling. When you find a color you
                                like, click the{' '}
                                <span className="svg-icon">
                                    <PlusCircle />
                                </span>{' '}
                                to add as a favorite. Your favorites will appear
                                in the Favorites sidebar. Toggle the sidebar
                                using the switch in the header.
                            </p>
                            <p>
                                Click on any swatches name or hex code to view a
                                detail page with color properties, harmonies,
                                shades/tints, and more.
                            </p>
                            <p>
                                The hope is that you discover new colors{' '}
                                <em>while</em> you are exploring the site and
                                these will inspire you to create something
                                beautiful. That's really the whole point of
                                Hexy.
                            </p>
                        </div>
                    </li>
                    <li>
                        <h2>
                            <span className="svg-icon">
                                <SearchIcon />
                            </span>{' '}
                            Search Tips
                        </h2>
                        <div className="tile-content">
                            <p>
                                If you're looking for something specific, a
                                great way to find colors on Hexy is to search.
                                If you're looking for a nice shade of green, by
                                all means type in "green" — you will get a lot
                                of greens to choose from.
                            </p>

                            <p>
                                Yet, not all greens will have "green" in the
                                name so you can also get creative and search for
                                things like "willow" or "tree" or "forest" or
                                "wasabi".
                            </p>

                            <p>
                                You can also try descriptors like "vivid" or
                                "muted" and adjectives like "vintage" or
                                "tropical".
                            </p>
                            <p>
                                You can also search for specific hex values and
                                if there is no named color, Hexy will return the
                                closest named color.
                            </p>

                            <p>
                                Note that while the{' '}
                                <Link to="/colors">Colors</Link> page only shows
                                1000 colors at a time, search looks through the
                                entire list of 18,000+ colors!
                            </p>
                        </div>
                    </li>
                    <li>
                        <h2>
                            <span className="svg-icon">
                                <Heart />
                            </span>{' '}
                            Favorites
                        </h2>
                        <div className="tile-content">
                            <p>
                                You can save any color (even a non-named color)
                                as a Favorite and up to 15 Favorites at any one
                                time.
                            </p>

                            <p>
                                While five colors is often a good number for a
                                website palette, being able to view and group
                                more colors really helps to find the perfect hue
                                for your project. And sometimes five just isn't
                                enough.
                            </p>

                            <p>
                                You can export your Favorites to an editable PDF
                                file at any time from the Favorites sidebar.
                                Hexy's Favorites are an awesome way to find and
                                download palettes or color groups quickly and
                                use them in your designs or code right away.
                            </p>
                            <p>
                                <Link to="/colors">
                                    Explore more colors & view favorites &rarr;
                                </Link>
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default withRouter(Home)
