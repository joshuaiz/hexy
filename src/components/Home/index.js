import React, { useState, useEffect, useCallback } from 'react'
import { withRouter, Link } from 'react-router-dom'
import ScrollAnimation from 'react-animate-on-scroll'
import { getRandomColors } from '../../utils/helpers'
import { ReactComponent as PlusCircle } from '../../images/plus_circle.svg'
import { ReactComponent as Sync } from '../../images/sync.svg'
import { ReactComponent as Heart } from '../../images/heart.svg'
import { ReactComponent as SearchIcon } from '../../images/search-solid.svg'
import { ReactComponent as Rocket } from '../../images/rocket.svg'
import Hero from './Hero'
import Swatch from '../Swatch'
import RandomSwatches from '../RandomSwatches'
import abstract2 from '../../images/abstract2.png'
import abstract3 from '../../images/abstract3.png'
import abstract4 from '../../images/abstract4.png'
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
    return (
        <div className="page-home">
            <Hero />

            <div className="home-content">
                <div className="home-features">
                    <div className="features-1 features">
                        <div className="features-image">
                            <ScrollAnimation animateIn="fadeIn" delay={2}>
                                <img src={abstract2} alt="abstract shapes" />
                            </ScrollAnimation>
                        </div>

                        <div className="features-content">
                            <h3>Cool colors, quickly.</h3>
                            <p>
                                Search and browse named colors by keyword,
                                theme, descriptor or hex code.
                            </p>
                            <p>
                                It's never been easier to find the perfect
                                colors for your project. Or just for fun.{' '}
                                <Link to="/colors">Browse colors &rarr;</Link>.
                            </p>
                        </div>
                    </div>
                    <div className="features-2 features">
                        <div className="features-content">
                            <h3>Explore more.</h3>
                            <p>
                                With a library of 18,000+ colors, there's always
                                more to discover. And color detail pages go
                                deeper with color properties, harmonies, and
                                tints/shades &mdash; any of which can be added
                                as a favorite. Check out{' '}
                                <Link to="/color/3b4271" target="_blank">
                                    Space Angel (#3b4271)
                                </Link>
                                .
                            </p>
                        </div>
                        <div className="features-image">
                            <ScrollAnimation
                                animateIn="rollIn"
                                duration={5}
                                // scrollableParentSelector=".home-features"
                                animatePreScroll={false}
                            >
                                <img src={abstract4} alt="abstract shapes" />
                            </ScrollAnimation>
                        </div>
                    </div>
                    <div className="features-3 features">
                        <div className="features-image">
                            <img src={abstract3} alt="abstract shapes" />
                        </div>
                        <div className="features-content">
                            <h3>Your colors, your way.</h3>
                            <p>
                                Export palettes with one click to an editable
                                PDF you can use in any design program right
                                away.
                            </p>
                            <p>
                                <Link to="/pro">Pro</Link> users can save up to
                                15 colors to a palette and save palettes to
                                their profile to export or share anytime. <br />
                                <Link to="/pro">Learn more about Hexy Pro</Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
                <div class="home-go-pro">
                    <div className="go-pro-bg" />
                    <h2>Get more with Hexy Pro.</h2>
                    <div className="go-pro">
                        <p>
                            Hexy Pro gives power users more features and more
                            ways to save and share their favorite colors:
                        </p>
                        <ul class="nostyle pro-features">
                            <li>Save up to 15 favorites to a palette</li>
                            <li>
                                Save up to unlimited palettes to your profile
                            </li>
                            <li>Private palettes</li>
                            <li>Share palettes with private link</li>
                            <li>View and browse entire color library</li>
                            <li>Dedicated support</li>
                            <li>Early access to new colors</li>
                        </ul>
                    </div>
                </div>
                <RandomSwatches
                    numRandoms={8}
                    favorites={favorites}
                    handleFavorites={handleFavorites}
                    removeFavorites={removeFavorites}
                    favoriteSwatches={favoriteSwatches}
                    setFavoriteSwatches={setFavoriteSwatches}
                />
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
