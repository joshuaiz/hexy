import React, { useState, useEffect } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as firebase from 'firebase/app'
import { Tooltip } from 'react-tippy'
import Switch from 'react-switch'
import SearchBox from './SearchBox'
import SiteID from '../SiteID'
import { ReactComponent as UserCircle } from '../../images/user-circle.svg'
import { ReactComponent as Cart } from '../../images/cart.svg'
import { ReactComponent as Heart } from '../../images/heart.svg'
import { getNumberOfNamedColors, humanize } from '../../utils/helpers'
import { logout } from '../../utils/user'

import './Header.scss'

let num = getNumberOfNamedColors()

const Header = ({
    handleSearch,
    handleSearchInput,
    searchInput,
    handleSidebarToggle,
    isSidebarVisible,
    cart,
}) => {
    const [user, loading, error] = useAuthState(firebase.auth())
    const [iconHover, setIconHover] = useState(false)

    const handleLogout = () => {
        logout()
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

    useEffect(() => {
        let timeout
        let didCancel = false
        if (!didCancel) {
            document.onmousemove = function () {
                // console.log('mouse stopped!')
                clearTimeout(timeout)
                timeout = setTimeout(() => {
                    setIconHover(false)
                }, 2000)
            }
        }
        return () => {
            didCancel = true
            clearTimeout(timeout)
        }
    })

    return (
        <div id="top" className="header">
            <div className="header-bar">
                <SiteID />
                <div className="header-tagline">
                    Explore {num ? num : '18,000+'} named hex colors.
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
                <div
                    className={`sidebar-toggle ${
                        isSidebarVisible ? 'visible' : 'hidden'
                    }`}
                >
                    <label>
                        <Switch
                            onChange={handleSidebarToggle}
                            checked={isSidebarVisible}
                            checkedIcon={<Heart />}
                            uncheckedIcon={<Heart />}
                        />
                        <span className="sidebar-label">Sidebar</span>
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
