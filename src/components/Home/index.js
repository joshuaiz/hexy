import React, { useState, useEffect, useRef } from 'react'
import { withRouter, Link } from 'react-router-dom'
import ScrollAnimation from 'react-animate-on-scroll'
import ScrollableAnchor from 'react-scrollable-anchor'
import { configureAnchors } from 'react-scrollable-anchor'
import { useScroll } from '../../hooks/useScroll'
import { getRandomColors } from '../../utils/helpers'
import { ReactComponent as CircleSquares } from '../../images/circle_squares.svg'
import { ReactComponent as Infinity } from '../../images/infinity.svg'
import { ReactComponent as Code } from '../../images/code.svg'
import { ReactComponent as Lock } from '../../images/lock.svg'
import { ReactComponent as Links } from '../../images/link.svg'
import { ReactComponent as PaletteCircle } from '../../images/palette_circle.svg'
import { ReactComponent as Info } from '../../images/info.svg'
import { ReactComponent as HeartCircle } from '../../images/heart_circle.svg'
import Hero from './Hero'
import RandomSwatches from '../RandomSwatches'
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
    const [random, setRandom] = useState()
    const { scrollX, scrollY, scrollDirection } = useScroll()
    const [scrolledTo, setScrolledTo] = useState({
        scroll1: false,
        scroll2: false,
        scroll3: false
    })

    configureAnchors({ scrollDuration: 1000 })

    const randomColor = () => {
        let color = getRandomColors(1)
        // console.log('random', color)
        let hexString = color[0].hex.substring(1)
        return (
            <Link to={`/color/${hexString}`} target="_blank">
                {color[0].name} ({color[0].hex})
            </Link>
        )
    }
    useEffect(() => {
        const random = randomColor()
        setRandom(random)
    }, [])

    useEffect(() => {
        if (scrollY <= 200) {
            setScrolledTo({
                scroll1: false,
                scroll2: false,
                scroll3: false
            })
        }
        if (scrollDirection === 'up') {
            if (scrollY >= 200) {
                // console.log('scrolled to 200')
                setScrolledTo({
                    scroll1: true,
                    scroll2: false,
                    scroll3: false
                })
            }
            if (scrollY >= 400) {
                // console.log('scrolled to 350')
                setScrolledTo({
                    scroll1: true,
                    scroll2: true,
                    scroll3: false
                })
            }
            if (scrollY >= 600) {
                // console.log('scrolled to 500')
                setScrolledTo({
                    scroll1: true,
                    scroll2: true,
                    scroll3: true
                })
            }
        }
    }, [useScroll, scrollY, scrollDirection])

    // console.log(scrollY, scrolledTo, scrollDirection)

    return (
        <div className="page-home">
            <Hero />

            <div className="home-content">
                <div className="home-features">
                    <div className="features-1 features">
                        <div className="features-image">
                            {/*<img src={abstract2} alt="abstract shapes" />*/}
                            <ScrollAnimation
                                animateIn="fadeIn"
                                delay={2}
                                animateOnce={true}
                            >
                                <div className="outer">
                                    <div
                                        className={`inner inner1 ${
                                            scrolledTo.scroll1 ? 'scroll1' : ''
                                        }`}
                                    >
                                        <div className="box box1" />
                                        <div className="box box2" />
                                        <div className="box box3" />
                                        <div className="box box4" />
                                        <div className="box box5" />
                                        <div className="box box6" />
                                    </div>
                                </div>
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
                                as a favorite. Check out {random && random}.
                            </p>
                        </div>
                        <div className="features-image">
                            <ScrollAnimation
                                animateIn="fadeIn"
                                delay={2}
                                animatePreScroll={false}
                                animateOnce={true}
                            >
                                <div className="outer">
                                    <div
                                        className={`inner inner2 ${
                                            scrolledTo.scroll2 ? 'scroll2' : ''
                                        }`}
                                    >
                                        <div className="box box1" />
                                        <div className="box box2" />
                                        <div className="box box3" />
                                        <div className="box box4" />
                                        <div className="box box5" />
                                        <div className="box box6" />
                                    </div>
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>
                    <div className="features-3 features">
                        <div className="features-image">
                            <ScrollAnimation
                                animateIn="fadeIn"
                                delay={2}
                                animateOnce={true}
                                animatePreScroll={false}
                            >
                                <div className="outer">
                                    <div
                                        className={`inner inner3 ${
                                            scrolledTo.scroll3 ? 'scroll3' : ''
                                        }`}
                                    >
                                        <div className="box box1" />
                                        <div className="box box2" />
                                        <div className="box box3" />
                                        <div className="box box4" />
                                        <div className="box box5" />
                                        <div className="box box6" />
                                    </div>
                                </div>
                            </ScrollAnimation>
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
                                <a href="#home-go-pro">
                                    Learn more about Hexy Pro
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
                <ScrollableAnchor id={'home-go-pro'}>
                    <span />
                </ScrollableAnchor>
                <div className="home-go-pro">
                    <div className="go-pro-bg">
                        <div className="go-pro-bg-inner">
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                    <h2>Get more with Hexy Pro.</h2>
                    <div className="go-pro">
                        <p>
                            <Link to="/pro">
                                <strong>Hexy Pro</strong>
                            </Link>{' '}
                            gives power users more features and more ways to
                            save and share their favorite colors:
                        </p>
                        <ul className="nostyle pro-features">
                            <li className="fifteen-favorites">
                                <CircleSquares />
                                <h3>Save up to 15 favorites to a palette</h3>
                                <p>
                                    Because sometimes 5 colors just isn't
                                    enough.
                                </p>
                            </li>
                            <li>
                                <Infinity />
                                <h3>
                                    Save unlimited palettes to your profile*
                                </h3>
                                <p>*With a Pro Lifetime account.</p>
                            </li>
                            <li>
                                <Code />
                                <h3>Export CSS/SCSS code</h3>
                                <p>Need hex codes quickly? We got you.</p>
                            </li>
                            <li>
                                <Lock />
                                <h3>Private palettes</h3>
                                <p>
                                    Keep your palettes yours until you're ready
                                    to share.
                                </p>
                            </li>
                            <li>
                                <Links />
                                <h3>Share palettes with private link</h3>
                                <p>
                                    Great for showing to clients or team
                                    members.
                                </p>
                            </li>
                            <li>
                                <PaletteCircle />
                                <h3>View and browse entire color library</h3>
                                <p>Access to all 18,000+ colors on one page.</p>
                            </li>
                            <li>
                                <Info />
                                <h3>Dedicated support</h3>
                                <p>
                                    Our team will help you get the most out of
                                    Hexy.
                                </p>
                            </li>
                            <li>
                                <HeartCircle />
                                <h3>Early access to new colors</h3>
                                <p>
                                    As the library is updated, see new colors
                                    first.
                                </p>
                            </li>
                        </ul>
                        <div className="go-pro-cta">
                            <Link to="/pro">
                                <button className="button">
                                    View Plans and Pricing
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className="go-pro-bg-2" />
                </div>
                <RandomSwatches
                    numRandoms={8}
                    favorites={favorites}
                    handleFavorites={handleFavorites}
                    removeFavorites={removeFavorites}
                    favoriteSwatches={favoriteSwatches}
                    setFavoriteSwatches={setFavoriteSwatches}
                />
            </div>
        </div>
    )
}

export default withRouter(Home)
