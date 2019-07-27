import React, { useState, useEffect } from 'react'
import { Draggable } from 'react-beautiful-dnd'
import SwatchActions from '../Swatch/SwatchActions'
import { ReactComponent as PlusCircle } from '../../images/plus_circle.svg'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { ReactComponent as Ellipsis } from '../../images/ellipsis.svg'
import { getReadableColor } from '../../utils/helpers'
import './Swatch.scss'

const FavoriteSwatch = ({
    color,
    index,
    handleFavorites,
    isFavorite,
    removeFavorite,
    isSquare
}) => {
    const [actions, setActions] = useState()
    const readableColor = getReadableColor(color)

    let key = ''
    if (!isSquare) {
        key = color.hex + '-favorite'
    } else {
        key = color.hex + '-square'
    }

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
                        <span
                            className="actions-trigger"
                            aria-haspopup="true"
                            aria-expanded={`${actions ? 'true' : 'false'}`}
                            onMouseEnter={() => setActions(true)}
                        >
                            <Ellipsis style={{ fill: readableColor }} />
                        </span>
                        {actions && (
                            <div className="actions-wrap">
                                <SwatchActions
                                    removeFavorite={removeFavorite}
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
