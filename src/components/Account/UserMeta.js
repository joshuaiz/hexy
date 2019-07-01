import React from 'react'
import { humanize, getExpirationDate } from '../../utils/helpers'

const UserMeta = ({ currentUser, active }) => {
    return (
        <div className={`user-meta ${active ? 'active' : 'inactive'}`}>
            <h3>Hexy Account:</h3>
            <div className="account-email">
                <strong>Account Email:</strong>{' '}
                {currentUser && currentUser.email ? currentUser.email : ''}
            </div>
            <div className="start-date">
                <strong>Account created:</strong>{' '}
                {currentUser && currentUser.startDate}
            </div>
            <div className="account-level">
                <strong>Account Level:</strong>{' '}
                {currentUser && humanize(currentUser.accountType)}
            </div>
            <div className="account-expiration">
                <strong>Valid Until:</strong>{' '}
                {currentUser && currentUser.accountType !== 'pro_lifetime'
                    ? getExpirationDate(currentUser.accountStartDate)
                    : 'Forever'}
            </div>
        </div>
    )
}

export default UserMeta
