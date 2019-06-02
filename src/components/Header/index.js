import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import * as firebase from 'firebase/app'
import Switch from 'react-switch'
import SearchBox from './SearchBox'
import { ReactComponent as UserCircle } from '../../images/user-circle.svg'
import { getNumberOfNamedColors } from '../../utils/helpers'
import './Header.scss'

let num = getNumberOfNamedColors()

const Header = ({
    handleSearch,
    handleSearchInput,
    searchInput,
    handleSidebarToggle,
    isSidebarVisible
}) => {
    const { user } = useAuthState(firebase.auth())
    const [iconHover, setIconHover] = useState(false)

    // console.log(user)

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
                <div className="site-id">
                    <div className="logo">
                        <svg
                            id="Layer_1"
                            width="96"
                            height="96"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 96 96"
                        >
                            <circle
                                className="st0"
                                cx="47.7"
                                cy="48.1"
                                r="47.2"
                                style={{
                                    fill: '#0088cc'
                                }}
                            />
                            <path
                                className="st1"
                                style={{
                                    fill: '#FFF'
                                }}
                                d="M68.8,23.7c0.2-0.9-0.4-1.7-1.4-1.7h-5.6c-0.9,0-1.9,0.8-2.1,1.7l-3.7,18.2c-0.2,0.9-1.1,1.7-2.1,1.7l-11.2,0 c-0.9,0-1.6-0.8-1.4-1.7L45,23.7c0.2-0.9-0.4-1.7-1.4-1.7h-5.7c-0.9,0-1.9,0.8-2,1.7L32.4,42c-0.2,0.9-1.1,1.7-2,1.7h-7.7 c-0.9,0-1.9,0.8-2,1.7l-1,5.1c-0.2,0.9,0.5,1.7,1.4,1.7h7.7c0.9,0,1.6,0.8,1.4,1.7l-3.7,18.6c-0.2,0.9,0.4,1.7,1.4,1.7h5.5 c0.9,0,1.9-0.8,2-1.7L39,53.9c0.2-0.9,1.1-1.7,2-1.7h11.4c0.9,0,1.6,0.8,1.4,1.7l-3.6,18.6c-0.2,0.9,0.4,1.7,1.4,1.7H57 c0.9,0,1.9-0.8,2.1-1.7l3.6-18.6c0.2-0.9,1.1-1.7,2.1-1.7h7.7c0.9,0,1.9-0.8,2.1-1.7l1.1-5.1c0.2-0.9-0.4-1.7-1.4-1.7h-7.7 c-0.9,0-1.6-0.8-1.4-1.7L68.8,23.7z"
                            />
                        </svg>
                    </div>
                    <div className="site-title">
                        <Link to="/">
                            <h1>hexy</h1>
                        </Link>
                    </div>
                </div>
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
        </div>
    )
}

export default Header
