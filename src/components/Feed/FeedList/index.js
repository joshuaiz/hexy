import React from 'react'
import FeedItem from '../FeedItem'

const FeedList = React.memo(
    ({
        feed,
        handleLike,
        handleFavorites,
        handleAddPaletteToFavorites,
        removeFavorite,
        swatchInfo
    }) => {
        return (
            <ul
                className={`nostyle feed-list ${
                    swatchInfo ? 'no-info' : 'info'
                }`}
            >
                {feed.map((item, index) => {
                    return (
                        <FeedItem
                            key={item.date}
                            item={item}
                            handleLike={handleLike}
                            handleFavorites={handleFavorites}
                            handleAddPaletteToFavorites={
                                handleAddPaletteToFavorites
                            }
                            removeFavorite={removeFavorite}
                        />
                    )
                })}
            </ul>
        )
    }
)

export default FeedList
