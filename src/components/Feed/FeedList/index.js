import React from 'react'
import { ReactComponent as Heart } from '../../../images/heart.svg'
import Swatch from '../../Swatch'

const FeedList = ({ feed, handleLike, handleFavorites, removeFavorite }) => {
    return (
        <ul className="nostyle feed-list">
            {feed.map((item, index) => {
                // console.log(item)
                return (
                    <li className="feed-item" key={item.date}>
                        <div className="palette-header">
                            <div className="palette-name">{item.name}</div>
                            <div className="palette-likes">
                                <span
                                    className={`likes ${
                                        item.likes !== 0 ? 'liked' : ''
                                    }`}
                                    onClick={() => handleLike(item.pid)}
                                >
                                    <Heart />{' '}
                                </span>

                                <span className="likes-count">
                                    {item.likes}
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
