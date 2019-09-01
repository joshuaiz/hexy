import React, { useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FavoritesContext } from '../FavoritesContext'
import FavoritesPDF from './FavoritesPDF'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { ReactComponent as Palette } from '../../images/palette.svg'
import { ReactComponent as Code } from '../../images/code.svg'
import { ReactComponent as Eye } from '../../images/eye.svg'

const FavoriteActions = React.memo(
    ({
        currentUser,
        paletteName,
        paletteWasExported,
        setPaletteNameError,
        savePalette,
        paletteHasBeenSaved,
        paletteSaved,
        exportCode,
        accountLevel,
        actions,
        setActions
    }) => {
        const node = useRef()

        const { clearFavorites } = useContext(FavoritesContext)

        const leaveActions = () => {
            setTimeout(() => {
                setActions(false)
            }, 5000)
        }

        const handleClickOutside = e => {
            // console.log('clicking anywhere')
            if (node.current.contains(e.target)) {
                // inside click
                // setTimeout(() => {
                //     setActions(false)
                // }, 1000)

                return
            }
            // outside click
            setActions(false)
        }

        useEffect(() => {
            if (actions) {
                document.addEventListener('mousedown', handleClickOutside)
            } else {
                document.removeEventListener('mousedown', handleClickOutside)
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside)
            }
        }, [actions])

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
            <div
                ref={node}
                className={`favorite-actions`}
                onMouseLeave={leaveActions}
            >
                <ul className="actions-list nostyle">
                    <li>
                        <FavoritesPDF
                            currentUser={currentUser}
                            paletteName={paletteName && paletteName}
                            paletteWasExported={paletteWasExported}
                            setPaletteNameError={setPaletteNameError}
                        />
                    </li>
                    {currentUser && (
                        <li>
                            <div className="save-palette">
                                <span
                                    className="save-icon icon-wrap"
                                    onClick={() => {
                                        savePalette()
                                        paletteHasBeenSaved()
                                    }}
                                >
                                    <Palette style={{ color: '#555555' }} />
                                </span>
                                <span
                                    className="save-text linkish"
                                    onClick={() => {
                                        savePalette()
                                        paletteHasBeenSaved()
                                    }}
                                >
                                    {paletteSaved
                                        ? 'Palette saved!'
                                        : 'Save Palette'}
                                </span>
                            </div>
                        </li>
                    )}
                    {currentUser && (
                        <li>
                            <div className="export-code">
                                <span
                                    className={`export-css icon-wrap ${
                                        accountLevel && accountLevel === 'high'
                                            ? 'enabled'
                                            : 'disabled'
                                    }`}
                                    onClick={exportCode}
                                >
                                    <Code />
                                </span>
                                <span
                                    onClick={exportCode}
                                    className="export-text linkish"
                                >
                                    Export SCSS Code
                                </span>
                            </div>
                        </li>
                    )}

                    <li className="clear-favorites-action">
                        <div className="clear-fav">
                            <span
                                className="clear-favorites icon-wrap"
                                onClick={clearFavorites}
                            >
                                <TimesCircle
                                    style={{
                                        color: '#f35336'
                                    }}
                                />
                            </span>
                            <span
                                onClick={clearFavorites}
                                className="clear-text linkish"
                            >
                                Clear Favorites
                            </span>
                        </div>
                    </li>
                    {currentUser && (
                        <li className="view-palettes">
                            <div className="account-link">
                                <Link to="/account">
                                    <div className="link-wrap">
                                        <span className="icon-wrap">
                                            <Eye />
                                        </span>
                                        <span className="link-text">
                                            View your palettes &rarr;
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
        )
    }
)

export default FavoriteActions
