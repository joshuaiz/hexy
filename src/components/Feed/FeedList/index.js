import React from 'react'
import { ReactComponent as Heart } from '../../../images/heart.svg'
import Swatch from '../../Swatch'
import FavoritesPDF from '../../Favorites/FavoritesPDF'

const FeedList = ({
    feed,
    handleLike,
    handleFavorites,
    removeFavorite,
    swatchInfo
}) => {
    return (
        <ul className={`nostyle feed-list ${swatchInfo ? 'no-info' : 'info'}`}>
            {feed.map((item, index) => {
                // console.log('FeedList', item.name, item.likes)
                return (
                    <li className="feed-item" key={item.date}>
                        <div className="palette-header">
                            <div className="palette-name">{item.name}</div>
                            <div className="palette-pdf">
                                <FavoritesPDF
                                    favorites={item.palette}
                                    paletteName={item.name}
                                    fromFeed={true}
                                />
                            </div>
                            <div className="palette-likes">
                                <span
                                    className={`likes ${
                                        item.likes !== 0 ? 'liked' : ''
                                    }`}
                                    onClick={() =>
                                        handleLike(
                                            item.pid,
                                            item.palette,
                                            item.name
                                        )
                                    }
                                >
                                    <Heart />{' '}
                                </span>

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
            })}
        </ul>
    )
}

export default FeedList
