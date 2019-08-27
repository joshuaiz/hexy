import React, { useState, useEffect, useContext } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import HoverIntent from 'react-hoverintent'
import SwatchActions from '../Swatch/SwatchActions'
import { FavoritesContext } from '../FavoritesContext'
import { ReactComponent as PlusCircle } from '../../images/plus_circle.svg'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { ReactComponent as Ellipsis } from '../../images/ellipsis.svg'
import { getReadableColor } from '../../utils/helpers'
import './Swatch.scss'

const FavoriteSwatch = ({
    color,
    index,
    // handleFavorites,
    isFavorite,
    // removeFavorite,
    isSquare
}) => {
    const [actions, setActions] = useState()
    const readableColor = getReadableColor(color)

    const { handleFavorites, removeFavorite } = useContext(FavoritesContext)

    let key = ''
    if (!isSquare) {
        key = color.hex + '-favorite'
    } else {
        key = color.hex + '-square'
    }

    const onMouseOver = () => {
        setActions(true)
    }

    // required by hoverIntent but we're not using it
    const onMouseOut = () => {}

    // const handleMouseEnter = () => {
    //     var timer = setTimeout(() => {
    //         setActions(true)
    //     }, 500)
    // }

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
        return () => {
            clearTimeout(timeout)
        }
    })

    window.onbeforeunload = e => {
        setActions(false)
    }

    return (
        <Draggable
            draggableId={isSquare ? color.hex + '-square' : color.hex}
            index={index}
        >
            {provided => (
                <li
                    className={`swatch favorite ${isSquare ? 'square' : ''}`}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    key={key}
                >
                    <div
                        className="swatch-color"
                        style={{
                            color: readableColor,
                            background: color.hex
                        }}
                    >
                        <div className="swatch-content">
                            <div className="swatch-hex">{color.hex}</div>
                            <div className="swatch-name">{color.name}</div>
                        </div>
                        <HoverIntent
                            onMouseOver={onMouseOver}
                            onMouseOut={onMouseOut}
                            sensitivity={5}
                            interval={300}
                            timeout={0}
                        >
                            <span
                                className="actions-trigger"
                                aria-haspopup="true"
                                // eslint-disable-next-line jsx-a11y/aria-proptypes
                                aria-expanded={`${actions ? 'true' : 'false'}`}
                            >
                                <Ellipsis style={{ fill: readableColor }} />
                            </span>
                        </HoverIntent>
                        {actions && (
                            <div className="actions-wrap">
                                <SwatchActions
                                    // removeFavorite={removeFavorite}
                                    isFavorite={true}
                                    readableColor={readableColor}
                                    // namedColor={namedColor}
                                    color={color}
                                    setActions={setActions}
                                />
                            </div>
                        )}
                    </div>
                </li>
            )}
        </Draggable>
    )
}

export default FavoriteSwatch
