import React from 'react'
import FeedItem from '../FeedItem'

const FeedList = React.memo(({ feed, handleLike, swatchInfo }) => {
    return (
        <ul className={`nostyle feed-list ${swatchInfo ? 'no-info' : 'info'}`}>
            {feed.map((item, index) => {
                return (
                    <FeedItem
                        key={item.date}
                        item={item}
                        handleLike={handleLike}
                    />
                )
            })}
        </ul>
    )
})

export default FeedList
