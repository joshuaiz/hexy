import React from 'react'

const PriceTable = ({ addToCart }) => {
    const standard = 'standard'
    const pro = 'pro'
    const proUnlimited = 'pro_unlimited'
    const proLifetime = 'pro_lifetime'
    return (
        <ul className="nostyle account-list">
            <li className="account-free">
                <div className="account-title">
                    <h2>Free</h2>
                </div>
                <div className="account-features">
                    <div className="account-meta">
                        <div className="account-price">$0.00</div>
                        <div className="account-license">no license</div>
                    </div>

                    <ul className="nostyle features-list">
                        <li>browse named colors</li>
                        <li>add favorites</li>
                        <li>export favorites to PDF</li>
                        <li>view public palettes</li>
                        <li>add up to 5 favorites at a time</li>
                        <li>community support</li>
                    </ul>
                </div>

                <div className="signup">
                    <button
                        className="button"
                        onClick={() => addToCart(standard, 0)}
                    >
                        Sign Up
                    </button>
                </div>
            </li>
            <li className="account-pro">
                <div className="account-title">
                    <h2>Pro</h2>
                </div>
                <div className="account-features">
                    <div className="account-meta">
                        <div className="account-price">$19.00/year</div>
                        <div className="account-payment">paid yearly</div>
                        <div className="account-license">1-year license</div>
                    </div>
                    <ul className="nostyle features-list">
                        <li>browse named colors</li>
                        <li>add favorites</li>
                        <li>export favorites to PDF</li>
                        <li>view public palettes</li>
                        <li>add up to 10 favorites at a time</li>
                        <li>save favorites to profile</li>
                        <li>save 50 palettes</li>
                        <li>private palettes</li>
                        <li>priority support</li>
                    </ul>
                </div>

                <div className="signup">
                    <button
                        className="button"
                        onClick={() => addToCart(pro, 19.0)}
                    >
                        Get Pro!
                    </button>
                </div>
            </li>
            <li className="account-pro-unlimited">
                <div className="starburst-outer">
                    <div className="starburst">
                        <span>Best Value!</span>
                    </div>
                </div>

                <div className="account-title">
                    <h2>Pro Unlimited</h2>
                </div>
                <div className="account-features">
                    <div className="account-meta">
                        <div className="account-price">$49.00/year</div>
                        <div className="account-payment">paid yearly</div>
                        <div className="account-license">1-year license</div>
                    </div>

                    <ul className="nostyle features-list">
                        <li>browse named colors</li>
                        <li>add favorites</li>
                        <li>export favorites to PDF</li>
                        <li>view public palettes</li>
                        <li>add up to 15 favorites at a time</li>
                        <li>save favorites to profile</li>
                        <li>save 100 palettes</li>
                        <li>private palettes</li>
                        <li>export palettes to scss</li>
                        <li>dedicated priority support</li>
                        <li>early access to new colors</li>
                        <li>early access to new features</li>
                    </ul>
                </div>

                <div className="signup">
                    <button
                        className="button"
                        onClick={() => addToCart(proUnlimited, 49.0)}
                    >
                        Get Pro Unlimited!
                    </button>
                </div>
            </li>
            <li className="account-pro-lifetime">
                <div className="account-title">
                    <h2>Pro Lifetime</h2>
                </div>
                <div className="account-features">
                    <div className="account-meta">
                        <div className="account-price">$199.00</div>
                        <div className="account-info">
                            <div className="account-payment">
                                one-time payment
                            </div>
                            <div className="account-license">
                                lifetime license
                            </div>
                        </div>
                    </div>

                    <ul className="nostyle features-list">
                        <li>browse named colors</li>
                        <li>add favorites</li>
                        <li>export favorites to PDF</li>
                        <li>view public palettes</li>
                        <li>add up to 15 favorites at a time</li>
                        <li>save favorites to profile</li>
                        <li>save unlimited palettes</li>
                        <li>private palettes</li>
                        <li>export palettes to scss</li>
                        <li>dedicated priority support</li>
                        <li>early access to new colors</li>
                        <li>early access to new features</li>
                    </ul>
                </div>

                <div className="signup">
                    <button
                        className="button"
                        onClick={() => addToCart(proLifetime, 199)}
                    >
                        Get Pro Lifetime!
                    </button>
                </div>
            </li>
        </ul>
    )
}

export default PriceTable
