import React, { useState } from 'react'
import { Link } from 'react-router-dom'
// import { Tooltip } from 'react-tippy'
import Tippy from '@tippy.js/react'
import { ReactComponent as PlusCircle } from '../../images/plus_circle.svg'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { ReactComponent as Heart } from '../../images/heart.svg'
import { ReactComponent as Hashtag } from '../../images/hashtag.svg'
import { ReactComponent as ExternalLink } from '../../images/external_link.svg'

const SwatchActions = React.memo(
    ({
        isFavorite,
        handleFavorites,
        removeFavorite,
        namedColor,
        color,
        readableColor,
        actions,
        setActions
    }) => {
        const [copySuccess, setCopySuccess] = useState(false)

        const link = `/color/${color.hex.slice(1)}`

        const copyHexCode = () => {
            navigator.clipboard.writeText(color.hex)
            setCopySuccess(true)
            setTimeout(() => {
                setCopySuccess(false)
            }, 1000)
        }

        const leaveActions = () => {
            setTimeout(() => {
                setActions(false)
            }, 1000)
        }

        return (
            <div className={`swatch-actions`} onMouseLeave={leaveActions}>
                <ul className="actions-list nostyle">
                    {!isFavorite ? (
                        <li>
                            <Tippy
                                // options
                                content="Add color to Favorites"
                                placement="top"
                                trigger="mouseenter"
                                size="small"
                                offset="0, 10"
                                sticky={true}
                                arrow={true}
                            >
                                <span
                                    className="add-favorite"
                                    onClick={() => {
                                        handleFavorites({
                                            name:
                                                namedColor && namedColor.length
                                                    ? namedColor[0].name
                                                    : color.name,
                                            hex: color.hex
                                        })
                                    }}
                                >
                                    <Heart />
                                </span>
                            </Tippy>
                        </li>
                    ) : (
                        <li>
                            <Tippy
                                // options
                                content="Remove from Favorites"
                                placement="top"
                                size="small"
                                trigger="mouseenter"
                                offset="0, 10"
                                arrow={true}
                            >
                                <span
                                    className="remove-favorite"
                                    onClick={() => {
                                        removeFavorite(color)
                                    }}
                                >
                                    <TimesCircle />
                                </span>
                            </Tippy>
                        </li>
                    )}

                    <li>
                        <Tippy
                            // options
                            content={
                                copySuccess
                                    ? `${color.hex} copied!`
                                    : 'Copy hex code'
                            }
                            placement="top"
                            trigger="mouseenter"
                            size="small"
                            delay={[0, 1000]}
                            arrow={true}
                            offset="0, 10"
                            hideOnClick="toggle"
                        >
                            <span className="copy-hex" onClick={copyHexCode}>
                                <Hashtag />
                            </span>
                        </Tippy>
                    </li>
                    <li>
                        <Tippy
                            // options
                            content="Color detail page"
                            placement="top"
                            trigger="mouseenter"
                            size="small"
                            arrow={true}
                            offset="0, 10"
                            delay={[0, 1000]}
                        >
                            <span className="color-link">
                                <Link to={link}>
                                    <ExternalLink />
                                </Link>
                            </span>
                        </Tippy>
                    </li>
                </ul>
            </div>
        )
    }
)

// SwatchActions.whyDidYouRender = true

export default SwatchActions
