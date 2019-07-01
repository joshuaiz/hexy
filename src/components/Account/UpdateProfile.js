import React from 'react'

const UpdateProfile = ({ handleUpdate, active, setActive, setRef }) => {
    return (
        <div className="update-profile-inner">
            <span className="update-profile-trigger">Update Your Profile</span>
            <span className="close-update" onClick={() => setActive('close')}>
                &times;
            </span>
            <form className="tab-form" onSubmit={handleUpdate} ref={setRef}>
                <label>
                    <div className="input-label">Username</div>
                    <input
                        name="username"
                        type="text"
                        placeholder="Username (no spaces or special characters)"
                    />
                </label>
                <label>
                    <div className="input-label">Email</div>
                    <input
                        name="email"
                        type="email"
                        placeholder="you@youremail.com"
                    />
                </label>
                <label>
                    <div className="input-label">Password</div>
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                </label>
                <button className="button" type="submit">
                    Update Profile
                </button>
            </form>
        </div>
    )
}

export default UpdateProfile
