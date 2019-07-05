import React, { useState, useContext } from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as firebase from 'firebase/app'
import { Tooltip } from 'react-tippy'
import Switch from 'react-switch'
import SearchBox from './SearchBox'
import SiteID from '../SiteID'
import { ReactComponent as UserCircle } from '../../images/user-circle.svg'
import { ReactComponent as Cart } from '../../images/cart.svg'
import { getNumberOfNamedColors, humanize } from '../../utils/helpers'
import './Header.scss'

let num = getNumberOfNamedColors()

const Header = ({
    handleSearch,
    handleSearchInput,
    searchInput,
    handleSidebarToggle,
    isSidebarVisible,
    cart
}) => {
    const { user } = useAuthState(firebase.auth())
    const [iconHover, setIconHover] = useState(false)

    const handleLogout = () => {
        firebase.auth().signOut()
    }

    const handleMouseEnter = () => {
        setIconHover(true)
    }

    const handleMouseLeave = () => {
        setIconHover(false)
    }

    // clear hover state on reload
    window.onbeforeunload = () => {
        setIconHover(false)
    }

    return (
        <div id="top" className="header">
            <div className="header-bar">
                <SiteID />
                <div className="header-tagline">
                    Explore and discover {num ? num : '18,000+'} named hex
                    colors.
                </div>
                <SearchBox
                    handleSearch={handleSearch}
                    handleSearchInput={handleSearchInput}
                    searchInput={searchInput}
                />
                <nav className="main-nav">
                    <NavLink to="/colors">Colors</NavLink>
                    <NavLink to="/palettes">Palettes</NavLink>
                    <NavLink to="/pro">Go Pro</NavLink>
                    {user ? (
                        <NavLink
                            to="/account"
                            className={`icon-link ${iconHover ? 'hover' : ''}`}
                        >
                            <UserCircle
                                onMouseEnter={handleMouseEnter}
                                className={iconHover ? 'hover' : ''}
                            />
                        </NavLink>
                    ) : (
                        <NavLink to="/account">Log In</NavLink>
                    )}
                    {user && (
                        <ul
                            className={`nostyle sub-menu ${
                                iconHover ? 'show' : 'hide'
                            }`}
                            onMouseLeave={handleMouseLeave}
                        >
                            <li>
                                <NavLink to="/account">Account</NavLink>
                            </li>
                            <li>
                                <span onClick={handleLogout}>Log Out</span>
                            </li>
                        </ul>
                    )}
                </nav>
                <div className="sidebar-toggle">
                    <label>
                        <Switch
                            onChange={handleSidebarToggle}
                            checked={isSidebarVisible}
                        />
                        <span>Sidebar</span>
                    </label>
                </div>
            </div>
            {cart && (
                <div className="header-cart">
                    <div className="cart-inner">
                        <Tooltip
                            position="bottom"
                            interactive
                            arrow="true"
                            // open="true"
                            html={
                                <div className="tooltip-content">
                                    <h3>Cart</h3>
                                    <div className="cart-item">
                                        <strong>
                                            Hexy {humanize(cart.accountType)}
                                        </strong>{' '}
                                        <span className="cart-item-price">
                                            ${cart.price}
                                        </span>
                                    </div>
                                    <div className="cart-link">
                                        <a className="button" href="/checkout">
                                            Checkout &rarr;
                                        </a>
                                    </div>
                                </div>
                            }
                        >
                            <Cart />
                            <span className="item-count">1</span>
                        </Tooltip>
                    </div>
                </div>
            )}
        </div>
    )
}

export default withRouter(Header)
