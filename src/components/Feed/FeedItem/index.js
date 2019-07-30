import React, { useState, useEffect } from 'react'
import Tippy from '@tippy.js/react'
import { Tooltip } from 'react-tippy'
import { ReactComponent as Heart } from '../../../images/heart.svg'
import { ReactComponent as PlusCircle } from '../../../images/plus_circle.svg'
import { ReactComponent as AddFavorites } from '../../../images/add_favorites.svg'
import { ReactComponent as RemoveFavorites } from '../../../images/remove_favorites.svg'
import Swatch from '../../Swatch'
import FavoritesPDF from '../../Favorites/FavoritesPDF'
import { setLocalStorage, getLocalStorage } from '../../../utils/helpers'

const FeedItem = ({
    item,
    handleAddPaletteToFavorites,
    handleLike,
    handleFavorites,
    removeFavorite
}) => {
    const [added, setAdded] = useState(false)

    const localAddedPalettes = getLocalStorage('hexy_added_palettes')

    const handleAddPaletteState = item => {
        const localAddedPalettes = getLocalStorage('hexy_added_palettes')
        const localFavorites = getLocalStorage('hexy_favorites')

        let favLength = localFavorites.length + 5

        let addedPalette = {
            name: item.name,
            pid: item.pid
        }

        if (favLength > 15 && !added) {
            return
        }

        console.log('handleAddPaletteState', favLength)

        if (localAddedPalettes && localAddedPalettes.length) {
            const found = localAddedPalettes.some(el => el.name === item.name)
            if (!found) {
                const newPalettes = [...localAddedPalettes, { ...addedPalette }]
                setLocalStorage('hexy_added_palettes', newPalettes)
                setAdded(true)
            } else {
                let filteredPalettes = localAddedPalettes.filter(
                    el => el.name !== item.name
                )
                setLocalStorage('hexy_added_palettes', filteredPalettes)
                setAdded(false)
            }
        } else if (!localAddedPalettes || localAddedPalettes.length === 0) {
            setLocalStorage('hexy_added_palettes', [{ ...addedPalette }])
            setAdded(true)
        }
    }

    useEffect(() => {
        if (localAddedPalettes && localAddedPalettes.length) {
            let foundPalette = localAddedPalettes.some(
                el => el.name === item.name
            )
            if (foundPalette) {
                setAdded(true)
            }
        } else {
            setAdded(false)
        }
    }, [localAddedPalettes, setAdded, added])

    return (
        <li className="feed-item">
            <div className="palette-header">
                <div className="palette-name">{item.name}</div>

                <div className="palette-pdf">
                    <Tooltip
                        // options
                        title="Export to PDF"
                        position="top"
                        trigger="mouseenter"
                        arrow={true}
                    >
                        <FavoritesPDF
                            favorites={item.palette}
                            paletteName={item.name}
                            fromFeed={true}
                        />
                    </Tooltip>
                </div>

                <div className="add-favorites">
                    <Tippy
                        // options
                        content={`${
                            added
                                ? 'Remove palette colors from Favorites'
                                : 'Add palette colors to Favorites'
                        }`}
                        placement="top"
                        trigger="mouseenter"
                        size="small"
                        arrow={true}
                    >
                        <span
                            className={`add-favorites-wrap ${
                                added ? 'added' : 'not-added'
                            }`}
                            onClick={() => {
                                handleAddPaletteState(item)
                                handleAddPaletteToFavorites(item.palette)
                            }}
                        >
                            {added ? <RemoveFavorites /> : <AddFavorites />}
                        </span>
                    </Tippy>
                </div>
                <div className="palette-likes">
                    <Tippy
                        // options
                        content="Like Palette"
                        placement="top"
                        trigger="mouseenter"
                        size="small"
                        arrow={true}
                    >
                        <span
                            className={`likes ${
                                item.likes !== 0 ? 'liked' : ''
                            }`}
                            onClick={() =>
                                handleLike(item.pid, item.palette, item.name)
                            }
                        >
                            <Heart />{' '}
                        </span>
                    </Tippy>

                    <span className="likes-count">
                        {item.likes && item.likes}
                    </span>
                </div>
            </div>

            <ul className="nostyle feed-palette">
                {item.palette.map((color, index) => {
                    return (
                        <Swatch
                            key={`palette-${item.date}-${index}`}
                            color={color}
                            index={index}
                            handleFavorites={handleFavorites}
                            removeFavorite={removeFavorite}
                        />
                    )
                })}
            </ul>
        </li>
    )
}

export default FeedItem
