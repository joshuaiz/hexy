import React, { useState, useRef, useEffect, Fragment } from 'react'
import Tippy from '@tippy.js/react'
import { Tooltip } from 'react-tippy'
import FavoritesPDF from '../Favorites/FavoritesPDF'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { ReactComponent as Share } from '../../images/share.svg'
import { ReactComponent as Code } from '../../images/code.svg'
import { ReactComponent as Links } from '../../images/link.svg'
import { ReactComponent as Ellipsis } from '../../images/ellipsis.svg'

const PaletteActions = ({
    palette,
    currentUser,
    accountLevel,
    shareLink,
    sharePalette,
    exportCode,
    deletePalette
    // actions,
    // setActions
}) => {
    const [actions, setActions] = useState()
    const node = useRef()

    const enterActions = () => {
        setActions(true)
    }

    const leaveActions = () => {
        setTimeout(() => {
            setActions(false)
        }, 2000)
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
        <Fragment>
            <span
                className="actions-trigger"
                aria-haspopup="true"
                aria-expanded={`${actions ? 'true' : 'false'}`}
                onMouseEnter={enterActions}
            >
                <Ellipsis />
            </span>
            {actions && (
                <div
                    ref={node}
                    className="palette-actions"
                    onMouseLeave={leaveActions}
                >
                    <div className="actions-wrap">
                        <ul className="actions-list nostyle">
                            <li>
                                <div className="share-link">
                                    <Tippy
                                        // options
                                        content="Get shareable link"
                                        placement="top"
                                        trigger="mouseenter"
                                        arrow={true}
                                    >
                                        <span
                                            className={`export-css ${
                                                accountLevel &&
                                                accountLevel === 'high'
                                                    ? 'enabled'
                                                    : 'disabled'
                                            }`}
                                            onClick={() => shareLink(palette)}
                                        >
                                            <Links />
                                        </span>
                                    </Tippy>
                                </div>
                            </li>
                            {palette.palette.length <= 5 && (
                                <li>
                                    <div className="share-palette">
                                        <Tippy
                                            // options
                                            content="Share to public palettes"
                                            placement="top"
                                            trigger="mouseenter"
                                            arrow={true}
                                        >
                                            <Share
                                                onClick={() =>
                                                    sharePalette(
                                                        palette.name,
                                                        palette.palette
                                                    )
                                                }
                                            />
                                        </Tippy>
                                    </div>
                                </li>
                            )}

                            <li>
                                <Tooltip
                                    // options
                                    title="Export to PDF"
                                    position="top"
                                    trigger="mouseenter"
                                    arrow={true}
                                >
                                    <FavoritesPDF
                                        favorites={
                                            palette.palette && palette.palette
                                        }
                                        paletteName={
                                            palette.name && palette.name
                                        }
                                    />
                                </Tooltip>
                            </li>
                            <li>
                                <div className="export-code">
                                    <Tippy
                                        // options
                                        content="Export SCSS code"
                                        placement="top"
                                        trigger="mouseenter"
                                        arrow={true}
                                    >
                                        <span
                                            className={`export-css ${
                                                accountLevel &&
                                                accountLevel === 'high'
                                                    ? 'enabled'
                                                    : 'disabled'
                                            }`}
                                            onClick={() =>
                                                exportCode(
                                                    palette.palette,
                                                    palette.name
                                                )
                                            }
                                        >
                                            <Code />
                                        </span>
                                    </Tippy>
                                </div>
                            </li>
                            <li>
                                <div className="delete-palette">
                                    <Tippy
                                        // options
                                        content="Delete palette"
                                        placement="top"
                                        trigger="mouseenter"
                                        arrow={true}
                                    >
                                        <span
                                            className="palette-delete"
                                            onClick={() =>
                                                deletePalette(palette.name)
                                            }
                                        >
                                            <TimesCircle
                                                style={{
                                                    color: '#f35336'
                                                }}
                                            />
                                        </span>
                                    </Tippy>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </Fragment>
    )
}

export default PaletteActions
