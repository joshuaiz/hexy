import React from 'react'
import { Draggable } from 'react-beautiful-dnd'
import { ReactComponent as PlusCircle } from '../../images/plus_circle.svg'
import { ReactComponent as TimesCircle } from '../../images/times_circle.svg'
import { getReadableColor } from '../../utils/helpers'
import './Swatch.scss'

const FavoriteSwatch = ({
    color,
    index,
    handleFavorites,
    isFavorite,
    removeFavorite
}) => {
    const readableColor = getReadableColor(color)
    return (
        <Draggable draggableId={color.hex} index={index}>
            {provided => (
                <li
                    className={`swatch ${isFavorite ? 'favorite' : ''}`}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    key={color.hex + isFavorite ? '-favorite' : null}
                >
                    <div
                        className="swatch-color"
                        style={{
                            color: readableColor,
                            background: color.hex
                        }}
                    >
                        {!isFavorite ? (
                            <span
                                className="add-favorite"
                                onClick={() => handleFavorites(color)}
                            >
                                <PlusCircle style={{ fill: readableColor }} />
                            </span>
                        ) : (
                            <span
                                className="remove-favorite"
                                onClick={() => removeFavorite(color)}
                            >
                                <TimesCircle style={{ fill: readableColor }} />
                            </span>
                        )}
                        <div className="swatch-content">
                            <div className="swatch-hex">{color.hex}</div>
                            <div className="swatch-name">{color.name}</div>
                        </div>
                    </div>
                </li>
            )}
        </Draggable>
    )
}

export default FavoriteSwatch
